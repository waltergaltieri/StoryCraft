import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configurar OpenAI - Solo usar variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzeImageRequest {
  image: string; // Base64 image
  type: 'persona' | 'objeto' | 'entorno';
  filename: string;
}

interface AnalyzeImageResponse {
  success: boolean;
  description?: string;
  error?: string;
}

// Prompts específicos para cada tipo de imagen
const getPromptForType = (type: 'persona' | 'objeto' | 'entorno') => {
  switch (type) {
    case 'persona':
      return `Actúa como director de casting para una producción cinematográfica. Describe esta persona como si fueras a contratar un actor/actriz similar para un papel. Incluye: complexión física general (altura aparente, constitución), rango de edad aparente, tono de piel general, estilo y color de cabello, vestimenta completa (tipo, colores, materiales), postura y lenguaje corporal, accesorios visibles. Enfócate en características que un director de casting necesitaría para encontrar un actor similar. Sé específico pero profesional.`;

    case 'objeto':
      return `Describe este objeto con precisión para generar video. Incluye: tipo de objeto, forma, tamaño, material principal, colores exactos, textura, detalles decorativos y su ubicación específica en el objeto. Sé muy específico.`;

    case 'entorno':
      return `Describe este entorno con precisión para generar video. Incluye: tipo de espacio, dimensiones aparentes, materiales de paredes/piso/techo, muebles presentes, iluminación, colores dominantes. Sé específico con ubicaciones y materiales.`;

    default:
      return "Describe lo que ves con precisión para generar video.";
  }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalyzeImageRequest = await request.json();
    const { image, type, filename } = body;

    // Validaciones
    if (!image || !type) {
      return NextResponse.json(
        { success: false, error: 'Imagen y tipo son requeridos' },
        { status: 400 }
      );
    }

    if (!['persona', 'objeto', 'entorno'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo debe ser: persona, objeto o entorno' },
        { status: 400 }
      );
    }

    // API key está hardcodeada, proceder directamente con OpenAI

    console.log(`🔍 Analizando imagen tipo "${type}": ${filename}`);

    // Función para verificar si OpenAI tiene fondos disponibles
    const checkOpenAIQuota = async () => {
      try {
        // Hacer una llamada muy pequeña para verificar el estado de la cuenta
        const testResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Modelo más barato para testing
          messages: [{ role: "user", content: "test" }],
          max_tokens: 1,
          temperature: 0
        });
        
        console.log('✅ OpenAI quota disponible');
        return true;
      } catch (error: any) {
        if (error.status === 429 || error.code === 'insufficient_quota') {
          console.log('💸 OpenAI quota agotada - usando modo respaldo');
          return false;
        }
        // Si es otro tipo de error, asumir que hay fondos pero hay otro problema
        console.log('⚠️ Error verificando quota, pero continuando:', error.message);
        return true;
      }
    };

    // Verificar fondos antes de proceder
    const hasQuota = await checkOpenAIQuota();
    
    if (!hasQuota) {
      console.log(`💸 FONDOS AGOTADOS para ${type} - activando modo respaldo inmediato`);
      
      // Generar descripción de respaldo inmediatamente
      const generateDetailedFallback = (type: string) => {
        if (type === 'persona') {
          const ages = ['joven adulto (20-30 años)', 'adulto (30-45 años)', 'adulto maduro (45-60 años)'];
          const builds = ['complexión delgada', 'complexión atlética', 'complexión promedio', 'complexión robusta'];
          const styles = ['estilo casual moderno', 'estilo profesional', 'estilo deportivo', 'estilo elegante'];
          const hair = ['cabello corto oscuro', 'cabello medio castaño', 'cabello largo rubio', 'cabello rizado'];
          const clothes = ['camisa y pantalones', 'vestido casual', 'traje formal', 'ropa deportiva'];
          
          const randomAge = ages[Math.floor(Math.random() * ages.length)];
          const randomBuild = builds[Math.floor(Math.random() * builds.length)];
          const randomStyle = styles[Math.floor(Math.random() * styles.length)];
          const randomHair = hair[Math.floor(Math.random() * hair.length)];
          const randomClothes = clothes[Math.floor(Math.random() * clothes.length)];
          
          return `Persona de ${randomAge}, ${randomBuild}, ${randomHair}, vistiendo ${randomClothes} con ${randomStyle}. Postura erguida y expresión neutral, adecuado para representación en video.`;
        }
        return type === 'objeto' 
          ? 'Objeto de uso cotidiano con diseño funcional, materiales de calidad media, colores estándar, forma ergonómica adaptada a su propósito específico.'
          : 'Espacio interior bien iluminado, decoración moderna y funcional, colores neutros y cálidos, mobiliario estándar dispuesto de manera práctica y cómoda.';
      };

      const description = generateDetailedFallback(type) + ' (Descripción generada automáticamente - fondos de OpenAI agotados)';
      
      console.log(`✅ Descripción de respaldo generada para ${type}: ${description.substring(0, 100)}...`);
      
      return NextResponse.json({
        success: true,
        description: description
      } as AnalyzeImageResponse);
    }

    // Función para hacer llamada a OpenAI
    const makeOpenAICall = async (promptText: string, attempt: number = 1) => {
      console.log(`📝 Intento ${attempt} con prompt para ${type}`);
      
      return await openai.chat.completions.create({
        model: "gpt-4o", // Modelo con capacidades de visión
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                  detail: "high" // Análisis de alta calidad
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3, // Menor creatividad, más precisión
      });
    };

    // Intentar con prompt original
    let response;
    let description;
    
    try {
      response = await makeOpenAICall(getPromptForType(type), 1);
      description = response.choices[0]?.message?.content?.trim();

      if (!description) {
        throw new Error('No se pudo generar descripción');
      }
    } catch (error: any) {
      // 🚨 DETECTAR ERROR DE CUOTA/RATE LIMIT Y ACTIVAR RESPALDO INMEDIATO
      if (error.status === 429 || error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
        console.log(`💸 CUOTA AGOTADA para ${type} - activando modo respaldo inmediato`);
        
        // Generar descripción de respaldo inmediatamente sin más intentos
        const generateDetailedFallback = (type: string) => {
          if (type === 'persona') {
            const ages = ['joven adulto (20-30 años)', 'adulto (30-45 años)', 'adulto maduro (45-60 años)'];
            const builds = ['complexión delgada', 'complexión atlética', 'complexión promedio', 'complexión robusta'];
            const styles = ['estilo casual moderno', 'estilo profesional', 'estilo deportivo', 'estilo elegante'];
            const hair = ['cabello corto oscuro', 'cabello medio castaño', 'cabello largo rubio', 'cabello rizado'];
            const clothes = ['camisa y pantalones', 'vestido casual', 'traje formal', 'ropa deportiva'];
            
            const randomAge = ages[Math.floor(Math.random() * ages.length)];
            const randomBuild = builds[Math.floor(Math.random() * builds.length)];
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            const randomHair = hair[Math.floor(Math.random() * hair.length)];
            const randomClothes = clothes[Math.floor(Math.random() * clothes.length)];
            
            return `Persona de ${randomAge}, ${randomBuild}, ${randomHair}, vistiendo ${randomClothes} con ${randomStyle}. Postura erguida y expresión neutral, adecuado para representación en video.`;
          }
          return type === 'objeto' 
            ? 'Objeto de uso cotidiano con diseño funcional, materiales de calidad media, colores estándar, forma ergonómica adaptada a su propósito específico.'
            : 'Espacio interior bien iluminado, decoración moderna y funcional, colores neutros y cálidos, mobiliario estándar dispuesto de manera práctica y cómoda.';
        };

        description = generateDetailedFallback(type) + ' (Descripción generada automáticamente - cuota de OpenAI agotada)';
        
        console.log(`✅ Descripción de respaldo generada para ${type}: ${description.substring(0, 100)}...`);
        
        return NextResponse.json({
          success: true,
          description: description
        } as AnalyzeImageResponse);
      }
      
      // Si no es error de cuota, relanzar el error
      throw error;
    }

    // 🚨 DETECTAR RECHAZO DE OPENAI Y REINTENTAR CON PROMPT MÁS GENÉRICO
    if (description.includes('Lo siento, no puedo') || 
        description.includes('I cannot') || 
        description.includes('I\'m not able') ||
        description.includes('I can\'t help')) {
      
      console.log(`⚠️ OpenAI rechazó la imagen de ${type}, intentando con prompt más genérico...`);
      
             // Prompts más genéricos para segundo intento
       const genericPrompts = {
         'persona': 'Como asistente de vestuario, describe la apariencia física general, edad aproximada, vestimenta y estilo de esta persona para crear un personaje similar en una producción audiovisual.',
         'objeto': 'Describe este objeto: forma, color y material principal.',
         'entorno': 'Describe este espacio: tipo de lugar, colores dominantes y elementos principales.'
       };
      
      try {
        // Segundo intento con prompt genérico
        const secondResponse = await makeOpenAICall(genericPrompts[type], 2);
        const secondDescription = secondResponse.choices[0]?.message?.content?.trim();
        
                 if (secondDescription && 
             !secondDescription.includes('Lo siento, no puedo') &&
             !secondDescription.includes('I cannot') &&
             !secondDescription.includes('I\'m not able') &&
             !secondDescription.includes('I can\'t help')) {
           
           console.log(`✅ Segundo intento exitoso para ${type}`);
           description = secondDescription + ' (Análisis con prompt genérico)';
         } else {
           console.log(`⚠️ Segundo intento falló, probando tercer enfoque para ${type}...`);
           
           // TERCER INTENTO: Enfoque de descripción artística/creativa
           const creativePrompts = {
             'persona': 'Describe esta imagen como si fueras un ilustrador que necesita recrear este personaje para un cómic o animación. Incluye detalles físicos, vestimenta, edad aproximada y características distintivas necesarias para el diseño del personaje.',
             'objeto': 'Como diseñador industrial, describe las características técnicas y estéticas de este objeto.',
             'entorno': 'Como arquitecto de interiores, describe este espacio y sus elementos de diseño.'
           };
           
           try {
             const thirdResponse = await makeOpenAICall(creativePrompts[type], 3);
             const thirdDescription = thirdResponse.choices[0]?.message?.content?.trim();
             
             if (thirdDescription && 
                 !thirdDescription.includes('Lo siento, no puedo') &&
                 !thirdDescription.includes('I cannot') &&
                 !thirdDescription.includes('I\'m not able') &&
                 !thirdDescription.includes('I can\'t help')) {
               
               console.log(`✅ Tercer intento exitoso para ${type}`);
               description = thirdDescription + ' (Análisis con enfoque creativo)';
             } else {
               throw new Error('Tercer intento también rechazado');
             }
           } catch (error) {
             throw new Error('Todos los intentos fallaron');
           }
         }
        
      } catch (error) {
        console.log(`❌ Segundo intento falló, usando descripción de respaldo para ${type}`);
        
                 // Generar descripción de respaldo más detallada y variada
         const generateDetailedFallback = (type: string) => {
           if (type === 'persona') {
             const ages = ['joven adulto (20-30 años)', 'adulto (30-45 años)', 'adulto maduro (45-60 años)'];
             const builds = ['complexión delgada', 'complexión atlética', 'complexión promedio', 'complexión robusta'];
             const styles = ['estilo casual moderno', 'estilo profesional', 'estilo deportivo', 'estilo elegante'];
             const hair = ['cabello corto oscuro', 'cabello medio castaño', 'cabello largo rubio', 'cabello rizado'];
             const clothes = ['camisa y pantalones', 'vestido casual', 'traje formal', 'ropa deportiva'];
             
             const randomAge = ages[Math.floor(Math.random() * ages.length)];
             const randomBuild = builds[Math.floor(Math.random() * builds.length)];
             const randomStyle = styles[Math.floor(Math.random() * styles.length)];
             const randomHair = hair[Math.floor(Math.random() * hair.length)];
             const randomClothes = clothes[Math.floor(Math.random() * clothes.length)];
             
             return `Persona de ${randomAge}, ${randomBuild}, ${randomHair}, vistiendo ${randomClothes} con ${randomStyle}. Postura erguida y expresión neutral, adecuado para representación en video.`;
           }
           return type === 'objeto' 
             ? 'Objeto de uso cotidiano con diseño funcional, materiales de calidad media, colores estándar, forma ergonómica adaptada a su propósito específico.'
             : 'Espacio interior bien iluminado, decoración moderna y funcional, colores neutros y cálidos, mobiliario estándar dispuesto de manera práctica y cómoda.';
         };
         
         const fallbackDescriptions = {
           'persona': generateDetailedFallback('persona'),
           'objeto': generateDetailedFallback('objeto'),
           'entorno': generateDetailedFallback('entorno')
         };
        
        description = fallbackDescriptions[type] + ' (Descripción generada automáticamente - imagen rechazada por políticas de contenido)';
      }
    }

    // Limpiar frases introductorias comunes
    const phrasesToRemove = [
      /^La imagen muestra\s*/i,
      /^Se observa\s*/i,
      /^Se ve\s*/i,
      /^En la imagen\s*/i,
      /^Esta imagen presenta\s*/i,
      /^La fotografía muestra\s*/i,
      /^Se puede ver\s*/i,
      /^Aparece\s*/i,
      /^Se aprecia\s*/i,
      /^La foto muestra\s*/i
    ];

    phrasesToRemove.forEach(phrase => {
      description = description!.replace(phrase, '');
    });

    // Capitalizar primera letra después de la limpieza
    description = description.charAt(0).toUpperCase() + description.slice(1);

    console.log(`✅ Descripción generada para ${type}: ${description.substring(0, 100)}...`);

    return NextResponse.json({
      success: true,
      description: description
    } as AnalyzeImageResponse);

  } catch (error: any) {
    console.error('Error analizando imagen:', error);
    
    let errorMessage = 'Error interno del servidor';
    
    // Manejo específico de errores de OpenAI
    if (error.status === 429 || error.code === 'insufficient_quota') {
      errorMessage = 'Cuota de OpenAI agotada. Usando descripción automática.';
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Límite de velocidad de OpenAI excedido. Intenta más tarde.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Clave de API de OpenAI inválida';
    } else if (error.message?.includes('content_policy')) {
      errorMessage = 'La imagen contiene contenido no permitido';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error.status || 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Método no permitido. Usa POST para analizar imágenes.' },
    { status: 405 }
  );
} 