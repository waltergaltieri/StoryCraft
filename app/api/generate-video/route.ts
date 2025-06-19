import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Request types
interface GenerateVideoRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  generateAudio?: boolean;
  negativePrompt?: string;
  enhancePrompt?: boolean;
  seed?: number;
}

// Response types
interface GenerateVideoResponse {
  generationId: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  message: string;
  estimatedWaitTime?: number;
}

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

// AIML API types
interface AIMLVideoRequest {
  model: string;
  prompt: string;
  aspect_ratio: string;
  duration: number;
  negative_prompt?: string;
  enhance_prompt?: boolean;
  seed?: number;
  generate_audio: boolean;
}

interface AIMLVideoResponse {
  generation_id: string;
  status: string;
  message?: string;
  estimated_time?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate request body
    const body: GenerateVideoRequest = await request.json();
    
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Video prompt is required and must be a non-empty string'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate prompt length
    if (body.prompt.length > 2000) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Video prompt is too long (max 2000 characters)'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate duration
    const duration = body.duration || 8;
    if (![4, 8, 16, 24, 32].includes(duration)) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Duration must be 4, 8, 16, 24, or 32 seconds'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate aspect ratio
    const aspectRatio = body.aspectRatio || '16:9';
    const validAspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'];
    if (!validAspectRatios.includes(aspectRatio)) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: `Aspect ratio must be one of: ${validAspectRatios.join(', ')}`
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Prepare AIML API request
    const aimlRequest: AIMLVideoRequest = {
      model: 'google/veo3',
      prompt: body.prompt.trim(),
      aspect_ratio: aspectRatio,
      duration: duration,
      negative_prompt: body.negativePrompt || '',
      enhance_prompt: body.enhancePrompt !== false, // Default to true
      seed: body.seed || Math.floor(Math.random() * 1000000), // Random seed if not provided
      generate_audio: body.generateAudio !== false // Default to true
    };

    console.log('Sending video generation request to AIML API:', {
      model: aimlRequest.model,
      promptLength: aimlRequest.prompt.length,
      duration: aimlRequest.duration,
      aspectRatio: aimlRequest.aspect_ratio
    });

    // Call AIML API for video generation
    const aimlResponse = await fetch('https://api.aimlapi.com/v2/generate/video/google/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.aimlapiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'StoryCraft-AI/1.0'
      },
      body: JSON.stringify(aimlRequest),
      signal: AbortSignal.timeout(30000) // 30 second timeout for initial request
    });

    if (!aimlResponse.ok) {
      const errorData = await aimlResponse.text();
      console.error('AIML API Error:', {
        status: aimlResponse.status,
        statusText: aimlResponse.statusText,
        error: errorData
      });
      
      // Handle specific error codes
      if (aimlResponse.status === 401) {
        return NextResponse.json(
          { 
            error: 'Authentication Error',
            message: 'Invalid AIML API key',
            code: 'AIML_AUTH_FAILED'
          } as ErrorResponse,
          { status: 401 }
        );
      }
      
      if (aimlResponse.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate Limit Error',
            message: 'API rate limit exceeded. Please try again later.',
            code: 'AIML_RATE_LIMIT'
          } as ErrorResponse,
          { status: 429 }
        );
      }
      
      if (aimlResponse.status === 400) {
        return NextResponse.json(
          { 
            error: 'Request Error',
            message: 'Invalid request parameters for video generation',
            code: 'AIML_BAD_REQUEST'
          } as ErrorResponse,
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'AIML API Error',
          message: `Failed to start video generation: ${aimlResponse.status} ${aimlResponse.statusText}`,
          code: 'AIML_API_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const aimlData: AIMLVideoResponse = await aimlResponse.json();

    if (!aimlData.generation_id) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'No generation ID returned from AIML API'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    console.log('Video generation started successfully:', {
      generationId: aimlData.generation_id,
      status: aimlData.status,
      estimatedTime: aimlData.estimated_time
    });

    const response: GenerateVideoResponse = {
      generationId: aimlData.generation_id,
      status: mapAIMLStatus(aimlData.status),
      message: aimlData.message || 'Video generation started successfully',
      estimatedWaitTime: aimlData.estimated_time
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Generate Video API Error:', error);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Timeout Error',
          message: 'Request to video generation service timed out'
        } as ErrorResponse,
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

// Helper function to map AIML status to our standard status
function mapAIMLStatus(aimlStatus: string): GenerateVideoResponse['status'] {
  switch (aimlStatus?.toLowerCase()) {
    case 'queued':
    case 'pending':
      return 'queued';
    case 'processing':
    case 'generating':
    case 'in_progress':
      return 'processing';
    case 'completed':
    case 'finished':
    case 'success':
      return 'completed';
    case 'error':
    case 'failed':
    case 'failure':
      return 'error';
    default:
      return 'queued';
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts POST requests. Use /api/poll-video for checking generation status.'
    } as ErrorResponse,
    { status: 405 }
  );
} 