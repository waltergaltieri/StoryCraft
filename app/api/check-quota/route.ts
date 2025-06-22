import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuración de OpenAI - Solo usar variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET() {
  try {
    console.log('🔍 Verificando fondos disponibles en OpenAI...');
    
    // Hacer una llamada muy pequeña y barata para verificar el estado
    const testResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo más barato
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
      temperature: 0
    });
    
    console.log('✅ OpenAI tiene fondos disponibles');
    
    return NextResponse.json({
      hasQuota: true,
      message: 'Fondos disponibles - análisis de imágenes con IA activo',
      mode: 'ai'
    });
    
  } catch (error: any) {
    console.error('Error verificando fondos:', error);
    
    if (error.status === 429 || error.code === 'insufficient_quota') {
      console.log('💸 OpenAI sin fondos - modo respaldo activado');
      
      return NextResponse.json({
        hasQuota: false,
        message: 'Fondos agotados - usando descripciones automáticas',
        mode: 'fallback',
        error: 'insufficient_quota'
      });
    }
    
    // Para otros errores, asumir que hay fondos pero hay problemas de conectividad
    return NextResponse.json({
      hasQuota: true,
      message: 'Estado incierto - intentando con IA (puede fallar)',
      mode: 'uncertain',
      error: error.message
    });
  }
} 