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

// KieAI API types
interface KieAIVideoDetailsResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    paramJson: string;
    completeTime?: number;
    response: {
      taskId: string;
      resultUrls?: string[];
      successFlag: number; // 0: Generating, 1: Success, 2: Failed, 3: Generation Failed
      createTime: number;
      errorCode?: number;
      errorMessage?: string;
    };
  };
}

interface KieAI1080pVideoResponse {
  code: number;
  msg: string;
  data: {
    result_url?: string;
    resultUrl?: string;
  };
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
    if (generationId.length < 10 || generationId.length > 200) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid generation ID format'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    console.log('Polling video generation status (KieAI Veo3):', { generationId });

    // Call KieAI API to check video generation status
    const kieaiResponse = await fetch(
      `https://kieai.erweima.ai/api/v1/veo/record-info?taskId=${encodeURIComponent(generationId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.kieaiApiKey}`,
          'Accept': 'application/json',
          'User-Agent': 'StoryCraft-AI/1.0'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout for polling
      }
    );

    if (!kieaiResponse.ok) {
      const errorData = await kieaiResponse.text();
      console.error('KieAI Poll API Error:', {
        status: kieaiResponse.status,
        statusText: kieaiResponse.statusText,
        error: errorData,
        generationId
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
      
      if (kieaiResponse.status === 404) {
        return NextResponse.json(
          { 
            error: 'Not Found',
            message: 'Generation ID not found or expired',
            code: 'GENERATION_NOT_FOUND'
          } as ErrorResponse,
          { status: 404 }
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
      
      return NextResponse.json(
        { 
          error: 'KieAI API Error',
          message: `Failed to check generation status: ${kieaiResponse.status} ${kieaiResponse.statusText}`,
          code: 'KIEAI_POLL_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const kieaiData: KieAIVideoDetailsResponse = await kieaiResponse.json();

    // Check if API response is successful
    if (kieaiData.code !== 200) {
      return NextResponse.json(
        { 
          error: 'KieAI API Error',
          message: kieaiData.msg || 'Failed to get video details',
          code: 'KIEAI_DETAILS_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Safely access response properties
    const responseData = kieaiData.data.response || {};
    const successFlag = responseData.successFlag;
    const resultUrls = responseData.resultUrls || [];
    const completeTime = kieaiData.data.completeTime;

    console.log('Video generation status response (KieAI):', {
      taskId: kieaiData.data.taskId,
      successFlag,
      hasResultUrls: resultUrls.length > 0,
      completeTime,
      responseData: responseData // Log full response structure for debugging
    });

    // Map KieAI response to our response format
    let status = mapKieAIStatus(successFlag);
    
    // If successFlag is undefined but we have resultUrls and completeTime, consider it completed
    if (successFlag === undefined && resultUrls.length > 0 && completeTime) {
      status = 'completed';
      console.log('Video appears completed based on resultUrls and completeTime despite undefined successFlag');
    }
    
    const response: PollVideoResponse = {
      generationId: kieaiData.data.taskId || generationId,
      status,
      message: kieaiData.msg
    };

    // Calculate progress based on status
    if (response.status === 'waiting') {
      response.progress = 10;
    } else if (response.status === 'generating') {
      response.progress = 50;
    } else if (response.status === 'completed') {
      response.progress = 100;
    }

    // If video is completed, try to get 1080P version
    if (response.status === 'completed') {
      try {
        const video1080pResponse = await fetch(
          `https://kieai.erweima.ai/api/v1/veo/get-1080p-video?taskId=${encodeURIComponent(generationId)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${config.kieaiApiKey}`,
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000) // 10 second timeout for 1080p fetch
          }
        );

        if (video1080pResponse.ok) {
          const video1080pData: KieAI1080pVideoResponse = await video1080pResponse.json();
          
          if (video1080pData.code === 200) {
            const videoUrl = video1080pData.data.result_url || video1080pData.data.resultUrl;
            if (videoUrl) {
              response.videoUrl = videoUrl;
              console.log('1080P video URL obtained:', videoUrl);
            }
          } else if (video1080pData.code === 400) {
            // 1080P still processing
            console.log('1080P video still processing, using standard resolution');
            response.message = '1080P version is processing. Using standard resolution.';
          }
        }

        // Fallback to standard resolution if 1080P not available
        if (!response.videoUrl && resultUrls.length > 0) {
          response.videoUrl = resultUrls[0];
          console.log('Using standard resolution video:', response.videoUrl);
        }

      } catch (video1080pError) {
        console.warn('Failed to get 1080P video, using standard resolution:', video1080pError);
        
        // Use standard resolution as fallback
        if (resultUrls.length > 0) {
          response.videoUrl = resultUrls[0];
        }
      }
    }

    // Add error message if generation failed
    if (responseData.errorCode || responseData.errorMessage) {
      response.errorMessage = responseData.errorMessage || `Error code: ${responseData.errorCode}`;
      response.status = 'error';
    }

    // Calculate estimated time remaining for generating status
    if (response.status === 'generating') {
      const createTime = responseData.createTime;
      if (createTime) {
        const now = Date.now();
        const elapsed = now - createTime;
        const estimatedTotal = 120000; // 2 minutes typical for Veo3
        const remaining = Math.max(0, estimatedTotal - elapsed);
        response.estimatedTimeRemaining = Math.ceil(remaining / 1000); // Convert to seconds
      }
    }

    // Log completion or error
    if (response.status === 'completed') {
      console.log('Video generation completed successfully (KieAI):', {
        generationId,
        videoUrl: response.videoUrl
      });
    } else if (response.status === 'error') {
      console.error('Video generation failed (KieAI):', {
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

// Helper function to map KieAI status to our standard status
function mapKieAIStatus(successFlag: number | undefined): PollVideoResponse['status'] {
  // Handle undefined or null successFlag
  if (successFlag === undefined || successFlag === null) {
    return 'generating'; // Assume still generating if status is unclear
  }
  
  switch (successFlag) {
    case 0:
      return 'generating'; // Generating
    case 1:
      return 'completed'; // Success
    case 2:
    case 3:
      return 'error'; // Failed or Generation Failed
    default:
      return 'waiting'; // Unknown status, default to waiting
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts GET requests with generationId parameter.'
    } as ErrorResponse,
    { status: 405 }
  );
} 