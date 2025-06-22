'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useVideoStore, { type EnhancedScene } from '@/stores/videoStore';
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Loader2,
  Film,
  Wand2,
  Download,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

interface DiagnosisResult {
  sceneId: string;
  status: string;
  errorType?: string;
  canRetry?: boolean;
  isStuck?: boolean;
  progress?: number;
  retryCount: number;
  recommendations: string[];
  actions: { label: string; action: string; type: 'primary' | 'secondary' }[];
}

export default function VideoGenerationProgress() {
  const { 
    scenes, 
    objective, 
    tone, 
    style, 
    duration,
    concatenationProgress,
    generateAllVideos,
    concatenateVideos,
    currentStep,
    setCurrentStep,
    refreshAllVideoStatus,
    retrySceneGeneration,
    diagnoseSceneIssue,
    stopAllPolling,
    forceStopGeneratingScenes
  } = useVideoStore();

  const [showDiagnosis, setShowDiagnosis] = useState<{[key: string]: boolean}>({});
  const [diagnosis, setDiagnosis] = useState<{[key: string]: DiagnosisResult}>({});

  const completedScenes = scenes.filter(s => s.generationStatus === 'completed').length;
  const failedScenes = scenes.filter(s => s.generationStatus === 'failed').length;
  const generatingScenes = scenes.filter(s => s.generationStatus === 'generating').length;
  const stuckScenes = scenes.filter(s => s.isStuck).length;
  const totalScenes = scenes.length;

  const overallProgress = Math.round((completedScenes / totalScenes) * 100);

  // Auto-concatenate when all scenes are completed
  useEffect(() => {
    console.log('🔍 Checking auto-concatenation conditions:', {
      completedScenes,
      totalScenes,
      currentStep,
      shouldActivate: completedScenes === totalScenes && totalScenes > 0 && currentStep === 'video-generation'
    });
    
    if (completedScenes === totalScenes && totalScenes > 0 && currentStep === 'video-generation') {
      console.log('✅ Auto-concatenation activated! Starting in 1 second...');
      const timer = setTimeout(() => {
        console.log('🎬 Starting automatic video concatenation');
        concatenateVideos();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [completedScenes, totalScenes, concatenateVideos, currentStep]);

  const handleDiagnoseScene = async (sceneId: string) => {
    try {
      const result = await diagnoseSceneIssue(sceneId);
      if (result) {
        setDiagnosis(prev => ({ ...prev, [sceneId]: result }));
        setShowDiagnosis(prev => ({ ...prev, [sceneId]: true }));
      }
    } catch (error) {
      console.error('Error diagnosing scene:', error);
    }
  };

  const handleRetryScene = async (sceneId: string, retryType: 'same-prompt' | 'regenerate-prompt' | 'force-new') => {
    setShowDiagnosis(prev => ({ ...prev, [sceneId]: false }));
    await retrySceneGeneration(sceneId, retryType);
  };

  const getStatusIcon = (scene: EnhancedScene) => {
    switch (scene.generationStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'generating':
        if (scene.isStuck) {
          return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
        }
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (scene: EnhancedScene) => {
    switch (scene.generationStatus) {
      case 'idle':
        return 'En cola...';
      case 'generating':
        if (scene.isStuck) {
          return '⚠️ Atascado - Necesita intervención';
        }
        const progress = scene.videoProgress || 0;
        if (progress < 25) return 'Optimizando prompt...';
        if (progress < 50) return 'Enviando a Veo 3...';
        if (progress < 100) return `Generando video... ${progress}%`;
        return 'Finalizando...';
      case 'completed':
        return '¡Completado!';
      case 'failed':
        const retryCount = scene.retryCount || 0;
        const retryText = retryCount > 0 ? ` (Intento ${retryCount})` : '';
        return `❌ ${scene.errorMessage || 'Error en la generación'}${retryText}`;
      default:
        return 'Esperando...';
    }
  };

  const getProgressColor = (scene: EnhancedScene) => {
    switch (scene.generationStatus) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'failed':
        return 'from-red-500 to-red-600';
      case 'generating':
        if (scene.isStuck) {
          return 'from-yellow-500 to-orange-500';
        }
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getErrorTypeMessage = (errorType?: string) => {
    switch (errorType) {
      case 'TIMEOUT':
        return 'Tiempo de espera agotado durante la generación';
      case 'PROGRESS_STUCK':
        return 'El progreso se detuvo sin avanzar';
      case 'CONNECTION_ERROR':
        return 'Problemas de conexión con el servicio';
      case 'NOT_FOUND':
        return 'El video no se encontró en el servidor';
      case 'SERVER_ERROR':
        return 'Error temporal del servidor';
      case 'GENERATION_ERROR':
        return 'Error durante la generación del video';
      case 'RATE_LIMIT':
        return 'Límite de consultas excedido';
      default:
        return 'Error desconocido';
    }
  };

  // Mostrar concatenación si estamos en ese paso
  if (currentStep === 'concatenating') {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full mb-4 sm:mb-6">
            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white px-4 sm:px-0">
            Creando Video Final
          </h2>
          
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
            Concatenando todas las escenas en un solo video. ¡Ya casi está listo!
          </p>

          {/* Concatenation Progress */}
          <div className="max-w-xs sm:max-w-md mx-auto space-y-3 sm:space-y-4 px-4 sm:px-0">
            <div className="w-full bg-slate-700/50 rounded-full h-3 sm:h-4 border border-slate-600/50">
              <div
                className="h-3 sm:h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${concatenationProgress}%` }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-bold text-white">{concatenationProgress}%</span>
              <span className="text-slate-400 ml-2 text-sm sm:text-base">procesado</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-indigo-500/20 rounded-full mb-4 sm:mb-6">
          {completedScenes === totalScenes ? (
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          ) : (
            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 animate-pulse" />
          )}
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white px-4 sm:px-0">
          {completedScenes === totalScenes ? '¡Generación Completada!' : 'Generando tus Videos'}
        </h2>
        
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          {completedScenes === totalScenes 
            ? 'Todos los videos están listos. Preparando video final...'
            : 'Nuestro AI está trabajando en cada escena. Esto puede tomar unos minutos.'
          }
        </p>

        {/* Status Summary */}
        {(failedScenes > 0 || stuckScenes > 0) && (
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Atención Requerida</span>
            </div>
            <p className="text-sm text-red-200">
              {failedScenes > 0 && `${failedScenes} escena(s) fallaron`}
              {failedScenes > 0 && stuckScenes > 0 && ', '}
              {stuckScenes > 0 && `${stuckScenes} escena(s) atascada(s)`}
            </p>
          </div>
        )}

        {/* Project Summary */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center">
              <div className="font-medium text-white capitalize">{objective}</div>
              <div className="text-slate-400">Objetivo</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-white capitalize">{tone}</div>
              <div className="text-slate-400">Tono</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-white capitalize">{style}</div>
              <div className="text-slate-400">Estilo</div>
            </div>
            <div className="text-center lg:col-span-1 col-span-2">
              <div className="font-medium text-white">{duration}s</div>
              <div className="text-slate-400">Duración</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-xl sm:max-w-2xl mx-auto space-y-3 sm:space-y-4 px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-white">Progreso General</h3>
          <span className="text-xs sm:text-sm font-medium text-indigo-300">
            {completedScenes}/{totalScenes} escenas completadas
          </span>
        </div>
        
        <div className="w-full bg-slate-700/50 rounded-full h-3 sm:h-4 border border-slate-600/50">
          <div
            className={`h-3 sm:h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${
              completedScenes === totalScenes 
                ? 'from-green-500 to-emerald-500' 
                : 'from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        <div className="text-center">
          <span className="text-xl sm:text-2xl font-bold text-white">{overallProgress}%</span>
          <span className="text-slate-400 ml-2 text-sm sm:text-base">completado</span>
        </div>
      </div>

      {/* Scenes Progress */}
      <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
        <h3 className="text-base sm:text-lg font-semibold text-white text-center">Estado de las Escenas</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                scene.generationStatus === 'completed'
                  ? 'bg-green-500/10 border-green-500/30'
                  : scene.generationStatus === 'failed'
                  ? 'bg-red-500/10 border-red-500/30'
                  : scene.generationStatus === 'generating'
                  ? scene.isStuck 
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-slate-700/30 border-slate-600/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${getProgressColor(scene)} bg-gradient-to-r`}>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white">
                    Escena {index + 1}
                  </span>
                </div>
                {getStatusIcon(scene)}
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 mb-2">
                {getStatusText(scene)}
              </p>
              
              {/* Progress Bar */}
              {scene.generationStatus === 'generating' && (
                <div className="w-full bg-slate-600/50 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r ${
                      scene.isStuck ? 'from-yellow-500 to-orange-500' : 'from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${scene.videoProgress || 0}%` }}
                  />
                </div>
              )}

              {/* Error Details */}
              {scene.generationStatus === 'failed' && scene.errorType && (
                <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
                  <p className="text-red-300">{getErrorTypeMessage(scene.errorType)}</p>
                </div>
              )}

              {/* Action Buttons */}
              {(scene.generationStatus === 'failed' || scene.isStuck) && (
                <div className="space-y-2">
                  {!showDiagnosis[scene.id] ? (
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleDiagnoseScene(scene.id)}
                        variant="outline"
                        className="w-full text-xs bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-300 p-2"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Diagnosticar
                      </Button>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleRetryScene(scene.id, 'same-prompt')}
                          variant="outline"
                          className="flex-1 text-xs bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-300 p-2"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reintentar
                        </Button>
                        <Button
                          onClick={() => handleRetryScene(scene.id, 'regenerate-prompt')}
                          variant="outline"
                          className="flex-1 text-xs bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-300 p-2"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          Mejorar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-700/30 border border-slate-600/30 rounded text-xs">
                        <p className="text-slate-300 mb-1">
                          {diagnosis[scene.id]?.recommendations[0] || 'Analizando problema...'}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {diagnosis[scene.id]?.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            onClick={() => {
                              const retryType = action.action === 'retry-same' ? 'same-prompt' 
                                : action.action === 'retry-regenerate' ? 'regenerate-prompt' 
                                : 'force-new';
                              handleRetryScene(scene.id, retryType);
                            }}
                            variant="outline"
                            className={`w-full text-xs p-2 ${
                              action.type === 'primary' 
                                ? 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-300'
                                : 'bg-slate-700/20 border-slate-600/30 hover:bg-slate-600/30 text-slate-300'
                            }`}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {action.label}
                          </Button>
                        ))}
                        <Button
                          onClick={() => setShowDiagnosis(prev => ({ ...prev, [scene.id]: false }))}
                          variant="outline"
                          className="w-full text-xs bg-slate-700/20 border-slate-600/30 hover:bg-slate-600/30 text-slate-400 p-2"
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-3 sm:space-y-4 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            onClick={refreshAllVideoStatus}
            variant="outline"
            className="w-full sm:w-auto text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-700 px-4 sm:px-6 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>

          {/* 🚨 BOTÓN DE EMERGENCIA */}
          {generatingScenes > 0 && (
            <Button
              onClick={() => {
                if (confirm('⚠️ EMERGENCIA: ¿Detener TODAS las generaciones activas para prevenir consumo excesivo de tokens?')) {
                  forceStopGeneratingScenes();
                }
              }}
              variant="outline"
              className="w-full sm:w-auto text-red-300 border-red-600 hover:border-red-500 hover:bg-red-900/30 px-4 sm:px-6 py-2"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              🚨 DETENER TODO
            </Button>
          )}
        </div>
        
        <p className="text-xs sm:text-sm text-slate-500">
          El proceso puede tardar entre 5-15 minutos dependiendo de la duración
          {(failedScenes > 0 || stuckScenes > 0) && (
            <>
              <br />
              <span className="text-yellow-400">
                Usa los botones de diagnóstico para resolver problemas
              </span>
            </>
          )}
          {generatingScenes > 0 && (
            <>
              <br />
              <span className="text-red-400">
                🚨 Si detectas consumo excesivo de tokens, usa el botón "DETENER TODO"
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
} 