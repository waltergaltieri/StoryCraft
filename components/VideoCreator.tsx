'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import ObjectiveSelector from './ObjectiveSelector';
import SceneEditor from './SceneEditor';
import VideoPreview from './VideoPreview';
import Button from './ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function VideoCreator() {
  const router = useRouter();
  const {
    isAuthenticated,
    currentStep,
    objective,
    tone,
    style,
    duration,
    description,
    isLoading,
    error,
    setCurrentStep,
    setObjective,
    setTone,
    setStyle,
    setDuration,
    setDescription,
    generateScript,
    generateAllVideos,
    reset
  } = useVideoStore();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGenerateScript = async () => {
    await generateScript();
  };

  const handleGenerateVideos = async () => {
    await generateAllVideos();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <div className="space-y-8">
            <ObjectiveSelector />
            
            {objective && tone && style && (
              <div className="space-y-6">
                {/* Duration Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Duración del Video
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[8, 16, 24, 32].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          duration === dur
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-2xl font-bold">{dur}s</div>
                        <div className="text-sm opacity-75">
                          {dur === 8 ? 'Rápido' : 
                           dur === 16 ? 'Estándar' : 
                           dur === 24 ? 'Detallado' : 'Completo'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Describe tu video
                  </h3>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Un video promocional para una nueva app de fitness que ayuda a los usuarios a mantenerse motivados con entrenamientos personalizados..."
                    className="w-full h-32 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Generate Button */}
                {description && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGenerateScript}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generando Guión...
                        </div>
                      ) : (
                        'Generar Guión'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'script-generation':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-6">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Generando tu guión...
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Nuestro AI Filmmaker está creando escenas profesionales basadas en tus preferencias. 
              Esto puede tomar unos momentos.
            </p>
          </div>
        );

      case 'scene-editing':
        return <SceneEditor onGenerateVideos={handleGenerateVideos} />;

      case 'video-generation':
      case 'completed':
        return <VideoPreview />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Crear Video</h1>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center space-x-4">
              {[
                { step: 'selection', label: 'Configuración' },
                { step: 'scene-editing', label: 'Escenas' },
                { step: 'completed', label: 'Videos' }
              ].map(({ step, label }, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? 'bg-indigo-500 text-white'
                        : currentStep === 'script-generation' && step === 'selection'
                        ? 'bg-indigo-500 text-white'
                        : currentStep === 'video-generation' && (step === 'selection' || step === 'scene-editing')
                        ? 'bg-green-500 text-white'
                        : currentStep === 'completed' && step !== 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm text-slate-300">{label}</span>
                  {index < 2 && (
                    <div className="w-8 h-0.5 bg-slate-600 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {renderCurrentStep()}
      </main>
    </div>
  );
} 