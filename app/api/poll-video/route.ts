import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Request types (via query parameters)
interface PollVideoQuery {
  generationId: string;
}

// Response types
interface PollVideoResponse {
  generationId: string;
  status: 'waiting' | 'generating' | 'completed' | 'error';
  progress?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  message?: string;
  estimatedTimeRemaining?: number;
  errorMessage?: string;
}

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

// AIML API types
interface AIMLPollResponse {
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('generationId');
    
    // Validate generation ID
    if (!generationId || typeof generationId !== 'string' || generationId.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Generation ID is required'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate generation ID format (basic sanity check)
    if (generationId.length < 10 || generationId.length > 100) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid generation ID format'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    console.log('Polling video generation status:', { generationId });

    // Call AIML API to check generation status
    const aimlResponse = await fetch(
      `https://api.aimlapi.com/v2/generate/video/google/generation?generation_id=${encodeURIComponent(generationId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.aimlapiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'StoryCraft-AI/1.0'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout for polling
      }
    );

    if (!aimlResponse.ok) {
      const errorData = await aimlResponse.text();
      console.error('AIML Poll API Error:', {
        status: aimlResponse.status,
        statusText: aimlResponse.statusText,
        error: errorData,
        generationId
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
      
      if (aimlResponse.status === 404) {
        return NextResponse.json(
          { 
            error: 'Not Found',
            message: 'Generation ID not found or expired',
            code: 'GENERATION_NOT_FOUND'
          } as ErrorResponse,
          { status: 404 }
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
      
      return NextResponse.json(
        { 
          error: 'AIML API Error',
          message: `Failed to check generation status: ${aimlResponse.status} ${aimlResponse.statusText}`,
          code: 'AIML_POLL_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const aimlData: AIMLPollResponse = await aimlResponse.json();

    console.log('Video generation status response:', {
      generationId: aimlData.generation_id,
      status: aimlData.status,
      progress: aimlData.progress,
      hasVideoUrl: !!aimlData.video_url
    });

    // Map AIML response to our response format
    const response: PollVideoResponse = {
      generationId: aimlData.generation_id,
      status: mapAIMLStatus(aimlData.status),
      progress: aimlData.progress,
      message: aimlData.message,
      estimatedTimeRemaining: aimlData.estimated_time_remaining
    };

    // Add video URL if generation is completed
    if (aimlData.video_url) {
      response.videoUrl = aimlData.video_url;
    }

    // Add thumbnail URL if available
    if (aimlData.thumbnail_url) {
      response.thumbnailUrl = aimlData.thumbnail_url;
    }

    // Add error message if generation failed
    if (aimlData.error || aimlData.error_message) {
      response.errorMessage = aimlData.error_message || aimlData.error;
      response.status = 'error';
    }

    // Log completion or error
    if (response.status === 'completed') {
      console.log('Video generation completed successfully:', {
        generationId,
        videoUrl: response.videoUrl
      });
    } else if (response.status === 'error') {
      console.error('Video generation failed:', {
        generationId,
        error: response.errorMessage
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Poll Video API Error:', error);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Timeout Error',
          message: 'Request to check video status timed out'
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
function mapAIMLStatus(aimlStatus: string): PollVideoResponse['status'] {
  switch (aimlStatus?.toLowerCase()) {
    case 'queued':
    case 'pending':
    case 'waiting':
      return 'waiting';
    case 'processing':
    case 'generating':
    case 'in_progress':
    case 'running':
      return 'generating';
    case 'completed':
    case 'finished':
    case 'success':
    case 'done':
      return 'completed';
    case 'error':
    case 'failed':
    case 'failure':
    case 'cancelled':
    case 'timeout':
      return 'error';
    default:
      // Default to waiting for unknown statuses
      return 'waiting';
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts GET requests with generationId query parameter'
    } as ErrorResponse,
    { status: 405 }
  );
} 