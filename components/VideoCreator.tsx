'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import ObjectiveSelector from './ObjectiveSelector';
import SceneEditor from './SceneEditor';
import VideoPreview from './VideoPreview';
import VideoGenerationProgress from './VideoGenerationProgress';
import ImageUploader from './ImageUploader';
import Button from './ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function VideoCreator() {
  const router = useRouter();
  const {
    isAuthenticated,
    currentStep,
    projectName,
    objective,
    tone,
    style,
    duration,
    description,
    isLoading,
    error,
    setCurrentStep,
    setProjectName,
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
          <div className="space-y-6 sm:space-y-8">
            {/* Project Name */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                Nombre de tu Proyecto
              </h3>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ej: Video Promocional Fitness App, Presentación Empresa, Tutorial Producto..."
                className="w-full p-3 sm:p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                maxLength={100}
              />
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Este nombre te ayudará a identificar tu proyecto en el dashboard
              </p>
            </div>

            <ObjectiveSelector />
            
            {objective && tone && style && projectName && (
              <div className="space-y-6">
                {/* Duration Selection */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    Duración del Video
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[8, 16, 24, 32].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                          duration === dur
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-xl sm:text-2xl font-bold">{dur}s</div>
                        <div className="text-xs sm:text-sm opacity-75">
                          {dur === 8 ? '1 escena' : 
                           dur === 16 ? '2 escenas' : 
                           dur === 24 ? '3 escenas' : '4 escenas'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Uploader */}
                <ImageUploader />

                {/* Description Input */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    Describe tu video
                  </h3>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Un video promocional para una nueva app de fitness que ayuda a los usuarios a mantenerse motivados con entrenamientos personalizados. Puedes usar tags como Personaje_1, Objeto_1, Entorno_1..."
                    className="w-full h-28 sm:h-32 p-3 sm:p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Generate Button */}
                {description && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleGenerateScript}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium text-base sm:text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
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
      case 'concatenating':
        return <VideoGenerationProgress />;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white mr-2 sm:mr-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    {projectName || 'Nuevo Proyecto'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {currentStep === 'selection' ? 'Selecciona tus preferencias' :
                     currentStep === 'script-generation' ? 'Generando guión...' :
                     currentStep === 'scene-editing' ? 'Edita tu guión' :
                     currentStep === 'video-generation' ? 'Generando videos...' :
                     currentStep === 'concatenating' ? 'Creando video final...' :
                     currentStep === 'completed' ? 'Video completado' : 'En progreso'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {['selection', 'scene-editing', 'video-generation', 'completed'].map((step, index) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentStep === step ? 'bg-purple-400' :
                      ['selection', 'scene-editing', 'video-generation', 'completed'].indexOf(currentStep) > index ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {renderCurrentStep()}
      </main>
    </div>
  );
} 