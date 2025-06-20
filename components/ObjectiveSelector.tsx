'use client';

import useVideoStore from '@/stores/videoStore';

// Spanish configuration data
const OBJECTIVES_ES = [
  { id: 'presentar-producto', label: 'Presentar Producto', description: 'Mostrar características y beneficios de un producto' },
  { id: 'generar-engagement', label: 'Generar Engagement', description: 'Crear contenido que genere interacción y conexión' },
  { id: 'llamar-accion', label: 'Llamar a Acción', description: 'Motivar a los usuarios a realizar una acción específica' },
  { id: 'explicar-concepto', label: 'Explicar Concepto', description: 'Comunicar ideas complejas de forma simple y clara' }
];

const TONES_ES = [
  { id: 'profesional', label: 'Profesional', description: 'Formal, confiable y autoritativo' },
  { id: 'divertido', label: 'Divertido', description: 'Entretenido, alegre y desenfadado' },
  { id: 'directo', label: 'Directo', description: 'Claro, conciso y al grano' },
  { id: 'inspiracional', label: 'Inspiracional', description: 'Motivador, elevado y empoderador' }
];

const STYLES_ES = [
  { id: 'cinematografico', label: 'Cinematográfico', description: 'Calidad cinematográfica con iluminación dramática' },
  { id: 'influencer', label: 'Influencer', description: 'Estilo personal y auténtico de creador de contenido' },
  { id: 'comercial', label: 'Comercial', description: 'Profesional y orientado a ventas' },
  { id: 'sketch', label: 'Sketch', description: 'Entretenido y humorístico' },
  { id: 'documental', label: 'Documental', description: 'Informativo y realista' },
  { id: 'tutorial', label: 'Tutorial', description: 'Educativo y paso a paso' }
];

export default function ObjectiveSelector() {
  const { objective, tone, style, setObjective, setTone, setStyle } = useVideoStore();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          StoryCraft AI
        </h1>
        <p className="text-xl text-slate-300">
          Crea videos profesionales con inteligencia artificial
        </p>
      </div>

      {/* Step 1: Objective Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            ¿Cuál es tu objetivo?
          </h2>
          <p className="text-slate-400">
            Selecciona el propósito principal de tu video
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OBJECTIVES_ES.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setObjective(obj.id)}
              className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 rounded-xl text-left ${
                objective === obj.id
                  ? 'border-indigo-500 bg-indigo-500/20 shadow-lg'
                  : 'border-slate-600 bg-slate-700/50 hover:border-indigo-400'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${
                objective === obj.id 
                  ? 'text-indigo-300' 
                  : 'text-white'
              }`}>
                {obj.label}
              </h3>
              <p className="text-sm text-slate-300">
                {obj.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Tone Selection */}
      {objective && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¿Qué tono quieres?
            </h2>
            <p className="text-slate-400">
              Define la personalidad de tu video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TONES_ES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 rounded-xl text-left ${
                  tone === t.id
                    ? 'border-pink-500 bg-pink-500/20 shadow-lg'
                    : 'border-slate-600 bg-slate-700/50 hover:border-pink-400'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${
                  tone === t.id 
                    ? 'text-pink-300' 
                    : 'text-white'
                }`}>
                  {t.label}
                </h3>
                <p className="text-sm text-slate-300">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Style Selection */}
      {objective && tone && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¿Qué estilo prefieres?
            </h2>
            <p className="text-slate-400">
              Elige el estilo visual que mejor se adapte a tu marca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STYLES_ES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 rounded-xl text-left ${
                  style === s.id
                    ? 'border-amber-500 bg-amber-500/20 shadow-lg'
                    : 'border-slate-600 bg-slate-700/50 hover:border-amber-400'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${
                  style === s.id 
                    ? 'text-amber-300' 
                    : 'text-white'
                }`}>
                  {s.label}
                </h3>
                <p className="text-sm text-slate-300">
                  {s.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 