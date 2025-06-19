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

export const DURATION_OPTIONS = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 90, label: '1.5 minutes' },
  { value: 120, label: '2 minutes' },
  { value: 180, label: '3 minutes' },
];

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