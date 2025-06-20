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

// KieAI Veo3 API types
interface KieAIVeo3Request {
  prompt: string;
  model: string; // veo3_fast (80 créditos) o veo3 (más caro)
  waterMark?: string;
  enableTranslation?: boolean;
}

interface KieAIVeo3Response {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
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

    // Prepare KieAI Veo3 API request
    const kieaiRequest: KieAIVeo3Request = {
      prompt: body.prompt.trim(),
      model: "veo3_fast", // Usar veo3_fast (80 créditos) - la opción más económica
      waterMark: "StoryCraft", // Marca de agua para identificar nuestros videos
      enableTranslation: true // Habilitar traducción automática si es necesario
    };

    console.log('Sending video generation request to KieAI Veo3:', {
      promptLength: kieaiRequest.prompt.length,
      waterMark: kieaiRequest.waterMark,
      enableTranslation: kieaiRequest.enableTranslation
    });

    // Call KieAI Veo3 API
    const kieaiResponse = await fetch('https://kieai.erweima.ai/api/v1/veo/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.kieaiApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(kieaiRequest)
    });

    if (!kieaiResponse.ok) {
      const errorData = await kieaiResponse.text();
      console.error('KieAI API Error:', {
        status: kieaiResponse.status,
        statusText: kieaiResponse.statusText,
        error: errorData,
        apiKey: config.kieaiApiKey?.substring(0, 8) + '...' // Log partial key for debugging
      });
      
      // Handle specific error codes according to KieAI documentation
      if (kieaiResponse.status === 401) {
        return NextResponse.json(
          { 
            error: 'Authentication Error',
            message: 'Invalid KieAI API key',
            code: 'KIEAI_AUTH_FAILED'
          } as ErrorResponse,
          { status: 401 }
        );
      }
      
      if (kieaiResponse.status === 402) {
        return NextResponse.json(
          { 
            error: 'Insufficient Credits',
            message: 'Account does not have enough credits to perform the operation',
            code: 'KIEAI_INSUFFICIENT_CREDITS'
          } as ErrorResponse,
          { status: 402 }
        );
      }
      
      if (kieaiResponse.status === 422) {
        return NextResponse.json(
          { 
            error: 'Validation Error',
            message: 'The request parameters failed validation checks',
            code: 'KIEAI_VALIDATION_ERROR'
          } as ErrorResponse,
          { status: 422 }
        );
      }
      
      if (kieaiResponse.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate Limit Error',
            message: 'Request limit has been exceeded for this resource',
            code: 'KIEAI_RATE_LIMIT'
          } as ErrorResponse,
          { status: 429 }
        );
      }
      
      if (kieaiResponse.status === 455) {
        return NextResponse.json(
          { 
            error: 'Service Unavailable',
            message: 'System is currently undergoing maintenance',
            code: 'KIEAI_MAINTENANCE'
          } as ErrorResponse,
          { status: 455 }
        );
      }
      
      if (kieaiResponse.status === 505) {
        return NextResponse.json(
          { 
            error: 'Feature Disabled',
            message: 'The requested feature is currently disabled',
            code: 'KIEAI_FEATURE_DISABLED'
          } as ErrorResponse,
          { status: 505 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'KieAI API Error',
          message: `Failed to start video generation: ${kieaiResponse.status} ${kieaiResponse.statusText}`,
          code: 'KIEAI_API_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const kieaiData: KieAIVeo3Response = await kieaiResponse.json();

    // Check if request was successful according to KieAI response format
    if (kieaiData.code !== 200) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: kieaiData.msg || 'Failed to start video generation',
          code: 'KIEAI_GENERATION_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const taskId = kieaiData.data.taskId;
    
    if (!taskId) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'No task ID returned from KieAI API'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    console.log('Video generation started successfully with KieAI Veo3:', {
      taskId: taskId,
      message: kieaiData.msg
    });

    const response: GenerateVideoResponse = {
      generationId: taskId,
      status: 'queued', // KieAI starts with queued status
      message: kieaiData.msg || 'Video generation started successfully with KieAI Veo3',
      estimatedWaitTime: 120 // Veo3 typically takes 1-2 minutes
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

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts POST requests. Use /api/poll-video for checking generation status.'
    } as ErrorResponse,
    { status: 405 }
  );
} 