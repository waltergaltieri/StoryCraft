// Test script for the new filmmaker system
// This will test the improved prompt generation

const testCases = [
  {
    objective: 'presentar-producto',
    tone: 'profesional',
    style: 'comercial',
    duration: 16,
    description: 'Un nuevo smartphone con cámara de 108MP y batería de larga duración'
  },
  {
    objective: 'generar-conciencia',
    tone: 'divertido',
    style: 'influencer',
    duration: 8,
    description: 'Campaña de concientización sobre el reciclaje de plásticos'
  },
  {
    objective: 'educar-audiencia',
    tone: 'directo',
    style: 'tutorial',
    duration: 16,
    description: 'Cómo usar correctamente las herramientas de Excel para análisis de datos'
  }
];

async function testFilmmaker() {
  console.log('🎬 Testing New Filmmaker System...\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 Test Case ${i + 1}:`);
    console.log(`Objetivo: ${testCase.objective}`);
    console.log(`Tono: ${testCase.tone}`);
    console.log(`Estilo: ${testCase.style}`);
    console.log(`Duración: ${testCase.duration}s`);
    console.log(`Descripción: ${testCase.description}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/filmmaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ SUCCESS');
        console.log(`Escenas generadas: ${data.scenes.length}`);
        console.log(`Duración total: ${data.totalDuration}s`);
        
        data.scenes.forEach((scene, index) => {
          console.log(`\n  Escena ${index + 1}: ${scene.title}`);
          console.log(`  Descripción: ${scene.description.substring(0, 100)}...`);
        });
      } else {
        console.log('❌ ERROR');
        console.log(`Error: ${data.error}`);
        console.log(`Message: ${data.message}`);
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR');
      console.log(`Error: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
  }
}

// Run the test
testFilmmaker().then(() => {
  console.log('\n🏁 Testing completed!');
}).catch(error => {
  console.error('Test failed:', error);
}); 