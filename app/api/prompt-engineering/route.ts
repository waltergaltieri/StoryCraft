import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Request types
interface PromptEngineeringRequest {
  scene: string;
}

// Response types
interface PromptEngineeringResponse {
  optimizedPrompt: string;
  originalScene: string;
  processingTime: number;
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
  const startTime = Date.now();
  
  try {
    // Validate request body
    const body: PromptEngineeringRequest = await request.json();
    
    if (!body.scene || typeof body.scene !== 'string' || body.scene.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Scene description is required and must be a non-empty string'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate scene length (reasonable limits)
    if (body.scene.length > 2000) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Scene description is too long (max 2000 characters)'
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Create the correct prompt for Veo 3 format conversion
    const finalPrompt = `Actúa como un especialista en prompt engineering para Veo 3. Tu tarea es convertir la descripción detallada de una escena en un prompt técnico optimizado para generación de video con IA.

Recibirás la siguiente descripción estructurada de escena:

${body.scene.trim()}

Debes convertirla al formato exacto de Veo 3 siguiendo esta estructura:

[Establishing shot]: [Descripción específica del encuadre inicial y tipo de plano]

[Subject details + environment]: [Descripción completa de TODOS los sujetos (personas, animales, objetos) y entorno en inglés, manteniendo todos los detalles físicos, características y elementos del ambiente]

[Energy/mood]: [Atmósfera y energía específica de la escena]

[Environment details]: [Detalles precisos del entorno, iluminación ambiental, elementos decorativos, música y efectos de sonido]

[Subject action description]: [Descripción exacta de las acciones de TODOS los sujetos paso a paso]

[Dialogue]: 
- Si hay diálogos: (Speaking with [tone description]. The following dialogue MUST BE spoken in Spanish:) "[diálogo exacto en español entre comillas dobles]"
- Si no hay diálogos: There is no dialogue in this scene.

[Lighting]: [Especificaciones técnicas de iluminación, dirección y calidad de luz]

[Style]: [Estilo cinematográfico específico con referencias técnicas de cámara y movimiento]

INSTRUCCIONES CRÍTICAS:
- TODO el prompt debe estar en inglés EXCEPTO los diálogos específicos
- Los diálogos deben estar en español y entre comillas dobles ""
- Mantén TODOS los detalles de la descripción original
- Adapta la descripción a lo que realmente aparece en la escena (personas, objetos, animales, etc.)
- Usa terminología cinematográfica técnica específica
- Sé extremadamente específico con colores, texturas, y elementos visuales
- Mantén la consistencia visual exactamente como se describe

IMPORTANTE: Genera ÚNICAMENTE el prompt optimizado para Veo 3. No agregues texto adicional antes o después del prompt.`;

    // Prepare OpenAI request
    const openAIRequest: OpenAIRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un especialista experto en prompt engineering para Veo 3. Tu única tarea es convertir descripciones de escenas al formato técnico específico requerido por Veo 3. Debes seguir EXACTAMENTE la estructura con las secciones marcadas entre **[corchetes]** y mantener todos los detalles de la escena original. Responde ÚNICAMENTE con el prompt formateado, sin texto adicional.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3 // Lower temperature for more consistent, precise prompts
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
          message: `Failed to optimize prompt: ${openAIResponse.status} ${openAIResponse.statusText}`,
          code: 'OPENAI_API_FAILED'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const openAIData: OpenAIResponse = await openAIResponse.json();
    const optimizedPrompt = openAIData.choices[0]?.message?.content;

    if (!optimizedPrompt) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'No optimized prompt generated by AI'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    // Clean up the optimized prompt
    const cleanedPrompt = optimizedPrompt
      .trim()
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .replace(/\s+/g, ' '); // Normalize whitespace

    // Validate the optimized prompt length
    if (cleanedPrompt.length < 10) {
      return NextResponse.json(
        { 
          error: 'Generation Error',
          message: 'Generated prompt is too short to be useful'
        } as ErrorResponse,
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    const response: PromptEngineeringResponse = {
      optimizedPrompt: cleanedPrompt,
      originalScene: body.scene,
      processingTime
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Prompt Engineering API Error:', error);
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        processingTime
      } as ErrorResponse & { processingTime: number },
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