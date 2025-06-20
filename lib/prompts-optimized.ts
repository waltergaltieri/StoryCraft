// AI Filmmaker Prompts - Optimized Version
// Solo contiene las partes únicas por combinación + template común

// Partes únicas por combinación (solo lo que cambia)
const UNIQUE_PROMPTS: { [key: string]: string } = {
  // 1. PRESENTAR PRODUCTO + PROFESIONAL
  'presentar-producto+profesional+cinematografico': `Crea un guión visual para un video cinematográfico profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación cinematográfica profesional de producto:
- Tono serio, elegante y sofisticado
- Enfoque en la estética premium y calidad del producto
- Cinematografía estilo largometraje con alta producción
- Movimientos de cámara fluidos y complejos
- Iluminación dramática y profesional
- Call-to-action sutil pero efectivo en la última escena
- Estética tipo Apple, Mercedes-Benz o Nespresso`,

  'presentar-producto+profesional+influencer': `Crea un guión visual para un video estilo influencer profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación influencer profesional de producto:
- Tono auténtico pero profesional, como experto confiable
- Comunicación directa a cámara con credibilidad
- Estilo de filmación personal pero pulido
- Enfoque en experiencia real y testimonial honesto
- Planos cercanos y conexión emocional
- Lenguaje accesible pero informado
- Call-to-action personal y convincente
- Estética tipo influencers premium como Marie López o Gaby Espino`,

  'presentar-producto+profesional+comercial': `Crea un guión visual para un video comercial profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para comercial profesional de presentación de producto:
- Tono serio, confiable y autoritativo
- Enfoque en beneficios y credibilidad del producto  
- Estética de comercial televisivo premium
- Call-to-action claro en la última escena
- Cinematografía estilo marcas premium
- Estructura narrativa comercial tradicional
- Ritmo dinámico pero controlado
- Estética tipo Coca-Cola, P&G o Unilever`,

  'presentar-producto+profesional+sketch': `Crea un guión visual para un video sketch profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para sketch profesional de presentación de producto:
- Tono profesional pero con elementos cómicos sutiles
- Situaciones cotidianas que destaquen el producto
- Timing cómico preciso sin perder credibilidad
- Enfoque en resolver problemas de forma inteligente
- Humor sofisticado apropiado para contexto profesional
- Call-to-action integrado naturalmente en la narrativa
- Estética limpia con elementos de comedia situacional
- Estilo tipo sketches de Saturday Night Live comerciales o publicidades de Old Spice`,

  'presentar-producto+profesional+documental': `Crea un guión visual para un video documental profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para documental profesional de presentación de producto:
- Tono educativo, informativo y objetivo
- Enfoque en la historia, proceso o impacto del producto
- Narrativa tipo reportaje con datos y contexto
- Entrevistas o testimoniales auténticos
- Cinematografía documental con cámara móvil
- Información verificable y credible
- Call-to-action educativo más que comercial
- Estética tipo Discovery Channel, National Geographic o documentales de Netflix`,

  'presentar-producto+profesional+tutorial': `Crea un guión visual para un video tutorial profesional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para tutorial profesional de presentación de producto:
- Tono educativo, claro y estructurado
- Enfoque en enseñar el uso correcto del producto
- Explicaciones paso a paso con demostraciones visuales
- Lenguaje técnico pero accesible
- Ritmo pausado para permitir comprensión
- Call-to-action educativo incentivando el aprendizaje
- Estética limpia y funcional tipo YouTube educativo
- Estilo tipo tutoriales de marcas como Adobe, Apple o Google`,

  // 2. PRESENTAR PRODUCTO + DIVERTIDO
  'presentar-producto+divertido+cinematografico': `Crea un guión visual para un video cinematográfico divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación cinematográfica divertida de producto:
- Tono alegre, entretenido y optimista
- Enfoque en aspectos divertidos y únicos del producto
- Cinematografía estilo comedia cinematográfica
- Elementos visuales sorprendentes y coloridos
- Timing cómico en movimientos de cámara
- Call-to-action divertido pero efectivo
- Música upbeat y efectos sonoros alegres
- Estética tipo comerciales de Coca-Cola, McDonald's o Nike`,

  'presentar-producto+divertido+influencer': `Crea un guión visual para un video estilo influencer divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación influencer divertida de producto:
- Tono casual, divertido y auténtico
- Personalidad carismática y energética
- Enfoque en experiencias divertidas con el producto
- Comunicación espontánea pero ensayada
- Elementos de humor natural y situacional
- Call-to-action personal y entusiasta
- Estética tipo content creators como MrBeast, Emma Chamberlain
- Planos dinámicos con transiciones divertidas`,

  'presentar-producto+divertido+comercial': `Crea un guión visual para un video comercial divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para comercial divertido de presentación de producto:
- Tono alegre, memorable y pegajoso
- Enfoque en crear conexión emocional positiva
- Estructura comercial tradicional con elementos cómicos
- Jingles o frases memorables
- Ritmo dinámico y energético
- Call-to-action memorable y divertido
- Colores brillantes y visualmente atractivos
- Estética tipo comerciales de Pepsi, Doritos o Mentos`,

  'presentar-producto+divertido+sketch': `Crea un guión visual para un video sketch divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para sketch divertido de presentación de producto:
- Tono cómico, absurdo pero relevante
- Situaciones exageradas que destaquen beneficios
- Timing cómico preciso con punchlines efectivos
- Personajes carismáticos y memorables
- Humor visual y verbal combinado
- Call-to-action integrado en la comedia
- Estética tipo SNL, Key & Peele o sketches virales
- Setup y payoff claros en la estructura narrativa`,

  'presentar-producto+divertido+documental': `Crea un guión visual para un video documental divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para documental divertido de presentación de producto:
- Tono informativo pero entretenido y ligero
- Enfoque en curiosidades y datos interesantes
- Narrativa tipo mockumentary o documental humorístico
- Entrevistas con personajes pintorescos
- Información real pero presentada de forma divertida
- Call-to-action educativo pero memorable
- Estética tipo documentales de Netflix cómicos o Vice
- Combinación de hechos serios con presentación ligera`,

  'presentar-producto+divertido+tutorial': `Crea un guión visual para un video tutorial divertido de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para tutorial divertido de presentación de producto:
- Tono educativo pero entretenido y dinámico
- Enfoque en hacer el aprendizaje divertido
- Explicaciones claras con elementos cómicos
- Errores cómicos que enseñan qué no hacer
- Ritmo variado con momentos de humor
- Call-to-action motivacional y divertido
- Estética colorida y visualmente estimulante
- Estilo tipo Dude Perfect, How Ridiculous o tutoriales virales`,

  // 3. PRESENTAR PRODUCTO + DIRECTO
  'presentar-producto+directo+cinematografico': `Crea un guión visual para un video cinematográfico directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación cinematográfica directa de producto:
- Tono claro, conciso y sin rodeos
- Enfoque en hechos y características específicas
- Cinematografía limpia sin elementos distractivos
- Comunicación eficiente y al grano
- Ritmo constante y decidido
- Call-to-action claro y directo
- Estética minimalista pero premium
- Estilo tipo comerciales de Tesla, Google o Samsung`,

  'presentar-producto+directo+influencer': `Crea un guión visual para un video estilo influencer directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación influencer directa de producto:
- Tono honesto, transparente y sin florituras
- Comunicación directa a cámara sin artificio
- Enfoque en beneficios reales y verificables
- Testimonial auténtico basado en experiencia
- Ritmo rápido y eficiente
- Call-to-action sincero y personal
- Estética natural sin sobreproducción
- Estilo tipo reviewers honestos como MKBHD o Unbox Therapy`,

  'presentar-producto+directo+comercial': `Crea un guión visual para un video comercial directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para comercial directo de presentación de producto:
- Tono asertivo, confiable y convincente
- Enfoque en propuesta de valor clara
- Estructura comercial tradicional sin distracciones
- Beneficios presentados de forma contundente
- Ritmo dinámico pero controlado
- Call-to-action poderoso y específico
- Estética profesional y confiable
- Estilo tipo comerciales de Microsoft, IBM o consultoras`,

  'presentar-producto+directo+sketch': `Crea un guión visual para un video sketch directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para sketch directo de presentación de producto:
- Tono directo pero con humor inteligente
- Situaciones que van directo al punto del beneficio
- Setup rápido con payoff inmediato
- Humor que refuerza el mensaje comercial
- Ritmo ágil sin tiempo perdido
- Call-to-action integrado naturalmente
- Estética limpia con elementos cómicos precisos
- Estilo tipo sketches comerciales efectivos de Progressive o Geico`,

  'presentar-producto+directo+documental': `Crea un guión visual para un video documental directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para documental directo de presentación de producto:
- Tono factual, objetivo y sin sesgos aparentes
- Enfoque en datos, estadísticas y hechos verificables
- Narrativa periodística directa
- Testimonios breves y al punto
- Información presentada de forma eficiente
- Call-to-action informativo y específico
- Estética tipo reportaje noticioso
- Estilo tipo segmentos de 60 Minutes o Bloomberg`,

  'presentar-producto+directo+tutorial': `Crea un guión visual para un video tutorial directo de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para tutorial directo de presentación de producto:
- Tono instructivo, claro y sin ambigüedades
- Enfoque en pasos específicos y resultados medibles
- Explicaciones concisas sin información extra
- Demostraciones precisas y efectivas
- Ritmo eficiente sin pausas innecesarias
- Call-to-action educativo y directo
- Estética funcional y clara
- Estilo tipo tutoriales técnicos de Khan Academy o Coursera`,

  // 4. PRESENTAR PRODUCTO + INSPIRACIONAL
  'presentar-producto+inspiracional+cinematografico': `Crea un guión visual para un video cinematográfico inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación cinematográfica inspiracional de producto:
- Tono elevado, motivador y transformacional
- Enfoque en el potencial y las posibilidades que abre el producto
- Cinematografía épica con movimientos grandiosos
- Narrativa que conecta con aspiraciones y sueños
- Música inspiracional y emotiva
- Call-to-action que invita a transformar la vida
- Estética tipo campañas de Nike, Apple o Patagonia
- Lighting dramático que evoca emociones profundas`,

  'presentar-producto+inspiracional+influencer': `Crea un guión visual para un video estilo influencer inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para presentación influencer inspiracional de producto:
- Tono personal, motivacional y empoderador
- Historia personal de transformación con el producto
- Enfoque en cómo el producto cambió su vida
- Comunicación emotiva y auténtica
- Conexión profunda con la audiencia
- Call-to-action que motiva al cambio personal
- Estética aspiracional pero accesible
- Estilo tipo influencers motivacionales como Jay Shetty o Mel Robbins`,

  'presentar-producto+inspiracional+comercial': `Crea un guión visual para un video comercial inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para comercial inspiracional de presentación de producto:
- Tono elevado, positivo y transformador
- Enfoque en el impacto positivo en la vida de las personas
- Narrativa que conecta con valores y propósito
- Testimoniales emotivos de transformación
- Música que eleva y motiva
- Call-to-action que invita a ser parte del cambio
- Estética premium con elementos emotivos
- Estilo tipo campañas de Dove, Always o Mastercard`,

  'presentar-producto+inspiracional+sketch': `Crea un guión visual para un video sketch inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para sketch inspiracional de presentación de producto:
- Tono uplifting con humor positivo y motivador
- Situaciones que muestran superación y crecimiento
- Humor que inspira en lugar de solo entretener
- Personajes que evolucionan y se transforman
- Mensaje positivo integrado en la comedia
- Call-to-action que motiva a la acción positiva
- Estética optimista y colorida
- Estilo tipo sketches motivacionales de Soul Pancake o algunos de SNL positivos`,

  'presentar-producto+inspiracional+documental': `Crea un guión visual para un video documental inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para documental inspiracional de presentación de producto:
- Tono elevado, esperanzador y transformador
- Enfoque en historias reales de impacto positivo
- Narrativa que muestra el poder del cambio
- Testimoniales emotivos de personas reales
- Información que inspira a la acción
- Call-to-action que invita a ser parte de algo más grande
- Estética cinematográfica emotiva
- Estilo tipo documentales inspiracionales de TED o Netflix`,

  'presentar-producto+inspiracional+tutorial': `Crea un guión visual para un video tutorial inspiracional de presentación de producto de $duracion segundos sobre: "$descripcion"

Requisitos específicos para tutorial inspiracional de presentación de producto:
- Tono motivador, empoderador y educativo
- Enfoque en capacitar a las personas para lograr más
- Explicaciones que inspiran confianza y autoeficacia
- Demostraciones que muestran posibilidades infinitas
- Ritmo que construye momentum y emoción
- Call-to-action que motiva al crecimiento personal
- Estética aspiracional pero accesible
- Estilo tipo MasterClass o tutoriales de crecimiento personal`,

  // 5. GENERAR ENGAGEMENT + PROFESIONAL
  'generar-engagement+profesional+cinematografico': `Crea un guión visual para un video cinematográfico profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement cinematográfico profesional:
- Tono sofisticado, intrigante y memorable
- Enfoque en crear conexión emocional profunda
- Cinematografía que capture y mantenga atención
- Narrativa que invite a la participación y reflexión
- Elementos visuales que generen conversación
- Call-to-action que motive interacción significativa
- Estética premium que inspire respeto y admiración
- Estilo tipo campañas virales de marcas luxury como BMW o Rolex`,

  'generar-engagement+profesional+influencer': `Crea un guión visual para un video estilo influencer profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement influencer profesional:
- Tono experto, accesible y conversacional
- Enfoque en crear diálogo y debate constructivo
- Contenido que invite a compartir experiencias
- Preguntas que generen participación activa
- Información valiosa que motive a comentar
- Call-to-action que fomente la comunidad
- Estética profesional pero personal
- Estilo tipo influencers educativos como Simon Sinek o Brené Brown`,

  'generar-engagement+profesional+comercial': `Crea un guión visual para un video comercial profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement comercial profesional:
- Tono autorativo, confiable y participativo
- Enfoque en crear buzz y conversación de marca
- Contenido que genere sharing orgánico
- Elementos que inviten a la participación
- Narrativa que conecte con valores compartidos
- Call-to-action que motive acción social
- Estética corporativa pero humana
- Estilo tipo campañas virales de marcas como Wendy's o Netflix`,

  'generar-engagement+profesional+sketch': `Crea un guión visual para un video sketch profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement sketch profesional:
- Tono inteligente, witty y memorable
- Humor sofisticado que genere shares
- Situaciones relacionables que inviten a comentar
- Timing cómico que cree momentos memorables
- Referencias culturales que generen conversación
- Call-to-action que motive participación creativa
- Estética pulida con elementos virales
- Estilo tipo sketches virales de marcas como Dollar Shave Club`,

  'generar-engagement+profesional+documental': `Crea un guión visual para un video documental profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement documental profesional:
- Tono investigativo, revelador y thought-provoking
- Enfoque en temas que generen debate informado
- Información sorprendente que motive a compartir
- Perspectivas que inviten a la reflexión
- Datos que generen conversación
- Call-to-action que motive investigación adicional
- Estética periodística de alta calidad
- Estilo tipo documentales virales de Vox o Vice`,

  'generar-engagement+profesional+tutorial': `Crea un guión visual para un video tutorial profesional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement tutorial profesional:
- Tono experto, útil y community-building
- Enfoque en enseñar skills que la gente quiere compartir
- Contenido valioso que genere agradecimiento
- Tips que motiven a taggar a amigos
- Técnicas que inviten a mostrar resultados
- Call-to-action que fomente sharing de progreso
- Estética educativa de alta calidad
- Estilo tipo tutoriales virales de Tasty o 5-Minute Crafts profesionales`,

  // 6. GENERAR ENGAGEMENT + DIVERTIDO
  'generar-engagement+divertido+cinematografico': `Crea un guión visual para un video cinematográfico divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement cinematográfico divertido:
- Tono alegre, viral y memorable
- Enfoque en crear momentos shareables
- Cinematografía dinámica con elementos sorpresa
- Narrativa que genere risas y shares
- Elementos visuales que inviten a reaccionar
- Call-to-action que motive participación divertida
- Estética colorida y energética
- Estilo tipo videos virales de OK Go o campañas de Skittles`,

  'generar-engagement+divertido+influencer': `Crea un guión visual para un video estilo influencer divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement influencer divertido:
- Tono casual, auténtico y entretenido
- Enfoque en crear conexión a través del humor
- Personalidad carismática que genere follows
- Contenido relatable que invite a comentar
- Momentos espontáneos que generen engagement
- Call-to-action divertido y personal
- Estética natural pero dinámica
- Estilo tipo TikTokers populares o YouTubers como David Dobrik`,

  'generar-engagement+divertido+comercial': `Crea un guión visual para un video comercial divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement comercial divertido:
- Tono alegre, memorable y pegajoso
- Enfoque en crear buzz y conversación viral
- Elementos cómicos que generen shares
- Jingles o frases que se vuelvan memes
- Timing perfecto para máximo impacto
- Call-to-action que invite a participar en trend
- Estética bright y visualmente atractiva
- Estilo tipo campañas virales de Old Spice o Wendy's`,

  'generar-engagement+divertido+sketch': `Crea un guión visual para un video sketch divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement sketch divertido:
- Tono cómico, absurdo y viral
- Enfoque en crear momentos memeables
- Setup y punchlines que generen shares
- Personajes memorables y quotables
- Humor que invite a taggar amigos
- Call-to-action que motive recreación del sketch
- Estética exagerada y llamativa
- Estilo tipo sketches virales de Vine o TikTok comedy`,

  'generar-engagement+divertido+documental': `Crea un guión visual para un video documental divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement documental divertido:
- Tono informativo pero hilarante
- Enfoque en curiosidades que generen WOW
- Narrativa tipo mockumentary engaging
- Datos sorprendentes presentados con humor
- Información que la gente quiere compartir
- Call-to-action que motive investigación divertida
- Estética tipo Buzzfeed o College Humor
- Estilo tipo documentales cómicos virales`,

  'generar-engagement+divertido+tutorial': `Crea un guión visual para un video tutorial divertido de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement tutorial divertido:
- Tono educativo pero extremadamente entretenido
- Enfoque en hacer viral el aprendizaje
- Explicaciones con elementos cómicos memorables
- Fails divertidos que generen shares
- Tips que la gente quiere probar y mostrar
- Call-to-action que motive recreación y sharing
- Estética colorida y dinámica
- Estilo tipo Dude Perfect, 5-Minute Crafts viral o Tasty`,

  // 7. GENERAR ENGAGEMENT + DIRECTO
  'generar-engagement+directo+cinematografico': `Crea un guión visual para un video cinematográfico directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement cinematográfico directo:
- Tono impactante, claro y memorable
- Enfoque en crear reacciones inmediatas
- Cinematografía que capture atención instantáneamente
- Mensaje directo que genere respuesta
- Elementos visuales que demanden interacción
- Call-to-action específico y poderoso
- Estética limpia pero impactante
- Estilo tipo campañas directas de Tesla o campañas de awareness`,

  'generar-engagement+directo+influencer': `Crea un guión visual para un video estilo influencer directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement influencer directo:
- Tono honesto, transparente y provocativo
- Enfoque en generar debate y discusión
- Comunicación directa que inspire respuestas
- Opiniones claras que generen reacciones
- Preguntas directas a la audiencia
- Call-to-action que demande participación inmediata
- Estética sin filtros, auténtica
- Estilo tipo influencers controversiales pero constructivos`,

  'generar-engagement+directo+comercial': `Crea un guión visual para un video comercial directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement comercial directo:
- Tono asertivo, provocativo y memorable
- Enfoque en generar respuesta inmediata
- Mensajes claros que generen reacción
- Propuestas directas que inviten a actuar
- Contraste claro que genere opiniones
- Call-to-action urgente y específico
- Estética bold y sin ambigüedades
- Estilo tipo campañas disruptivas de marcas como Nike o Patagonia`,

  'generar-engagement+directo+sketch': `Crea un guión visual para un video sketch directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement sketch directo:
- Tono directo pero con humor inteligente
- Enfoque en abordar temas relevantes con comedia
- Setup rápido con punchlines que generen debate
- Humor que haga pensar y reaccionar
- Situaciones que reflejen realidades actuales
- Call-to-action que motive discusión constructiva
- Estética limpia y enfocada
- Estilo tipo sketches de Saturday Night Live sobre temas actuales`,

  'generar-engagement+directo+documental': `Crea un guión visual para un video documental directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement documental directo:
- Tono investigativo, revelador y impactante
- Enfoque en exponer verdades que generen reacción
- Datos duros que demanden atención
- Información que la gente necesita saber
- Hechos que generen urgencia de compartir
- Call-to-action que motive acción inmediata
- Estética periodística seria
- Estilo tipo exposés de 60 Minutes o investigaciones de Vice`,

  'generar-engagement+directo+tutorial': `Crea un guión visual para un video tutorial directo de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement tutorial directo:
- Tono instructivo, claro y actionable
- Enfoque en skills inmediatamente aplicables
- Explicaciones que generen "aha moments"
- Resultados que la gente quiere mostrar
- Técnicas que resuelven problemas reales
- Call-to-action que motive aplicación inmediata
- Estética funcional y clara
- Estilo tipo tutoriales efectivos de Khan Academy con twist viral`,

  // 8. GENERAR ENGAGEMENT + INSPIRACIONAL
  'generar-engagement+inspiracional+cinematografico': `Crea un guión visual para un video cinematográfico inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement cinematográfico inspiracional:
- Tono elevado, emotivo y transformador
- Enfoque en crear conexión emocional profunda
- Cinematografía épica que inspire shares
- Narrativa que toque el corazón y motive acción
- Elementos visuales que generen emociones fuertes
- Call-to-action que inspire movimiento colectivo
- Estética premium y emotiva
- Estilo tipo campañas inspiracionales de Nike, Dove o Always`,

  'generar-engagement+inspiracional+influencer': `Crea un guión visual para un video estilo influencer inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement influencer inspiracional:
- Tono personal, motivador y auténtico
- Enfoque en compartir transformación personal
- Historia que inspire a otros a compartir las suyas
- Vulnerabilidad que genere conexión profunda
- Mensaje que motive a taggar a quienes necesitan verlo
- Call-to-action que fomente comunidad de apoyo
- Estética aspiracional pero real
- Estilo tipo influencers motivacionales como Mel Robbins o Jay Shetty`,

  'generar-engagement+inspiracional+comercial': `Crea un guión visual para un video comercial inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement comercial inspiracional:
- Tono elevado, purposeful y emotivo
- Enfoque en valores que unen a las personas
- Mensaje que inspire a ser parte de algo más grande
- Narrativa que conecte con aspiraciones compartidas
- Elementos que generen pride y shares
- Call-to-action que motive participación en causa
- Estética premium con propósito
- Estilo tipo campañas de propósito como Dove, Always o Patagonia`,

  'generar-engagement+inspiracional+sketch': `Crea un guión visual para un video sketch inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement sketch inspiracional:
- Tono uplifting, motivador y memorable
- Enfoque en humor que eleva y conecta
- Situaciones que muestran lo mejor de la humanidad
- Comedy que inspira en lugar de solo entretener
- Momentos que la gente quiere compartir para motivar
- Call-to-action que fomente acts of kindness
- Estética optimista y colorida
- Estilo tipo sketches inspiracionales de Soul Pancake`,

  'generar-engagement+inspiracional+documental': `Crea un guión visual para un video documental inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement documental inspiracional:
- Tono elevado, esperanzador y motivador
- Enfoque en historias que restauran fe en humanidad
- Narrativa que muestra impacto positivo real
- Testimoniales que inspiran a actuar
- Información que motiva a ser parte del cambio
- Call-to-action que invite a movimiento positivo
- Estética cinematográfica emotiva
- Estilo tipo documentales inspiracionales que se vuelven virales`,

  'generar-engagement+inspiracional+tutorial': `Crea un guión visual para un video tutorial inspiracional de generación de engagement de $duracion segundos sobre: "$descripcion"

Requisitos específicos para engagement tutorial inspiracional:
- Tono empoderador, motivador y transformador
- Enfoque en skills que cambian vidas
- Explicaciones que inspiran confianza y crecimiento
- Técnicas que la gente quiere dominar y compartir
- Resultados que motivan a mostrar progreso
- Call-to-action que fomente crecimiento personal
- Estética aspiracional pero accesible
- Estilo tipo MasterClass viral o tutoriales de transformación personal`,

  // 9. EDUCAR + PROFESIONAL
  'educar+profesional+cinematografico': `Crea un guión visual para un video cinematográfico profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación cinematográfica profesional:
- Tono autorativo, académico y respetable
- Enfoque en transmitir conocimiento de alta calidad
- Cinematografía que refuerce la credibilidad del contenido
- Estructura pedagógica clara y bien organizada
- Información respaldada por fuentes confiables
- Call-to-action que motive aprendizaje continuo
- Estética premium y académica
- Estilo tipo documentales educativos de BBC, National Geographic o TED-Ed`,

  'educar+profesional+influencer': `Crea un guión visual para un video estilo influencer profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación influencer profesional:
- Tono experto, accesible y confiable
- Enfoque en democratizar conocimiento especializado
- Comunicación clara que simplifica conceptos complejos
- Credenciales y experiencia claramente establecidas
- Información valiosa presentada de forma engaging
- Call-to-action que fomente comunidad de aprendizaje
- Estética profesional pero personal
- Estilo tipo educadores como Sal Khan, Neil deGrasse Tyson o Bill Nye`,

  'educar+profesional+comercial': `Crea un guión visual para un video comercial profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación comercial profesional:
- Tono autorativo, informativo y persuasivo
- Enfoque en establecer expertise y thought leadership
- Contenido que posiciona como referente en el área
- Información que genera confianza y credibilidad
- Knowledge que demuestra competencia profesional
- Call-to-action que dirija a recursos adicionales
- Estética corporativa premium
- Estilo tipo contenido educativo de IBM, Microsoft o McKinsey`,

  'educar+profesional+sketch': `Crea un guión visual para un video sketch profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación sketch profesional:
- Tono inteligente, witty y memorable
- Enfoque en hacer memorable el aprendizaje a través del humor
- Situaciones que ilustran conceptos de forma divertida
- Humor que refuerza el mensaje educativo
- Personajes que representan diferentes perspectivas de aprendizaje
- Call-to-action que motive exploración del tema
- Estética pulida con elementos educativos
- Estilo tipo sketches educativos de Saturday Night Live Weekend Update`,

  'educar+profesional+documental': `Crea un guión visual para un video documental profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación documental profesional:
- Tono investigativo, objetivo y académico
- Enfoque en presentar hechos verificables y análisis profundo
- Narrativa que construye conocimiento progresivamente
- Fuentes expertas y datos respaldados
- Información que amplía perspectiva sobre el tema
- Call-to-action que motive investigación adicional
- Estética tipo reportaje académico
- Estilo tipo documentales de Frontline, Nova o 60 Minutes`,

  'educar+profesional+tutorial': `Crea un guión visual para un video tutorial profesional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación tutorial profesional:
- Tono instructivo, metódico y competente
- Enfoque en transferir skills específicos y medibles
- Explicaciones step-by-step claras y reproducibles
- Demostraciones que aseguran comprensión
- Evaluación de progreso y dominio del tema
- Call-to-action que motive práctica y aplicación
- Estética educativa profesional
- Estilo tipo cursos de Coursera, Udemy profesional o LinkedIn Learning`,

  // 10. EDUCAR + DIVERTIDO
  'educar+divertido+cinematografico': `Crea un guión visual para un video cinematográfico divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación cinematográfica divertida:
- Tono alegre, engaging y memorable
- Enfoque en hacer el aprendizaje entretenido y sticky
- Cinematografía colorida y dinámica que mantiene atención
- Narrativa que combina educación con entretenimiento
- Elementos visuales que refuerzan el aprendizaje
- Call-to-action que motive exploración divertida del tema
- Estética vibrante y estimulante
- Estilo tipo videos educativos de Kurzgesagt, MinutePhysics o TED-Ed animados`,

  'educar+divertido+influencer': `Crea un guión visual para un video estilo influencer divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación influencer divertida:
- Tono casual, divertido y accesible
- Enfoque en hacer learning social y compartible
- Personalidad carismática que hace el conocimiento atractivo
- Explicaciones con analogías divertidas y memorables
- Interaction que mantiene engagement durante el aprendizaje
- Call-to-action que motive compartir lo aprendido
- Estética natural pero energética
- Estilo tipo educadores como Hank Green, SciShow o Crash Course`,

  'educar+divertido+comercial': `Crea un guión visual para un video comercial divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación comercial divertida:
- Tono alegre, memorable y informativo
- Enfoque en asociar la marca con aprendizaje positivo
- Contenido que educa mientras promociona
- Elementos cómicos que refuerzan el mensaje educativo
- Information que genera goodwill hacia la marca
- Call-to-action que dirija a más recursos educativos
- Estética bright y brand-friendly
- Estilo tipo campañas educativas de Google, Adobe o Duolingo`,

  'educar+divertido+sketch': `Crea un guión visual para un video sketch divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación sketch divertida:
- Tono cómico, educativo y memorable
- Enfoque en enseñar a través de situaciones hilarantes
- Setup que presenta el concepto de forma divertida
- Punchlines que refuerzan el aprendizaje
- Personajes que representan diferentes niveles de conocimiento
- Call-to-action que motive aplicar lo aprendido de forma divertida
- Estética colorida y exagerada
- Estilo tipo sketches educativos de Bill Nye, Mr. Bean educational o Monty Python`,

  'educar+divertido+documental': `Crea un guión visual para un video documental divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación documental divertida:
- Tono informativo pero extremadamente entretenido
- Enfoque en presentar hechos de forma memorable y divertida
- Narrativa tipo edutainment que mantiene engagement
- Datos curiosos y surprising facts presentados con humor
- Información que la gente quiere compartir por ser interesante
- Call-to-action que motive exploración adicional del tema
- Estética tipo mockumentary educativo
- Estilo tipo documentales de Adam Ruins Everything o Last Week Tonight educational segments`,

  'educar+divertido+tutorial': `Crea un guión visual para un video tutorial divertido educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación tutorial divertida:
- Tono instructivo pero extremadamente divertido
- Enfoque en hacer el aprendizaje viral y shareble
- Explicaciones con elementos cómicos que ayudan a recordar
- Demostraciones que incluyen fails educativos divertidos
- Métodos de enseñanza que generan risas y retención
- Call-to-action que motive practicar y compartir resultados
- Estética colorida y dinámica
- Estilo tipo Dude Perfect educational, How Ridiculous science o Mark Rober`,

  // 11. EDUCAR + DIRECTO
  'educar+directo+cinematografico': `Crea un guión visual para un video cinematográfico directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación cinematográfica directa:
- Tono claro, conciso y sin ambigüedades
- Enfoque en transmitir información de forma eficiente
- Cinematografía limpia que no distrae del contenido
- Estructura pedagógica directa al grano
- Información presentada de forma linear y lógica
- Call-to-action específico para aplicar lo aprendido
- Estética minimalista y funcional
- Estilo tipo documentales educativos directos como Khan Academy o MIT OpenCourseWare`,

  'educar+directo+influencer': `Crea un guión visual para un video estilo influencer directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación influencer directa:
- Tono honesto, transparente y sin florituras
- Enfoque en compartir conocimiento real y aplicable
- Comunicación directa sin elementos distractivos
- Explicaciones claras basadas en experiencia real
- Información práctica que se puede usar inmediatamente
- Call-to-action que motive aplicación directa
- Estética natural sin sobreproducción
- Estilo tipo educadores prácticos como Gary Vaynerchuk educativo o Tim Ferriss`,

  'educar+directo+comercial': `Crea un guión visual para un video comercial directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación comercial directa:
- Tono autorativo, informativo y eficiente
- Enfoque en establecer credibilidad a través del conocimiento
- Contenido educativo que demuestra expertise
- Información valiosa sin agenda oculta
- Knowledge sharing que genera confianza
- Call-to-action claro hacia recursos adicionales
- Estética profesional y confiable
- Estilo tipo contenido educativo de HubSpot, Salesforce o Adobe tutorials`,

  'educar+directo+sketch': `Crea un guión visual para un video sketch directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación sketch directa:
- Tono directo pero con humor inteligente
- Enfoque en enseñar conceptos sin perder tiempo
- Setup rápido que va directo al punto educativo
- Humor que refuerza el aprendizaje sin distraer
- Situaciones que ilustran conceptos de forma eficiente
- Call-to-action que motive aplicación inmediata
- Estética limpia con elementos educativos precisos
- Estilo tipo sketches educativos eficientes de Crash Course o educational SNL`,

  'educar+directo+documental': `Crea un guión visual para un video documental directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación documental directa:
- Tono factual, objetivo y sin sesgo
- Enfoque en presentar hechos verificables de forma eficiente
- Narrativa periodística educativa directa
- Información densa pero bien organizada
- Datos presentados de forma clara y comprensible
- Call-to-action que dirija a fuentes adicionales verificables
- Estética tipo reportaje educativo serio
- Estilo tipo documentales educativos de PBS, BBC Learning o 60 Minutes educational`,

  'educar+directo+tutorial': `Crea un guión visual para un video tutorial directo educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación tutorial directa:
- Tono instructivo, claro y metódico
- Enfoque en transferir skills de forma eficiente
- Explicaciones step-by-step sin información extra
- Demostraciones precisas y reproducibles
- Resultados medibles y verificables
- Call-to-action que motive práctica inmediata
- Estética funcional y clara
- Estilo tipo tutoriales técnicos de Khan Academy, Coursera o Stack Overflow`,

  // 12. EDUCAR + INSPIRACIONAL
  'educar+inspiracional+cinematografico': `Crea un guión visual para un video cinematográfico inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación cinematográfica inspiracional:
- Tono elevado, motivador y transformador
- Enfoque en el poder transformador del conocimiento
- Cinematografía épica que inspire sed de aprendizaje
- Narrativa que conecta educación con potencial humano
- Elementos visuales que motivan al crecimiento intelectual
- Call-to-action que inspire transformación a través del aprendizaje
- Estética premium e inspiradora
- Estilo tipo documentales inspiracionales de TED, MasterClass o inspirational education`,

  'educar+inspiracional+influencer': `Crea un guión visual para un video estilo influencer inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación influencer inspiracional:
- Tono personal, motivador y empoderador
- Enfoque en cómo el conocimiento cambió su vida
- Historia personal de transformación a través del aprendizaje
- Conexión emotiva con el poder de la educación
- Inspiración para que otros inicien su journey educativo
- Call-to-action que motive crecimiento personal a través del aprendizaje
- Estética aspiracional pero accesible
- Estilo tipo educadores inspiracionales como Tony Robbins educativo o Oprah educational`,

  'educar+inspiracional+comercial': `Crea un guión visual para un video comercial inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación comercial inspiracional:
- Tono elevado, purposeful y transformador
- Enfoque en el impacto positivo de la educación en la sociedad
- Mensaje que conecta con aspiraciones de crecimiento
- Narrativa que inspira a invertir en educación
- Elementos que generan orgullo en el aprendizaje
- Call-to-action que invite a ser parte de una comunidad de aprendizaje
- Estética premium con propósito educativo
- Estilo tipo campañas inspiracionales de universidades o plataformas educativas`,

  'educar+inspiracional+sketch': `Crea un guión visual para un video sketch inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación sketch inspiracional:
- Tono uplifting, motivador y educativo
- Enfoque en mostrar el journey de aprendizaje como heroico
- Situaciones que celebran el crecimiento intelectual
- Humor que eleva y motiva al aprendizaje
- Personajes que evolucionan a través del conocimiento
- Call-to-action que motive embarcarse en adventure educativo
- Estética optimista y educativa
- Estilo tipo sketches inspiracionales educativos de Mr. Rogers educativo`,

  'educar+inspiracional+documental': `Crea un guión visual para un video documental inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación documental inspiracional:
- Tono elevado, esperanzador y transformador
- Enfoque en historias reales de transformación educativa
- Narrativa que muestra el poder del conocimiento para cambiar vidas
- Testimoniales emotivos de personas transformadas por la educación
- Información que inspira a valorar y buscar el aprendizaje
- Call-to-action que invite a ser parte del cambio educativo
- Estética cinematográfica inspiradora
- Estilo tipo documentales educativos inspiracionales que se vuelven virales`,

  'educar+inspiracional+tutorial': `Crea un guión visual para un video tutorial inspiracional educativo de $duracion segundos sobre: "$descripcion"

Requisitos específicos para educación tutorial inspiracional:
- Tono empoderador, motivador y transformador
- Enfoque en capacitar para alcanzar potencial máximo
- Explicaciones que inspiran confianza en la capacidad de aprender
- Demostraciones que muestran posibilidades infinitas del conocimiento
- Técnicas que construyen momentum educativo y crecimiento
- Call-to-action que motive journey de aprendizaje lifelong
- Estética aspiracional pero accesible educativa
- Estilo tipo MasterClass inspiracional o TED-Ed motivacional`,

  // 13. ENTRETENER + PROFESIONAL
  'entretener+profesional+cinematografico': `Crea un guión visual para un video cinematográfico profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento cinematográfico profesional:
- Tono sofisticado, pulido y memorable
- Enfoque en crear entretenimiento de alta calidad
- Cinematografía premium que impresiona y deleita
- Narrativa que entretiene mientras mantiene profesionalismo
- Elementos que generan admiración por la producción
- Call-to-action que invite a más contenido de calidad
- Estética premium y cinematográfica
- Estilo tipo contenido de entretenimiento de Netflix, HBO o producciones premium`,

  'entretener+profesional+influencer': `Crea un guión visual para un video estilo influencer profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento influencer profesional:
- Tono carismático, polished y engaging
- Enfoque en establecer personal brand a través del entretenimiento
- Personalidad profesional que entretiene sin perder credibilidad
- Contenido que construye audiencia leal y comprometida
- Elementos que generan shares y follows
- Call-to-action que fomente community building
- Estética profesional pero personal
- Estilo tipo top-tier influencers como Will Smith, The Rock o Casey Neistat`,

  'entretener+profesional+comercial': `Crea un guión visual para un video comercial profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento comercial profesional:
- Tono sofisticado, memorable y brand-building
- Enfoque en asociar la marca con entretenimiento de calidad
- Contenido que entretiene mientras promociona sutilmente
- Elementos que generan buzz positivo para la marca
- Narrativa que crea emotional connection con la marca
- Call-to-action integrado naturalmente en el entretenimiento
- Estética premium y brand-appropriate
- Estilo tipo campañas de entretenimiento de Apple, Nike o luxury brands`,

  'entretener+profesional+sketch': `Crea un guión visual para un video sketch profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento sketch profesional:
- Tono inteligente, sofisticado y memorable
- Enfoque en humor de alta calidad que eleva la marca
- Setup y punchlines bien crafted y memorable
- Timing cómico perfecto que muestra profesionalismo
- Personajes y situaciones que generan recall positivo
- Call-to-action que aprovecha el momentum del entretenimiento
- Estética pulida y premium
- Estilo tipo sketches de Saturday Night Live premium o comerciales de Super Bowl`,

  'entretener+profesional+documental': `Crea un guión visual para un video documental profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento documental profesional:
- Tono intrigante, informativo y engaging
- Enfoque en storytelling que entretiene mientras informa
- Narrativa que mantiene suspense y curiosidad
- Información presentada de forma cinematográfica
- Elementos que sorprenden y deleitan
- Call-to-action que aproveche el engagement generado
- Estética tipo documental premium
- Estilo tipo documentales de Netflix que se vuelven culturalmente relevantes`,

  'entretener+profesional+tutorial': `Crea un guión visual para un video tutorial profesional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento tutorial profesional:
- Tono experto pero extremadamente engaging
- Enfoque en hacer el aprendizaje altamente entretenido
- Explicaciones que mantienen atención e interés
- Demostraciones que sorprenden y deleitan
- Elementos que hacen el tutorial memorable y shareble
- Call-to-action que motive engagement continuo
- Estética premium y educativa
- Estilo tipo MasterClass o tutoriales de alta producción que entretienen`,

  // 14. ENTRETENER + DIVERTIDO
  'entretener+divertido+cinematografico': `Crea un guión visual para un video cinematográfico divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento cinematográfico divertido:
- Tono alegre, dinámico y puro entretenimiento
- Enfoque en crear momentos de pura diversión
- Cinematografía que amplifica la diversión y energía
- Narrativa que maximiza las risas y el disfrute
- Elementos visuales que generan smiles y shares
- Call-to-action que invite a más diversión y entretenimiento
- Estética colorida, energética y feel-good
- Estilo tipo comedias cinematográficas viral o videos de Dude Perfect`,

  'entretener+divertido+influencer': `Crea un guión visual para un video estilo influencer divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento influencer divertido:
- Tono casual, auténtico y súper divertido
- Enfoque en crear conexión a través de pura diversión
- Personalidad carismática que entretiene naturalmente
- Contenido espontáneo que genera risas genuinas
- Elementos que invitan a participar en la diversión
- Call-to-action que fomente community de entretenimiento
- Estética natural pero energética y divertida
- Estilo tipo TikTokers entertainers o YouTubers como Mr. Beast`,

  'entretener+divertido+comercial': `Crea un guión visual para un video comercial divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento comercial divertido:
- Tono alegre, memorable y feel-good
- Enfoque en asociar la marca con momentos de diversión
- Elementos cómicos que generan buzz viral
- Narrativa que hace reír mientras promociona sutilmente
- Timing perfecto que maximiza impacto y diversión
- Call-to-action que aproveche el mood positivo
- Estética bright, colorida y optimista
- Estilo tipo comerciales virales de Old Spice, Skittles o Doritos`,

  'entretener+divertido+sketch': `Crea un guión visual para un video sketch divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento sketch divertido:
- Tono cómico, absurdo y puro entretenimiento
- Enfoque en maximizar las risas y el factor viral
- Setup hilarante con punchlines que generan carcajadas
- Personajes exagerados y situaciones memorables
- Humor que es quotable y memeble
- Call-to-action que invite a recrear o compartir el sketch
- Estética exagerada y visualmente cómica
- Estilo tipo Vine clásicos, TikTok viral comedy o sketches de Key & Peele`,

  'entretener+divertido+documental': `Crea un guión visual para un video documental divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento documental divertido:
- Tono informativo pero hilarantemente entretenido
- Enfoque en curiosidades presentadas de forma cómica
- Narrativa tipo mockumentary súper divertida
- Datos y hechos presentados con humor absurdo
- Información que es tanto sorprendente como divertida
- Call-to-action que motive exploración divertida del tema
- Estética tipo comedy documentary
- Estilo tipo documentales cómicos de Borat, Best Worst Movie o This Is Spinal Tap`,

  'entretener+divertido+tutorial': `Crea un guión visual para un video tutorial divertido de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento tutorial divertido:
- Tono instructivo pero extremadamente divertido
- Enfoque en hacer viral el proceso de aprendizaje
- Explicaciones que generan risas constantes
- Fails épicos que son educational y hilarious
- Métodos de enseñanza que son memorable por ser divertidos
- Call-to-action que motive intentar y compartir resultados divertidos
- Estética colorida, dinámica y cómica
- Estilo tipo How Ridiculous, Dude Perfect education o Mark Rober divertido`,

  // 15. ENTRETENER + DIRECTO
  'entretener+directo+cinematografico': `Crea un guión visual para un video cinematográfico directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento cinematográfico directo:
- Tono directo pero altamente entertaining
- Enfoque en entretener sin elementos innecesarios
- Cinematografía que va directo al punto del entretenimiento
- Narrativa eficiente que maximiza diversión por segundo
- Elementos que entretienen sin distraer del mensaje
- Call-to-action claro que aprovecha el engagement
- Estética limpia pero impactante en entertainment value
- Estilo tipo trailers efectivos o content snappy de alta calidad`,

  'entretener+directo+influencer': `Crea un guión visual para un video estilo influencer directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento influencer directo:
- Tono honesto, transparente pero súper entretenido
- Enfoque en entretener a través de autenticidad
- Comunicación directa que es naturally entertaining
- Personalidad genuina que entretiene sin artificio
- Contenido que es both real y entertaining
- Call-to-action directo que mantiene el entertainment value
- Estética natural pero engaging
- Estilo tipo influencers auténticos como Emma Chamberlain o David Dobrik authentic moments`,

  'entretener+directo+comercial': `Crea un guión visual para un video comercial directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento comercial directo:
- Tono asertivo pero genuinely entertaining
- Enfoque en entretener mientras comunica valor directo
- Mensaje claro delivery que es inherently entertaining
- Propuesta de valor que es both direct y fun
- Elementos que entretienen sin comprometer clarity
- Call-to-action específico que leverages entertainment momentum
- Estética clear pero engaging
- Estilo tipo comerciales directos pero memorables de brands como Dollar Shave Club`,

  'entretener+directo+sketch': `Crea un guión visual para un video sketch directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento sketch directo:
- Tono directo pero con humor inteligente y entretenido
- Enfoque en setup rápido con maximum entertainment payoff
- Punchlines que son both direct y hilarious
- Situaciones que entretienen sin perder focus
- Humor que refuerza el mensaje while entertaining
- Call-to-action integrado que maintains comedic momentum
- Estética limpia pero comedically engaging
- Estilo tipo sketches efectivos de SNL que van al grano pero entretienen`,

  'entretener+directo+documental': `Crea un guión visual para un video documental directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento documental directo:
- Tono factual pero inherently entertaining
- Enfoque en hechos presented de forma engaging y directa
- Narrativa que informa while maintaining entertainment value
- Información que es both useful y entertaining
- Datos presented de forma que entretiene sin fluff
- Call-to-action que leverages both information y entertainment
- Estética straightforward pero visually engaging
- Estilo tipo documentales de Vox o Explained que van al punto pero entretienen`,

  'entretener+directo+tutorial': `Crea un guión visual para un video tutorial directo de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento tutorial directo:
- Tono instructivo pero naturally entertaining
- Enfoque en enseñar de forma efficient pero fun
- Explicaciones que son both clear y entertaining
- Demostraciones que entretienen while teaching effectively
- Métodos que are both direct y engaging
- Call-to-action que motiva both learning y sharing
- Estética functional pero entertaining
- Estilo tipo tutoriales effective como los de Mark Rober que teach directly but entertain`,

  // 16. ENTRETENER + INSPIRACIONAL
  'entretener+inspiracional+cinematografico': `Crea un guión visual para un video cinematográfico inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento cinematográfico inspiracional:
- Tono elevado, emotivo pero thoroughly entertaining
- Enfoque en inspirar through the power of entertainment
- Cinematografía que uplift mientras entretiene
- Narrativa que connects emotionally while providing enjoyment
- Elementos que inspire y entertain simultaneously
- Call-to-action que motive positive action through entertainment
- Estética premium que evokes both inspiration y joy
- Estilo tipo películas feel-good o videos inspiracionales que are also entertaining`,

  'entretener+inspiracional+influencer': `Crea un guión visual para un video estilo influencer inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento influencer inspiracional:
- Tono personal, motivador pero genuinely entertaining
- Enfoque en inspiring others through entertaining storytelling
- Historia personal que uplifts while providing entertainment value
- Vulnerability que connects deeply while being engaging
- Mensaje que motiva positive change through entertainment
- Call-to-action que fomente both inspiration y community entertainment
- Estética aspiracional pero naturally entertaining
- Estilo tipo influencers como Dwayne Johnson que inspire through entertainment`,

  'entretener+inspiracional+comercial': `Crea un guión visual para un video comercial inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento comercial inspiracional:
- Tono elevado, purposeful pero highly entertaining
- Enfoque en valores que unite through shared entertainment
- Mensaje que inspire while providing genuine entertainment value
- Narrativa que connects con aspirations through fun
- Elementos que generate both pride y enjoyment
- Call-to-action que motive participation en something both meaningful y fun
- Estética premium que balances purpose con entertainment
- Estilo tipo campañas como Nike que inspire but are also genuinely entertaining`,

  'entretener+inspiracional+sketch': `Crea un guión visual para un video sketch inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento sketch inspiracional:
- Tono uplifting, motivador pero hilarious
- Enfoque en humor que elevates spirits y inspires
- Situaciones que show lo mejor de humanity through comedy
- Comedy que inspires while being genuinely entertaining
- Momentos que people want to share because they're both funny y uplifting
- Call-to-action que fomente both acts of kindness y sharing entertainment
- Estética optimista que balances humor con inspiration
- Estilo tipo sketches feel-good que are both inspiring y funny`,

  'entretener+inspiracional+documental': `Crea un guión visual para un video documental inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento documental inspiracional:
- Tono elevado, esperanzador pero thoroughly engaging
- Enfoque en historias que restore faith while being entertaining
- Narrativa que shows positive impact through compelling storytelling
- Testimoniales que inspire while maintaining entertainment value
- Información que motivates positive action through engaging presentation
- Call-to-action que invite participation en positive movement while being fun
- Estética cinematográfica que balances inspiration con entertainment
- Estilo tipo documentales feel-good que inspire but are also genuinely entertaining`,

  'entretener+inspiracional+tutorial': `Crea un guión visual para un video tutorial inspiracional de entretenimiento de $duracion segundos sobre: "$descripcion"

Requisitos específicos para entretenimiento tutorial inspiracional:
- Tono empoderador, motivador pero extremely entertaining
- Enfoque en skills que change lives through entertaining teaching
- Explicaciones que inspire confidence while being fun to watch
- Técnicas que people want to master because the teaching is entertaining
- Resultados que motivate sharing progress because it's both inspiring y fun
- Call-to-action que fomente growth through entertaining learning experience
- Estética aspiracional que makes learning look fun y achievable
- Estilo tipo MasterClass viral o tutorials que are both life-changing y entertaining`,
};

// Template común que se aplica a TODOS los prompts
const COMMON_TEMPLATE = `

Cada escena debe durar exactamente 8 segundos. Para $duracion segundos, genera $escenas escenas.

CRÍTICO: Cada escena debe ser completamente autocontenida con TODA la información necesaria. NUNCA uses "mismo", "igual", "anterior" o referencias a otras escenas.

Escena [X] (segundos [X*8-8]-[X*8]):

Protagonista: [DESCRIBIR COMPLETAMENTE EN CADA ESCENA: edad exacta, género, descripción física detallada (pelo, piel, barba, complexión), vestimenta específica completa, personalidad - SIN REFERENCIAS]

Escenario: [DESCRIBIR COMPLETAMENTE EN CADA ESCENA: ubicación específica, diseño, materiales, colores, elementos decorativos, iluminación ambiental - SIN REFERENCIAS]

Visual: [Descripción detallada de lo que ocurre]

Cámara: [Ángulo, movimiento, tipo de plano, especificaciones técnicas]

Iluminación: [Tipo de luz, dirección, ambiente lumínico específico]

Audio: [Diálogo exacto en español + música/efectos]

Acción: [Qué hace el protagonista paso a paso]

Estilo: [Estética específica]

IMPORTANTE: Cada escena debe ser completamente independiente. Describe TODOS los elementos (personas, objetos, productos, animales, colores, texturas, etc.) en detalle completo en CADA escena individual, sin asumir conocimiento previo.`;

// Función que concatena la parte única + común
export function getPrompt(objective: string, tone: string, style: string): string {
  const key = `${objective}+${tone}+${style}`;
  const uniquePart = UNIQUE_PROMPTS[key];
  
  if (!uniquePart) {
    // Fallback a un prompt genérico si no se encuentra la combinación
    return `Crea un guión visual para un video de ${objective} con tono ${tone} y estilo ${style} de $duracion segundos sobre: "$descripcion"` + COMMON_TEMPLATE;
  }
  
  return uniquePart + COMMON_TEMPLATE;
}

// Función para obtener todos los prompts (por compatibilidad)
export function getAllPrompts(): { [key: string]: string } {
  const allPrompts: { [key: string]: string } = {};
  
  for (const key in UNIQUE_PROMPTS) {
    allPrompts[key] = UNIQUE_PROMPTS[key] + COMMON_TEMPLATE;
  }
  
  return allPrompts;
} 