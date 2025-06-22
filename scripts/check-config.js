#!/usr/bin/env node

/**
 * 🔧 Script de Verificación de Configuración - StoryCraft
 * Verifica que las API keys estén configuradas correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de StoryCraft...\n');

// Verificar archivos de configuración
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('📁 Archivos de configuración:');
console.log(`   .env.local: ${fs.existsSync(envLocalPath) ? '✅ Existe' : '❌ No existe'}`);
console.log(`   .env.example: ${fs.existsSync(envExamplePath) ? '✅ Existe' : '❌ No existe'}`);

// Cargar variables de entorno
require('dotenv').config({ path: envLocalPath });

const openaiKey = process.env.OPENAI_API_KEY;
const kieaiKey = process.env.KIEAI_API_KEY;
const aimlapiKey = process.env.AIMLAPI_KEY;

console.log('\n🔑 Estado de API Keys:');
console.log(`   OpenAI: ${openaiKey ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   KieAI: ${kieaiKey ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   AIML: ${aimlapiKey ? '✅ Configurada' : '⚠️ Opcional'}`);

// Validaciones específicas
let hasErrors = false;

if (!openaiKey) {
  console.log('\n❌ ERROR: OPENAI_API_KEY no está configurada');
  hasErrors = true;
}

if (!kieaiKey) {
  console.log('\n❌ ERROR: KIEAI_API_KEY no está configurada');
  hasErrors = true;
}

if (openaiKey && !openaiKey.startsWith('sk-')) {
  console.log('\n⚠️ WARNING: OpenAI API key debería empezar con "sk-"');
}

// Instrucciones si hay problemas
if (hasErrors) {
  console.log('\n📝 Para solucionar:');
  
  if (!fs.existsSync(envLocalPath)) {
    console.log('   1. Crea el archivo .env.local:');
    console.log('      cp .env.example .env.local');
  }
  
  console.log('   2. Edita .env.local y agrega tus API keys reales');
  console.log('   3. Obtén las keys de:');
  console.log('      - OpenAI: https://platform.openai.com/api-keys');
  console.log('      - KieAI: https://kie.ai/');
  
} else {
  console.log('\n✅ ¡Configuración correcta! El sistema debería funcionar.');
}

console.log('\n🚀 Para ejecutar el proyecto: npm run dev');
process.exit(hasErrors ? 1 : 0); 