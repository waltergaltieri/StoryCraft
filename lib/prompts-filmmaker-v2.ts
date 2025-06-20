// AI Filmmaker Prompts - Version 2.0 - Optimized and Simplified
// Prompts más efectivos, concisos y con ejemplos específicos

interface SceneStructure {
  id: string;
  title: string;
  description: string;
  visualElements: string;
  action: string;
  duration: number;
}

// Sistema de prompts base más efectivo
const BASE_SYSTEM_PROMPT = `Eres un experto guionista y director de videos comerciales. Tu especialidad es crear guiones detallados y específicos para videos de marketing que generen resultados.

REGLAS FUNDAMENTALES:
1. Cada escena debe durar exactamente 8 segundos
2. Las descripciones deben ser específicas y visuales
3. Incluir elementos de acción clara y directa
4. Mantener coherencia narrativa entre escenas
5. Optimizar para captar atención desde el primer segundo

ESTRUCTURA REQUERIDA PARA CADA ESCENA:
- ID: Identificador único
- Título: Nombre descriptivo de la escena
- Descripción: Descripción detallada de lo que sucede
- Elementos visuales: Detalles específicos de lo que se ve
- Acción: Qué acciones específicas ocurren
- Duración: Siempre 8 segundos

RESPONDE SIEMPRE EN FORMATO JSON VÁLIDO.`;

// Prompts específicos por tipo de objetivo
const OBJECTIVE_PROMPTS = {
  'presentar-producto': {
    focus: 'Presentación clara y atractiva del producto',
    structure: 'Introducción → Demostración → Beneficio → Call to Action',
    keyElements: ['Producto visible', 'Características destacadas', 'Uso práctico', 'Propuesta de valor']
  },
  'generar-conciencia': {
    focus: 'Crear awareness y reconocimiento de marca',
    structure: 'Hook → Problema → Solución → Recordación',
    keyElements: ['Hook emocional', 'Problema relatable', 'Solución clara', 'Mensaje memorable']
  },
  'educar-audiencia': {
    focus: 'Enseñar y educar sobre un tema específico',
    structure: 'Pregunta → Explicación → Ejemplo → Aplicación',
    keyElements: ['Pregunta intrigante', 'Explicación simple', 'Ejemplo práctico', 'Aplicación real']
  },
  'generar-leads': {
    focus: 'Capturar interés y generar leads calificados',
    structure: 'Beneficio → Prueba → Urgencia → CTA',
    keyElements: ['Beneficio claro', 'Prueba social', 'Urgencia genuina', 'CTA específico']
  }
};

// Prompts específicos por tono
const TONE_PROMPTS = {
  'profesional': {
    language: 'Formal, técnico, confiable',
    mood: 'Serio, competente, autoritativo',
    visualStyle: 'Limpio, elegante, corporativo'
  },
  'divertido': {
    language: 'Casual, energético, entretenido',
    mood: 'Alegre, dinámico, positivo',
    visualStyle: 'Colorido, dinámico, creativo'
  },
  'directo': {
    language: 'Claro, conciso, sin rodeos',
    mood: 'Eficiente, decidido, práctico',
    visualStyle: 'Minimalista, funcional, directo'
  }
};

// Prompts específicos por estilo
const STYLE_PROMPTS = {
  'cinematografico': {
    cinematography: 'Movimientos de cámara fluidos, planos cinematográficos',
    lighting: 'Iluminación dramática y profesional',
    production: 'Alta calidad de producción, estética premium'
  },
  'influencer': {
    cinematography: 'Cámara personal, planos cercanos, conexión directa',
    lighting: 'Iluminación natural y auténtica',
    production: 'Estilo personal pero pulido'
  },
  'comercial': {
    cinematography: 'Planos comerciales tradicionales, ritmo dinámico',
    lighting: 'Iluminación perfecta y profesional',
    production: 'Calidad broadcast, estética comercial'
  },
  'sketch': {
    cinematography: 'Movimientos dinámicos, planos cómicos',
    lighting: 'Iluminación que apoye la comedia',
    production: 'Producción que sirva al humor'
  },
  'documental': {
    cinematography: 'Cámara documental, planos observacionales',
    lighting: 'Iluminación natural y realista',
    production: 'Estética documental auténtica'
  },
  'tutorial': {
    cinematography: 'Planos instructivos, visibilidad clara',
    lighting: 'Iluminación clara y funcional',
    production: 'Enfoque en la claridad educativa'
  }
};

// Ejemplos específicos de buenas escenas
const SCENE_EXAMPLES = {
  8: {
    scenes: 1,
    example: `{
  "scenes": [
    {
      "id": "scene_1",
      "title": "Presentación del Producto",
      "description": "Una persona profesional sostiene el producto con confianza mientras mira directamente a la cámara. El fondo es limpio y minimalista. La persona sonríe ligeramente y presenta el producto con un gesto elegante.",
      "visualElements": "Fondo blanco minimalista, iluminación suave y profesional, producto destacado en primer plano, persona vestida profesionalmente",
      "action": "La persona toma el producto, lo muestra a la cámara con un movimiento fluido, sonríe y dice la frase principal del mensaje",
      "duration": 8
    }
  ]
}`
  },
  16: {
    scenes: 2,
    example: `{
  "scenes": [
    {
      "id": "scene_1",
      "title": "Hook Inicial",
      "description": "Plano cercano de una persona con expresión intrigante mirando a la cámara. El fondo sugiere un problema común que el producto puede resolver.",
      "visualElements": "Plano medio corto, expresión facial intrigante, fondo que sugiere contexto del problema",
      "action": "La persona hace una pregunta directa a la cámara que conecta con el problema de la audiencia",
      "duration": 8
    },
    {
      "id": "scene_2",
      "title": "Solución y CTA",
      "description": "La misma persona ahora muestra el producto como solución. El fondo cambia a uno más positivo y profesional. Termina con un call-to-action claro.",
      "visualElements": "Producto visible y destacado, fondo más positivo, iluminación que resalta el producto",
      "action": "Presenta el producto como solución, explica el beneficio principal y termina con CTA específico",
      "duration": 8
    }
  ]
}`
  }
};

export function generateFilmmakerPrompt(
  objective: string,
  tone: string,
  style: string,
  duration: number,
  description: string
): string {
  const scenes = duration / 8;
  const objectiveData = OBJECTIVE_PROMPTS[objective as keyof typeof OBJECTIVE_PROMPTS];
  const toneData = TONE_PROMPTS[tone as keyof typeof TONE_PROMPTS];
  const styleData = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];
  const example = SCENE_EXAMPLES[duration as keyof typeof SCENE_EXAMPLES];

  return `Crea un guión de video de ${duration} segundos (${scenes} escenas de 8 segundos cada una) sobre: "${description}"

ESPECIFICACIONES:
- Objetivo: ${objectiveData?.focus || 'Presentación efectiva del contenido'}
- Estructura narrativa: ${objectiveData?.structure || 'Introducción → Desarrollo → Conclusión'}
- Tono: ${toneData?.language || 'Profesional'} - ${toneData?.mood || 'Confiable'}
- Estilo visual: ${styleData?.cinematography || 'Profesional'} con ${styleData?.lighting || 'iluminación profesional'}

ELEMENTOS CLAVE A INCLUIR:
${objectiveData?.keyElements?.map(element => `- ${element}`).join('\n') || '- Mensaje claro y directo'}

ESPECIFICACIONES TÉCNICAS:
- Cinematografía: ${styleData?.cinematography}
- Iluminación: ${styleData?.lighting}
- Estilo de producción: ${styleData?.production}
- Estética visual: ${toneData?.visualStyle}

EJEMPLO DE ESTRUCTURA PARA ${duration} SEGUNDOS:
${example?.example || 'Estructura básica de escenas'}

INSTRUCCIONES ESPECÍFICAS:
1. Cada escena debe tener exactamente 8 segundos
2. Las descripciones deben ser específicas y visuales
3. Incluir acciones claras y directas
4. Mantener coherencia narrativa
5. Optimizar para captar atención inmediata

RESPONDE ÚNICAMENTE CON JSON VÁLIDO EN EL FORMATO MOSTRADO EN EL EJEMPLO.`;
}

// Función para validar y mejorar la respuesta de la IA
export function validateAndImproveScenes(scenes: any[], requiredScenes: number): SceneStructure[] {
  if (!scenes || scenes.length === 0) {
    throw new Error('No scenes provided');
  }

  // Asegurar que tenemos el número correcto de escenas
  let validScenes = scenes.slice(0, requiredScenes);
  
  // Si necesitamos más escenas, duplicar la última
  while (validScenes.length < requiredScenes) {
    const lastScene = validScenes[validScenes.length - 1];
    validScenes.push({
      ...lastScene,
      id: `scene_${validScenes.length + 1}`,
      title: `${lastScene.title} (Continuación)`
    });
  }

  // Validar y formatear cada escena
  return validScenes.map((scene, index) => ({
    id: scene.id || `scene_${index + 1}`,
    title: scene.title || `Escena ${index + 1}`,
    description: scene.description || 'Descripción de escena no disponible',
    visualElements: scene.visualElements || 'Elementos visuales no especificados',
    action: scene.action || 'Acción no especificada',
    duration: 8 // Siempre 8 segundos para Veo 3
  }));
}

export default {
  generateFilmmakerPrompt,
  validateAndImproveScenes,
  BASE_SYSTEM_PROMPT
}; 