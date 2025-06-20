console.log('🔑 Loading API configuration...');

// Validate API keys
const openaiKey = process.env.OPENAI_API_KEY;
const aimlapiKey = process.env.AIMLAPI_KEY;
const kieaiKey = process.env.KIEAI_API_KEY;

console.log('OPENAI_API_KEY loaded:', openaiKey ? `${openaiKey.substring(0, 10)}...` : 'NOT FOUND');
console.log('AIMLAPI_KEY loaded:', aimlapiKey ? `${aimlapiKey.substring(0, 10)}...` : 'NOT FOUND');
console.log('KIEAI_API_KEY loaded:', kieaiKey ? `${kieaiKey.substring(0, 10)}...` : 'NOT FOUND');

// Validate OpenAI key format
if (openaiKey && !openaiKey.startsWith('sk-')) {
  console.warn('⚠️ WARNING: OpenAI API key should start with "sk-"');
}

// Check for common issues
if (openaiKey && (openaiKey.includes(' ') || openaiKey.includes('\n'))) {
  console.warn('⚠️ WARNING: OpenAI API key contains spaces or newlines');
}

export const config = {
  openaiApiKey: openaiKey || '',
  aimlapiKey: aimlapiKey || '',
  kieaiApiKey: kieaiKey || '',
  
  // Validation helpers
  isOpenAIConfigured: () => !!openaiKey && openaiKey.startsWith('sk-'),
  isAIMLConfigured: () => !!aimlapiKey,
  isKieAIConfigured: () => !!kieaiKey,
  
  // Get masked keys for logging
  getMaskedKeys: () => ({
    openai: openaiKey ? `${openaiKey.substring(0, 7)}...${openaiKey.substring(-4)}` : 'NOT SET',
    aiml: aimlapiKey ? `${aimlapiKey.substring(0, 7)}...` : 'NOT SET',
    kieai: kieaiKey ? `${kieaiKey.substring(0, 7)}...` : 'NOT SET',
  })
}; 