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