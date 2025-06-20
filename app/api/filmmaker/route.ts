import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { generateFilmmakerPrompt, validateAndImproveScenes } from '@/lib/prompts-filmmaker-v2';
import promptsV2 from '@/lib/prompts-filmmaker-v2';

// Helper function to safely extract scene description
const extractSceneDescription = (scene: any): string => {
  if (typeof scene === 'string') {
    return scene.trim();
  }
  
  if (typeof scene === 'object' && scene !== null) {
    // If it's a structured scene object, convert to readable string
    if (scene.description) {
      return typeof scene.description === 'string' ? scene.description : JSON.stringify(scene.description);
    }
    
    // If it has scene components, format them nicely
    if (scene.Visual || scene.Protagonista || scene.Escenario) {
      let result = '';
      if (scene.Protagonista) result += `Protagonista: ${scene.Protagonista}\n\n`;
      if (scene.Escenario) result += `Escenario: ${scene.Escenario}\n\n`;
      if (scene.Visual) result += `Visual: ${scene.Visual}\n\n`;
      if (scene.Cámara) result += `Cámara: ${scene.Cámara}\n\n`;
      if (scene.Iluminación) result += `Iluminación: ${scene.Iluminación}\n\n`;
      if (scene.Audio) result += `Audio: ${scene.Audio}\n\n`;
      if (scene.Acción) result += `Acción: ${scene.Acción}\n\n`;
      if (scene.Estilo) result += `Estilo: ${scene.Estilo}`;
      return result.trim();
    }
    
    // If it has content property
    if (scene.content) {
      return typeof scene.content === 'string' ? scene.content : JSON.stringify(scene.content);
    }
    
    // Otherwise stringify the whole object
    try {
      return JSON.stringify(scene, null, 2);
    } catch {
      return String(scene);
    }
  }
  
  return String(scene || 'No description available');
};

// Request types
interface FilmmakerRequest {
  objective: string;
  tone: string;
  style: string;
  duration: number;
  description: string;
}

// Response types
interface Scene {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
}

interface FilmmakerResponse {
  scenes: Scene[];
  totalDuration: number;
  promptUsed: string;
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
  try {
    // Validate API key configuration first
    if (!config.isOpenAIConfigured()) {
      return NextResponse.json(
        { 
          error: 'Configuration Error',
          message: 'OpenAI API key is not properly configured. Please check your environment variables.',
          code: 'OPENAI_KEY_MISSING'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Validate request body
    const body: FilmmakerRequest = await request.json();
    
    if (!body.objective || !body.tone || !body.style || !body.duration || !body.description) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Missing required fields: objective, tone, style, duration, description'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate duration
    if (![8, 16, 24, 32].includes(body.duration)) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Duration must be 8, 16, 24, or 32 seconds'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Calculate required number of scenes (each scene = 8 seconds for Veo 3)
    const requiredScenes = body.duration / 8; // 8s=1, 16s=2, 24s=3, 32s=4
    
    // Generate the optimized prompt using the new system
    const finalPrompt = generateFilmmakerPrompt(
      body.objective,
      body.tone,
      body.style,
      body.duration,
      body.description
    );

    // Prepare OpenAI request
    const openAIRequest: OpenAIRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: promptsV2.BASE_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.3 // Reducir temperatura para mayor consistencia
    };

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openAIRequest)
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API Error:', errorData);
      
      return NextResponse.json(
        { 
          error: 'OpenAI API Error',
          message: `Failed to generate scenes: ${openAIResponse.status} ${openAIResponse.statusText}`,
          code: 'OPENAI_API_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const openAIData: OpenAIResponse = await openAIResponse.json();
    const aiResponse = openAIData.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'No content generated by AI'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Parse the AI response to extract scenes
    let scenes: Scene[];
    try {
      // Try to parse as JSON first
      const parsedResponse = JSON.parse(aiResponse);
      const rawScenes = parsedResponse.scenes || parsedResponse;
      
      if (!Array.isArray(rawScenes)) {
        throw new Error('Response is not an array of scenes');
      }
      
      // Use the new validation function
      const validatedScenes = validateAndImproveScenes(rawScenes, requiredScenes);
      
      // Convert to the expected Scene format
      scenes = validatedScenes.map((scene, index) => ({
        id: scene.id,
        title: scene.title,
        description: `${scene.description}\n\nElementos visuales: ${scene.visualElements}\n\nAcción: ${scene.action}`,
        duration: scene.duration,
        order: index + 1
      }));
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.log('AI Response:', aiResponse);
      
      return NextResponse.json(
        { 
          error: 'Parse Error',
          message: 'La IA no generó un formato JSON válido. Por favor intenta de nuevo.',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Ensure we have valid scenes (validateAndImproveScenes already handles this)
    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'No valid scenes could be extracted from AI response'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Total duration is always scenes.length * 8 (each scene is 8 seconds)
    const totalDuration = scenes.length * 8;

    const response: FilmmakerResponse = {
      scenes,
      totalDuration: body.duration,
      promptUsed: finalPrompt
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Filmmaker API Error:', error);
    
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
      message: 'This endpoint only accepts POST requests'
    } as ErrorResponse,
    { status: 405 }
  );
} 