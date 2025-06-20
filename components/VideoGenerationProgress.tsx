'use client';

import { useEffect } from 'react';
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
  Download
} from 'lucide-react';

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
    refreshAllVideoStatus
  } = useVideoStore();

  const completedScenes = scenes.filter(s => s.generationStatus === 'completed').length;
  const failedScenes = scenes.filter(s => s.generationStatus === 'failed').length;
  const generatingScenes = scenes.filter(s => s.generationStatus === 'generating').length;
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
      }, 1000); // Small delay to show completion
      
      return () => clearTimeout(timer);
    }
  }, [completedScenes, totalScenes, concatenateVideos, currentStep]);

  const getStatusIcon = (scene: EnhancedScene) => {
    switch (scene.generationStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'generating':
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
        const progress = scene.videoProgress || 0;
        if (progress < 25) return 'Optimizando prompt...';
        if (progress < 50) return 'Enviando a Veo 3...';
        if (progress < 100) return `Generando video... ${progress}%`;
        return 'Finalizando...';
      case 'completed':
        return '¡Completado!';
      case 'failed':
        return scene.errorMessage || 'Error en la generación';
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
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  // Mostrar concatenación si estamos en ese paso
  if (currentStep === 'concatenating') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6">
            <Film className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-white">
            Creando Video Final
          </h2>
          
          <p className="text-slate-300 max-w-2xl mx-auto">
            Concatenando todas las escenas en un solo video. ¡Ya casi está listo!
          </p>

          {/* Concatenation Progress */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-full bg-slate-700/50 rounded-full h-4 border border-slate-600/50">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${concatenationProgress}%` }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{concatenationProgress}%</span>
              <span className="text-slate-400 ml-2">procesado</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-6">
          {completedScenes === totalScenes ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : (
            <Film className="w-8 h-8 text-indigo-400 animate-pulse" />
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-white">
          {completedScenes === totalScenes ? '¡Generación Completada!' : 'Generando tus Videos'}
        </h2>
        
        <p className="text-slate-300 max-w-2xl mx-auto">
          {completedScenes === totalScenes 
            ? 'Todos los videos están listos. Preparando video final...'
            : 'Nuestro AI está trabajando en cada escena. Esto puede tomar unos minutos.'
          }
        </p>

        {/* Project Summary */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
            <div className="text-center">
              <div className="font-medium text-white">{duration}s</div>
              <div className="text-slate-400">Duración</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Progreso General</h3>
          <span className="text-sm font-medium text-indigo-300">
            {completedScenes}/{totalScenes} escenas completadas
          </span>
        </div>
        
        <div className="w-full bg-slate-700/50 rounded-full h-4 border border-slate-600/50">
          <div
            className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${
              completedScenes === totalScenes 
                ? 'from-green-500 to-emerald-500' 
                : 'from-indigo-500 to-purple-600'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{overallProgress}%</span>
          <span className="text-slate-400 ml-2">completado</span>
        </div>

        {/* Status Summary */}
        <div className="flex justify-center items-center space-x-6 text-sm">
          {completedScenes > 0 && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>{completedScenes} completadas</span>
            </div>
          )}
          {generatingScenes > 0 && (
            <div className="flex items-center space-x-2 text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{generatingScenes} generando</span>
            </div>
          )}
          {failedScenes > 0 && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{failedScenes} fallidas</span>
            </div>
          )}
          
          {/* Refresh Button */}
          {(generatingScenes > 0 || (completedScenes < totalScenes && completedScenes > 0)) && (
            <Button
              onClick={refreshAllVideoStatus}
              size="sm"
              variant="ghost"
              className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actualizar Estado
            </Button>
          )}
        </div>
      </div>

      {/* Individual Scene Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center">Progreso por Escena</h3>
        
        <div className="grid gap-4">
          {scenes.map((scene, index) => (
            <Card key={scene.id} className="p-6 bg-slate-800/50 border-slate-700">
              <div className="space-y-4">
                {/* Scene Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Escena {index + 1}
                      </h4>
                      <p className="text-sm text-slate-400">
                        8 segundos
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(scene)}
                    <span className="text-sm text-slate-200 font-medium">
                      {getStatusText(scene)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-600/50 rounded-full h-3 border border-slate-500/30">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${getProgressColor(scene)}`}
                      style={{ width: `${scene.videoProgress || 0}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{getStatusText(scene)}</span>
                    <span>{scene.videoProgress || 0}%</span>
                  </div>
                </div>

                {/* Scene Description Preview */}
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                  <p className="text-slate-300 text-sm line-clamp-2">
                    {typeof scene.description === 'string' 
                      ? scene.description 
                      : JSON.stringify(scene.description)
                    }
                  </p>
                </div>

                {/* Processing Steps */}
                {scene.generationStatus === 'generating' && (
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className={`flex items-center space-x-1 ${(scene.videoProgress || 0) >= 25 ? 'text-green-400' : 'text-blue-400'}`}>
                      <Wand2 className="w-3 h-3" />
                      <span>Optimización</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${(scene.videoProgress || 0) >= 50 ? 'text-green-400' : (scene.videoProgress || 0) >= 25 ? 'text-blue-400' : 'text-slate-400'}`}>
                      <Film className="w-3 h-3" />
                      <span>Generación</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${(scene.videoProgress || 0) >= 100 ? 'text-green-400' : (scene.videoProgress || 0) >= 50 ? 'text-blue-400' : 'text-slate-400'}`}>
                      <Download className="w-3 h-3" />
                      <span>Descarga</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {completedScenes === totalScenes && totalScenes > 0 && (
        <div className="text-center space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              ¡Generación Completada!
            </h3>
            <p className="text-green-300 text-sm mb-4">
              Todas las escenas han sido generadas exitosamente. 
            </p>
            
            {/* Manual Concatenation Button */}
            <Button
              onClick={concatenateVideos}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
            >
              <Film className="w-5 h-5 mr-2" />
              Crear Video Final
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 