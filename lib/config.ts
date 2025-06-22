console.log('🔑 Loading API configuration...');

// ⚠️ IMPORTANTE: Este sistema está diseñado para trabajar con variables de entorno
// Las keys hardcodeadas están comentadas para desarrollo local únicamente
// Nunca descomentes las keys cuando vayas a hacer push a GitHub

// Configuración de variables de entorno
const openaiKey = process.env.OPENAI_API_KEY;
const aimlapiKey = process.env.AIMLAPI_KEY;
const kieaiKey = process.env.KIEAI_API_KEY;

// 🚨 FALLBACKS SEGUROS PARA DESARROLLO LOCAL
// Solo descomenta estas líneas LOCALMENTE si necesitas desarrollo rápido
// RECUERDA: Siempre comentarlas antes de hacer git push
// 
// PARA DESARROLLO LOCAL RÁPIDO:
// 1. Descomenta las siguientes líneas
// 2. Agrega tus API keys reales
// 3. RECUERDA: Comentar antes de git push
/*
const openaiKeyFallback = 'sk-tu-openai-key-aqui';
const kieaiKeyFallback = 'tu-kieai-key-aqui';
*/

// Sistema de configuración con prioridad
const finalOpenaiKey = openaiKey; // || openaiKeyFallback; // Descomenta para desarrollo local
const finalKieaiKey = kieaiKey; // || kieaiKeyFallback; // Descomenta para desarrollo local
const finalAimlapiKey = aimlapiKey || 'no-configurada';

// Logging para debugging
console.log('🔍 API Keys Status:');
console.log('OPENAI_API_KEY:', finalOpenaiKey ? `${finalOpenaiKey.substring(0, 10)}...` : '❌ NOT FOUND');
console.log('KIEAI_API_KEY:', finalKieaiKey ? `${finalKieaiKey.substring(0, 10)}...` : '❌ NOT FOUND');
console.log('AIMLAPI_KEY:', finalAimlapiKey ? `${finalAimlapiKey.substring(0, 10)}...` : '❌ NOT FOUND');

// Validaciones
if (finalOpenaiKey && !finalOpenaiKey.startsWith('sk-')) {
  console.warn('⚠️ WARNING: OpenAI API key should start with "sk-"');
}

if (finalOpenaiKey && (finalOpenaiKey.includes(' ') || finalOpenaiKey.includes('\n'))) {
  console.warn('⚠️ WARNING: OpenAI API key contains spaces or newlines');
}

// Verificar si estamos en desarrollo sin variables de entorno
if (!finalOpenaiKey || !finalKieaiKey) {
  console.warn('🚨 AVISO: API Keys no encontradas en variables de entorno');
  console.warn('📝 Para desarrollo local:');
  console.warn('   1. Asegúrate de tener .env.local configurado');
  console.warn('   2. O descomenta las líneas de fallback en lib/config.ts');
  console.warn('   3. RECUERDA: Siempre comentar fallbacks antes de git push');
}

export const config = {
  openaiApiKey: finalOpenaiKey || '',
  aimlapiKey: finalAimlapiKey || '',
  kieaiApiKey: finalKieaiKey || '',
  
  // Validation helpers
  isOpenAIConfigured: () => !!finalOpenaiKey && finalOpenaiKey.startsWith('sk-'),
  isAIMLConfigured: () => !!finalAimlapiKey && finalAimlapiKey !== 'no-configurada',
  isKieAIConfigured: () => !!finalKieaiKey && finalKieaiKey.length > 10,
  
  // Development helpers
  isDevelopmentMode: () => process.env.NODE_ENV === 'development',
  isProductionMode: () => process.env.NODE_ENV === 'production',
  
  // Get masked keys for logging
  getMaskedKeys: () => ({
    openai: finalOpenaiKey ? `${finalOpenaiKey.substring(0, 7)}...${finalOpenaiKey.substring(-4)}` : 'NOT SET',
    aiml: finalAimlapiKey ? `${finalAimlapiKey.substring(0, 7)}...` : 'NOT SET',
    kieai: finalKieaiKey ? `${finalKieaiKey.substring(0, 7)}...` : 'NOT SET',
  }),
  
  // Helper para verificar configuración completa
  isFullyConfigured: () => {
    return !!(finalOpenaiKey && finalKieaiKey);
  },
  
  // Helper para obtener estado de configuración
  getConfigStatus: () => {
    return {
      openai: !!finalOpenaiKey,
      kieai: !!finalKieaiKey,
      aiml: !!finalAimlapiKey && finalAimlapiKey !== 'no-configurada',
      fullyConfigured: !!(finalOpenaiKey && finalKieaiKey)
    };
  }
}; 