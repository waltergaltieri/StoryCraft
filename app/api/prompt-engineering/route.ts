import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { generateOptimizedPrompt, generateContextualScenePrompt } from '@/lib/prompt-engineering';

// Request types
interface PromptEngineeringRequest {
  scene: string;
  regenerationMode?: boolean;
  sceneToRegenerate?: any;
  projectContext?: any;
  allScenes?: any[];
  contextualPrompt?: string;
}

// Response types
interface PromptEngineeringResponse {
  optimizedPrompt: string;
  originalScene: string;
  processingTime: number;
}

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

// OpenAI API types
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { type, scene, regenerationMode, sceneToRegenerate, projectContext, allScenes, contextualPrompt, campaignDescription, objective, scheduledDate, socialNetworks, videoNumber, totalVideosInWeek } = body;

    console.log('🔧 Prompt Engineering API called');
    
    // Manejar generación de descripción de campaña
    if (type === 'campaign_video_description') {
      console.log('📝 Generando descripción específica para video de campaña');
      
      const specificDescription = await generateCampaignVideoDescription(
        campaignDescription,
        objective,
        scheduledDate,
        socialNetworks,
        videoNumber,
        totalVideosInWeek
      );

      return NextResponse.json({
        success: true,
        description: specificDescription,
        type: 'campaign_video_description'
      });
    }
    
    // Detectar si es regeneración contextual o optimización normal
    if (regenerationMode && contextualPrompt && sceneToRegenerate && projectContext && allScenes) {
      console.log(`🧠 Modo regeneración contextual para Escena ${sceneToRegenerate.sceneNumber}`);
      console.log(`📋 Proyecto: ${projectContext.projectTitle}`);
      console.log(`🎯 Manteniendo coherencia con ${allScenes.length} escenas totales`);
      
      // Usar la nueva función de regeneración contextual
      const contextualPrompt = generateContextualScenePrompt(
        sceneToRegenerate,
        projectContext,
        allScenes
      );

      console.log(`✨ Prompt contextual generado (${contextualPrompt.length} caracteres)`);
      
      // En un entorno real, aquí llamarías a tu modelo de IA (OpenAI, Anthropic, etc.)
      // Por ahora, simulamos una optimización inteligente
      const optimizedPrompt = await simulateContextualPromptOptimization(
        contextualPrompt,
        sceneToRegenerate,
        projectContext,
        allScenes
      );

      return NextResponse.json({
        success: true,
        optimizedPrompt,
        mode: 'contextual-regeneration',
        sceneNumber: sceneToRegenerate.sceneNumber,
        projectTitle: projectContext.projectTitle
      });
      
    } else {
      // Modo normal de optimización de prompt
      console.log('📝 Modo optimización normal de prompt');
      
      if (!scene) {
        return NextResponse.json(
          { error: 'Scene description is required' },
          { status: 400 }
        );
      }

      // Default values for normal optimization
      const defaultOptimization = generateOptimizedPrompt(
        scene,
        'presentar-producto', // objective
        'profesional',        // tone
        'cinematografico',    // style
        8                     // duration
      );

      // Simular optimización de prompt
      const optimizedPrompt = await simulatePromptOptimization(defaultOptimization);

      return NextResponse.json({
        success: true,
        optimizedPrompt,
        mode: 'normal-optimization'
      });
    }

  } catch (error) {
    console.error('Error in prompt engineering:', error);
    return NextResponse.json(
      { error: 'Failed to optimize prompt' },
      { status: 500 }
    );
  }
}

// Simulación de optimización contextual (en producción usarías IA real)
async function simulateContextualPromptOptimization(
  contextualPrompt: string,
  sceneToRegenerate: any,
  projectContext: any,
  allScenes: any[]
): Promise<string> {
  // Simular delay de IA
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Construir prompt optimizado con contexto
  const sceneNumber = sceneToRegenerate.sceneNumber;
  const totalScenes = allScenes.length;
  const style = projectContext.style;
  const tone = projectContext.tone;
  
  // Determinar elementos de continuidad basados en posición de la escena
  let continuityElements = '';
  
  if (sceneNumber === 1) {
    continuityElements = 'Opening establishing shot, introduce main elements, set visual tone for entire video';
  } else if (sceneNumber === totalScenes) {
    continuityElements = 'Concluding shot, maintain visual consistency from previous scenes, provide satisfying closure';
  } else {
    continuityElements = 'Maintain visual continuity from previous scene, prepare transition elements for next scene';
  }

  // Adaptaciones específicas por estilo
  const styleAdaptations = {
    'cinematografico': 'cinematic lighting setup, film grain texture, shallow depth of field, professional color grading',
    'influencer': 'natural authentic lighting, relatable environment, casual professional quality',
    'comercial': 'perfect studio lighting, commercial polish, brand-appropriate visual style',
    'sketch': 'dynamic comedic staging, expressive visual elements, vibrant engaging colors',
    'documental': 'documentary realism, natural lighting conditions, authentic environment',
    'tutorial': 'clear instructional lighting, optimal visibility, clean presentation style'
  };

  const toneAdaptations = {
    'profesional': 'authoritative confident presentation, polished professional atmosphere',
    'divertido': 'energetic playful mood, bright engaging visuals, dynamic movement',
    'directo': 'clean straightforward composition, focused clear messaging',
    'inspiracional': 'uplifting motivated energy, aspirational visual elements'
  };

  // Construir prompt optimizado final
  const optimizedPrompt = `
Professional ${style} style video, ${continuityElements}, 
${sceneToRegenerate.description}, 
maintaining project consistency: ${styleAdaptations[style as keyof typeof styleAdaptations] || styleAdaptations['comercial']}, 
${toneAdaptations[tone as keyof typeof toneAdaptations] || toneAdaptations['profesional']},
smooth camera movement, 4K resolution, broadcast quality,
scene ${sceneNumber} of ${totalScenes}, 
${Math.round(projectContext.duration / totalScenes)} seconds duration,
seamless integration with project narrative flow
`.replace(/\s+/g, ' ').trim();

  console.log(`🎬 Prompt optimizado contextualmente para Escena ${sceneNumber}:`);
  console.log(`📝 "${optimizedPrompt.substring(0, 100)}..."`);

  return optimizedPrompt;
}

// Simulación de optimización normal
async function simulatePromptOptimization(basePrompt: string): Promise<string> {
  // Simular delay de IA
  await new Promise(resolve => setTimeout(resolve, 800));

  // En producción, aquí enviarías el prompt a tu modelo de IA preferido
  // Por ahora, devolvemos una versión "optimizada" simulada
  const optimizedPrompt = `Professional commercial style, medium shot, ${basePrompt.toLowerCase()}, modern studio lighting, smooth camera movement, 4K resolution, broadcast quality, 8 seconds duration`;

  return optimizedPrompt;
}

// Generar descripción específica para video de campaña
async function generateCampaignVideoDescription(
  campaignDescription: string,
  objective: string,
  scheduledDate: string,
  socialNetworks: string,
  videoNumber: number,
  totalVideosInWeek: number
): Promise<string> {
  // Simular delay de IA
  await new Promise(resolve => setTimeout(resolve, 500));

  // Convertir fecha a formato legible
  const date = new Date(scheduledDate);
  const dateStr = date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Lugares y escenarios variados
  const locations = [
    'playa paradisíaca con aguas cristalinas',
    'ciudad moderna con rascacielos',
    'bosque encantado con luz natural',
    'montañas majestuosas al amanecer',
    'café acogedor en el centro de la ciudad',
    'estudio minimalista con luz natural',
    'parque urbano con vegetación exuberante',
    'terraza con vista panorámica',
    'galería de arte contemporáneo',
    'mercado local vibrante y colorido',
    'biblioteca elegante con arquitectura clásica',
    'gimnasio moderno con equipamiento avanzado',
    'cocina gourmet con diseño industrial',
    'jardín botánico con flores exóticas',
    'centro comercial de lujo',
    'oficina corporativa con vista a la ciudad',
    'estación de tren histórica',
    'museo de ciencias interactivo',
    'teatro clásico con decoración vintage',
    'plaza principal de ciudad europea'
  ];

  // Actividades y contextos
  const activities = [
    'personas disfrutando del ambiente relajado',
    'profesionales trabajando de manera eficiente',
    'familias compartiendo momentos especiales',
    'jóvenes explorando nuevas experiencias',
    'artistas creando obras inspiradoras',
    'deportistas entrenando con dedicación',
    'estudiantes aprendiendo con entusiasmo',
    'turistas descubriendo lugares únicos',
    'emprendedores desarrollando ideas innovadoras',
    'amigos celebrando logros importantes'
  ];

  // Seleccionar elementos basados en el número de video para variedad
  const locationIndex = (videoNumber - 1) % locations.length;
  const activityIndex = (videoNumber - 1) % activities.length;
  
  const selectedLocation = locations[locationIndex];
  const selectedActivity = activities[activityIndex];

  // Extraer producto de la descripción de campaña
  const productMatch = campaignDescription.match(/producto[_\s]?(\w+)/i);
  const product = productMatch ? productMatch[0] : 'nuestro producto';

  // Generar descripción específica
  const specificDescription = `Crea un video del ${product} en ${selectedLocation} donde el producto sea el protagonista principal mientras ${selectedActivity}. El video debe transmitir ${objective.toLowerCase()} y estar optimizado para ${socialNetworks}. La escena debe ser visualmente atractiva y mostrar el producto de manera natural e integrada en el ambiente, programado para ${dateStr}.`;

  console.log(`📝 Descripción generada para video ${videoNumber}/${totalVideosInWeek}:`);
  console.log(`🎬 "${specificDescription.substring(0, 100)}..."`);

  return specificDescription;
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts POST requests'
    } as ErrorResponse,
    { status: 405 }
  );
} 