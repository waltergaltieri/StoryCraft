export type VideoStatus = 'draft' | 'generating' | 'completed' | 'failed';
export type SceneStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface Scene {
  id: string;
  order: number;
  prompt: string;
  videoUrl?: string;
  duration: number;
  status: SceneStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoProject {
  id: string;
  title: string;
  objective: VideoObjective;
  tone: VideoTone;
  style: VideoStyle;
  duration: number; // in seconds
  description: string;
  scenes: Scene[];
  status: VideoStatus;
  thumbnailUrl?: string;
  finalVideoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export type VideoObjective = 
  | 'brand-awareness'
  | 'product-launch'
  | 'lead-generation'
  | 'social-media'
  | 'educational'
  | 'testimonial'
  | 'explainer'
  | 'promotional';

export type VideoTone = 
  | 'professional'
  | 'casual'
  | 'energetic'
  | 'calm'
  | 'inspiring'
  | 'humorous'
  | 'dramatic'
  | 'friendly';

export type VideoStyle = 
  | 'cinematic'
  | 'documentary'
  | 'animated'
  | 'minimalist'
  | 'vibrant'
  | 'dark-moody'
  | 'bright-airy'
  | 'corporate';

export interface FilmmakerRequest {
  objective: string;
  tone: string;
  style: string;
  duration: number;
  description: string;
}

export interface FilmmakerScene {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
}

export interface FilmmakerResponse {
  scenes: FilmmakerScene[];
  totalDuration: number;
  promptUsed: string;
}

export interface PromptEngineeringRequest {
  scene: string;
}

export interface PromptEngineeringResponse {
  optimizedPrompt: string;
  originalScene: string;
  processingTime: number;
}

export interface GenerateVideoRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  generateAudio?: boolean;
}

export interface GenerateVideoResponse {
  generationId: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  message: string;
  estimatedWaitTime?: number;
}

export interface PollVideoRequest {
  generationId: string;
}

export interface PollVideoResponse {
  generationId: string;
  status: 'waiting' | 'generating' | 'completed' | 'error';
  progress?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  message?: string;
  estimatedTimeRemaining?: number;
  errorMessage?: string;
}

export interface APIError {
  error: string;
  message: string;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIMLVideoRequest {
  model: string;
  prompt: string;
  aspect_ratio: string;
  duration: number;
  generate_audio: boolean;
}

export interface AIMLVideoResponse {
  generation_id: string;
  status: string;
  message?: string;
  estimated_time?: number;
}

export interface AIMLPollResponse {
  generation_id: string;
  status: string;
  progress?: number;
  video_url?: string;
  thumbnail_url?: string;
  message?: string;
  estimated_time_remaining?: number;
  error?: string;
  error_message?: string;
}

export type VideoProcessingStatus = 
  | 'waiting'
  | 'generating' 
  | 'completed' 
  | 'error'
  | 'queued'
  | 'processing';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export type VideoDuration = 4 | 8 | 16 | 24 | 32;

export type VideoQuality = 'ultra' | 'high' | 'standard';

export interface VideoGenerationPipeline {
  step: 'scenes' | 'optimization' | 'generation' | 'completed';
  status: VideoProcessingStatus;
  data?: {
    scenes?: FilmmakerScene[];
    optimizedPrompts?: string[];
    generationIds?: string[];
    videoUrls?: string[];
  };
  error?: APIError;
  startTime: number;
  endTime?: number;
  processingTime?: number;
}

export interface RateLimit {
  requestsPerMinute: number;
  tokensPerMinute?: number;
  videosPerHour?: number;
}

export interface APILimits {
  openai: RateLimit;
  aiml: RateLimit;
}

export interface EnhancedVideoProject extends VideoProject {
  apiStatus?: {
    filmmaker: VideoProcessingStatus;
    promptEngineering: VideoProcessingStatus;
    videoGeneration: VideoProcessingStatus;
  };
  
  generatedScenes?: FilmmakerScene[];
  optimizedPrompts?: string[];
  generationIds?: string[];
  
  processingTimes?: {
    filmmaker?: number;
    promptEngineering?: number;
    videoGeneration?: number;
    total?: number;
  };
  
  errors?: APIError[];
  
  apiUsage?: {
    openaiTokens: number;
    aimlVideos: number;
    lastRequestTime: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'pro' | 'enterprise';
  creditsRemaining: number;
  createdAt: Date;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface CreateVideoRequest {
  title: string;
  objective: VideoObjective;
  tone: VideoTone;
  style: VideoStyle;
  duration: number;
  description: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  error: string | null;
  code?: string;
} 