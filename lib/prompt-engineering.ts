// Master Prompt for AI Prompt Engineering
// This prompt will be used to optimize and enhance the generated prompts for Veo 3

export const MASTER_PROMPT_ENGINEERING = `
Eres un experto en ingeniería de prompts para modelos de generación de video AI, específicamente optimizado para Veo 3.

Tu tarea es transformar descripciones de escenas básicas en prompts altamente optimizados que produzcan videos de máxima calidad.

CARACTERÍSTICAS TÉCNICAS REQUERIDAS:
- Resolución: 4K mínimo
- Aspect ratio: 16:9 (horizontal) o 9:16 (vertical según el contexto)
- Duración: Especificar duración exacta en segundos
- Calidad: Profesional, broadcast quality
- Estabilización: Smooth camera movements, no shaky footage

ELEMENTOS VISUALES CLAVE:
1. ILUMINACIÓN:
   - Especificar tipo de luz (natural, artificial, cinematic lighting)
   - Dirección y intensidad de la luz
   - Mood lighting apropiado para el tono

2. COMPOSICIÓN:
   - Planos específicos (close-up, medium shot, wide shot)
   - Regla de tercios y composición visual
   - Depth of field y enfoque

3. MOVIMIENTO DE CÁMARA:
   - Especificar movimientos suaves (pan, tilt, dolly, zoom)
   - Velocidad de movimiento
   - Puntos de inicio y fin del movimiento

4. ESTILO VISUAL:
   - Color grading específico
   - Aesthetic style (cinematográfico, comercial, documental, etc.)
   - Visual effects si son necesarios

5. ELEMENTOS DE PRODUCCIÓN:
   - Props y set design
   - Wardrobe y styling
   - Location type y ambiente

ESTRUCTURA DEL PROMPT OPTIMIZADO:
[ESTILO] [TIPO_PLANO] [SUJETO] [ACCIÓN] [SETTING] [ILUMINACIÓN] [MOVIMIENTO_CÁMARA] [DURACIÓN] [CALIDAD_TÉCNICA]

EJEMPLO DE OPTIMIZACIÓN:
Input básico: "Una persona presentando un producto"
Output optimizado: "Professional commercial style, medium shot, confident presenter in business attire holding premium product, modern minimalist studio with white backdrop, soft key lighting with subtle rim light, slow push-in camera movement from 3 feet to 2 feet, 8 seconds duration, 4K resolution, broadcast quality, shallow depth of field with product in sharp focus"

INSTRUCCIONES ESPECÍFICAS POR ESTILO:
- Cinematográfico: Dramatic lighting, cinematic camera movements, film grain, color grading
- Influencer: Natural lighting, handheld feel but stabilized, authentic environment
- Comercial: Perfect lighting, smooth camera work, polished production value
- Sketch: Dynamic movements, multiple angles, comedic timing
- Documental: Natural lighting, documentary-style camera work, realistic settings
- Tutorial: Clear visibility, stable shots, focused on demonstrating actions

Optimiza el siguiente prompt manteniendo la esencia del mensaje pero maximizando la calidad técnica y visual:
`;

export function generateOptimizedPrompt(
  basePrompt: string,
  objective: string,
  tone: string,
  style: string,
  duration: number,
  aspectRatio: '16:9' | '9:16' = '16:9'
): string {
  const contextualInfo = `
CONTEXTO DEL VIDEO:
- Objetivo: ${objective}
- Tono: ${tone}
- Estilo: ${style}
- Duración: ${duration} segundos
- Aspect Ratio: ${aspectRatio}

PROMPT BASE A OPTIMIZAR:
${basePrompt}

REQUERIMIENTOS ADICIONALES:
- Asegurar que el video comunique claramente el objetivo "${objective}"
- Mantener un tono consistentemente "${tone}" durante toda la duración
- Aplicar las características visuales del estilo "${style}"
- Optimizar para ${duration} segundos de duración exacta
- Formato ${aspectRatio} apropiado para la plataforma de destino

OPTIMIZACIÓN SOLICITADA:
Genera un prompt técnicamente detallado que maximice la calidad visual y la efectividad comunicativa del video resultante.
`;

  return MASTER_PROMPT_ENGINEERING + contextualInfo;
}

// Nueva función para regeneración contextual de escenas individuales
export function generateContextualScenePrompt(
  sceneToRegenerate: {
    id: string;
    description: string;
    sceneNumber: number;
  },
  projectContext: {
    objective: string;
    tone: string;
    style: string;
    duration: number;
    description: string;
    projectTitle: string;
  },
  allScenes: Array<{
    id: string;
    description: string;
    sceneNumber: number;
    isTarget: boolean;
  }>,
  aspectRatio: '16:9' | '9:16' = '16:9'
): string {
  
  const contextualInfo = `
REGENERACIÓN CONTEXTUAL DE ESCENA INDIVIDUAL

CONTEXTO COMPLETO DEL PROYECTO:
- Título del Proyecto: ${projectContext.projectTitle}
- Objetivo General: ${projectContext.objective}
- Tono Narrativo: ${projectContext.tone}
- Estilo Visual: ${projectContext.style}
- Duración Total: ${projectContext.duration} segundos
- Descripción del Proyecto: ${projectContext.description}

ESCENA A REGENERAR:
- Número de Escena: ${sceneToRegenerate.sceneNumber}
- Descripción Actual: ${sceneToRegenerate.description}

CONTEXTO NARRATIVO COMPLETO:
${allScenes.map(scene => 
  scene.isTarget 
    ? `📍 ESCENA ${scene.sceneNumber} [REGENERAR]: ${scene.description}`
    : `Escena ${scene.sceneNumber}: ${scene.description}`
).join('\n')}

INSTRUCCIONES CRÍTICAS PARA REGENERACIÓN:

1. COHERENCIA NARRATIVA:
   - La escena ${sceneToRegenerate.sceneNumber} DEBE mantener continuidad visual y narrativa con las escenas anterior y posterior
   - Respetar la progresión lógica del mensaje desde la escena 1 hasta la final
   - Mantener consistencia en elementos visuales (personajes, entorno, iluminación base)

2. CONSISTENCIA DE PROYECTO:
   - Objetivo "${projectContext.objective}": La escena debe contribuir específicamente a este objetivo
   - Tono "${projectContext.tone}": Mantener el mismo tono emocional y comunicativo
   - Estilo "${projectContext.style}": Conservar la estética visual establecida

3. TRANSICIONES FLUIDAS:
   - Si hay escena anterior: crear conexión visual/narrativa suave
   - Si hay escena posterior: preparar elementos que faciliten la transición
   - Evitar cambios abruptos de locación, personajes, o elementos visuales principales

4. ELEMENTOS A PRESERVAR:
   - Personajes principales si aparecen en otras escenas
   - Esquema de colores y paleta visual del proyecto
   - Estilo de iluminación predominante
   - Elementos de marca o productos si son relevantes

5. OPTIMIZACIÓN TÉCNICA:
   - Duración: ${Math.round(projectContext.duration / allScenes.length)} segundos aproximadamente
   - Aspect Ratio: ${aspectRatio}
   - Calidad: 4K, broadcast quality
   - Estilo específico: ${getStyleSpecificOptimizations(projectContext.style)}

PROMPT DE ESCENA A OPTIMIZAR:
${sceneToRegenerate.description}

OBJETIVO DE LA REGENERACIÓN:
Crear una versión mejorada de la Escena ${sceneToRegenerate.sceneNumber} que:
- Mantenga perfecta coherencia con el resto del proyecto
- Mejore la calidad visual y narrativa de la escena específica
- Preserve la linealidad y flujo narrativo del video completo
- Optimice técnicamente para máxima calidad de generación
`;

  return MASTER_PROMPT_ENGINEERING + contextualInfo;
}

// Función auxiliar para detectar elementos comunes entre escenas
export function analyzeSceneConsistency(scenes: Array<{description: string, sceneNumber: number}>) {
  // Análisis básico de elementos comunes
  const commonElements = {
    characters: [] as string[],
    locations: [] as string[],
    objects: [] as string[],
    themes: [] as string[]
  };

  // Aquí podrías implementar análisis más sofisticado con NLP
  // Por ahora, retornamos estructura básica para extensión futura
  
  return {
    commonElements,
    suggestions: [
      "Mantener consistencia visual entre escenas",
      "Preservar elementos de transición",
      "Conservar paleta de colores establecida"
    ]
  };
}

export const TECHNICAL_PARAMETERS = {
  QUALITY_PRESETS: {
    ultra: 'ultra high quality, 4K resolution, professional broadcast quality, cinematic production value',
    high: 'high quality, 1080p resolution, professional production, commercial grade',
    standard: 'good quality, 720p resolution, social media optimized'
  },
  
  LIGHTING_PRESETS: {
    professional: 'professional three-point lighting setup, key light, fill light, rim light',
    natural: 'natural lighting, golden hour warmth, soft shadows',
    dramatic: 'dramatic cinematic lighting, high contrast, moody atmosphere',
    bright: 'bright even lighting, minimal shadows, clean commercial look'
  },
  
  CAMERA_MOVEMENTS: {
    static: 'static camera, locked off shot, no movement',
    subtle: 'subtle camera movement, gentle push in or pull out',
    dynamic: 'dynamic camera movement, smooth tracking and panning',
    handheld: 'handheld style but stabilized, natural organic movement'
  }
};

export function getStyleSpecificOptimizations(style: string): string {
  const optimizations: Record<string, string> = {
    cinematografico: 'cinematic film grain, dramatic lighting ratios, shallow depth of field, professional color grading, anamorphic lens characteristics',
    influencer: 'natural authentic lighting, slight handheld movement but stabilized, relatable environment, casual professional quality',
    comercial: 'perfect studio lighting, flawless production value, smooth camera movements, commercial polish and shine',
    sketch: 'dynamic quick cuts simulation in single shot, comedic timing, expressive camera movements, vibrant colors',
    documental: 'documentary realism, natural lighting conditions, observational camera style, authentic environments',
    tutorial: 'clear instructional lighting, stable focused shots, optimal visibility of all elements, clean presentation'
  };

  return optimizations[style] || optimizations.comercial;
} 