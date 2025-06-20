import { VideoObjective, VideoTone, VideoStyle } from './types';

export const VIDEO_OBJECTIVES: { value: VideoObjective; label: string; description: string }[] = [
  {
    value: 'brand-awareness',
    label: 'Brand Awareness',
    description: 'Introduce your brand and values to new audiences'
  },
  {
    value: 'product-launch',
    label: 'Product Launch',
    description: 'Showcase new products or features'
  },
  {
    value: 'lead-generation',
    label: 'Lead Generation',
    description: 'Convert viewers into potential customers'
  },
  {
    value: 'social-media',
    label: 'Social Media',
    description: 'Create engaging content for social platforms'
  },
  {
    value: 'educational',
    label: 'Educational',
    description: 'Teach or inform your audience'
  },
  {
    value: 'testimonial',
    label: 'Testimonial',
    description: 'Share customer success stories'
  },
  {
    value: 'explainer',
    label: 'Explainer',
    description: 'Explain complex concepts simply'
  },
  {
    value: 'promotional',
    label: 'Promotional',
    description: 'Promote sales, events, or special offers'
  }
];

export const VIDEO_TONES: { value: VideoTone; label: string; description: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal, trustworthy, and authoritative'
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed, friendly, and approachable'
  },
  {
    value: 'energetic',
    label: 'Energetic',
    description: 'Dynamic, exciting, and motivating'
  },
  {
    value: 'calm',
    label: 'Calm',
    description: 'Peaceful, soothing, and reassuring'
  },
  {
    value: 'inspiring',
    label: 'Inspiring',
    description: 'Uplifting, motivational, and empowering'
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Fun, entertaining, and lighthearted'
  },
  {
    value: 'dramatic',
    label: 'Dramatic',
    description: 'Intense, emotional, and impactful'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, welcoming, and personable'
  }
];

export const VIDEO_STYLES: { value: VideoStyle; label: string; description: string }[] = [
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Film-like quality with dramatic lighting'
  },
  {
    value: 'documentary',
    label: 'Documentary',
    description: 'Realistic, informative style'
  },
  {
    value: 'animated',
    label: 'Animated',
    description: 'Cartoon or motion graphics style'
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean, simple, and uncluttered'
  },
  {
    value: 'vibrant',
    label: 'Vibrant',
    description: 'Bold colors and high energy'
  },
  {
    value: 'dark-moody',
    label: 'Dark & Moody',
    description: 'Atmospheric with shadows and contrast'
  },
  {
    value: 'bright-airy',
    label: 'Bright & Airy',
    description: 'Light, fresh, and optimistic'
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Professional business aesthetic'
  }
];

// Relación de aspecto fija para Veo 3
export const FIXED_ASPECT_RATIO = '16:9'; // Fijo por ahora, otros ratios próximamente

// Duración para Veo 3 - 8 segundos por escena
export const DURATION_OPTIONS = [
  { value: 8, label: '8 segundos (1 escena)' }, 
  { value: 16, label: '16 segundos (2 escenas)' },
  { value: 24, label: '24 segundos (3 escenas)' },
  { value: 32, label: '32 segundos (4 escenas)' },
];

// Información sobre bloques de escenas para Veo 3
export const SCENE_BLOCK_INFO = {
  DURATION_PER_SCENE: 8, // Cada escena dura 8 segundos con Veo 3
  ASPECT_RATIO: '16:9', // Fijo por ahora
  calculateScenes: (totalDuration: number) => Math.ceil(totalDuration / 8),
  calculateTotalDuration: (numScenes: number) => numScenes * 8
};

export const API_ENDPOINTS = {
  FILMMAKER: '/api/filmmaker',
  PROMPT_ENGINEERING: '/api/prompt-engineering',
  GENERATE_VIDEO: '/api/generate-video',
  PROJECTS: '/api/projects',
  USER: '/api/user',
} as const;

export const SUBSCRIPTION_LIMITS = {
  free: {
    videosPerMonth: 3,
    maxDuration: 60,
    features: ['Basic templates', 'Standard quality']
  },
  pro: {
    videosPerMonth: 25,
    maxDuration: 180,
    features: ['All templates', 'HD quality', 'Custom branding', 'Priority support']
  },
  enterprise: {
    videosPerMonth: -1, // unlimited
    maxDuration: 300,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'Analytics']
  }
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
} as const;

// Configuración de modelos de video disponibles
export const VIDEO_MODELS = {
  KLING_PRO: {
    id: 'kling-video/v1/pro/text-to-video',
    name: 'Kling 1.0 Pro',
    maxDuration: 10, // 5 o 10 segundos
    aspectRatios: ['16:9', '9:16', '1:1'],
    quality: '1080p',
    status: 'available',
    provider: 'kling',
    description: 'Modelo cinematográfico de alta calidad con física realista'
  },
  KLING_STANDARD: {
    id: 'kling-video/v1/standard/text-to-video',
    name: 'Kling 1.0 Standard',
    maxDuration: 10,
    aspectRatios: ['16:9', '9:16', '1:1'],
    quality: '1080p',
    status: 'available',
    provider: 'kling',
    description: 'Modelo estándar con buena calidad y velocidad'
  },
  VEO_3: {
    id: 'google/veo3',
    name: 'Veo 3',
    maxDuration: 8,
    aspectRatios: ['16:9', '9:16', '1:1'],
    quality: '1080p',
    status: 'limited', // Acceso limitado
    provider: 'google',
    description: 'Modelo de Google con audio sincronizado (acceso limitado)'
  },
  RUNWAY_GEN3: {
    id: 'runway-gen3/turbo/text-to-video',
    name: 'Runway Gen-3 Turbo',
    maxDuration: 10,
    aspectRatios: ['16:9', '9:16'],
    quality: '1080p',
    status: 'limited',
    provider: 'runway',
    description: 'Modelo narrativo avanzado'
  }
} as const;

// Modelo preferido por defecto - KLING 1.0 PRO
export const DEFAULT_VIDEO_MODEL = VIDEO_MODELS.KLING_PRO;

// Configuración específica para Kling
export const KLING_CONFIG = {
  endpoint: '/v2/generate/video/kling/generation',
  pollEndpoint: '/v2/generate/video/kling/generation',
  defaultParams: {
    enhance_prompt: true,
    aspect_ratio: '16:9',
    duration: '10' // 10 segundos por defecto (valor válido para Kling)
  },
  validDurations: ['5', '10'] // Solo estos valores son válidos
} as const; 