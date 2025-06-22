'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useVideoStore, { type EnhancedScene } from '@/stores/videoStore';
import { Edit3, Play, RefreshCw, CheckCircle, AlertCircle, Clock, Download, Film } from 'lucide-react';

interface SceneEditorProps {
  onGenerateVideos: () => void;
}

// Helper function to safely render scene description
const getSceneDescription = (description: any): string => {
  if (typeof description === 'string') {
    return description;
  }
  
  if (typeof description === 'object' && description !== null) {
    // If it's an object with scene structure, extract the relevant parts
    if (description.Visual || description.Protagonista || description.Escenario) {
      let result = '';
      if (description.Protagonista) result += `Protagonista: ${description.Protagonista}. `;
      if (description.Escenario) result += `Escenario: ${description.Escenario}. `;
      if (description.Visual) result += `Visual: ${description.Visual}. `;
      if (description.Acción) result += `Acción: ${description.Acción}. `;
      return result.trim();
    }
    
    // Fallback: stringify the object
    return JSON.stringify(description);
  }
  
  return 'Scene description not available';
};

export default function SceneEditor({ onGenerateVideos }: SceneEditorProps) {
  const { 
    scenes, 
    duration,
    updateScene, 
    generateSingleVideo,
    concatenateVideos,
    currentProject,
    objective,
    tone,
    style
  } = useVideoStore();

  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  // Debug information
  console.log('SceneEditor - scenes:', scenes);
  console.log('SceneEditor - scenes.length:', scenes.length);

  // If no scenes, show a message
  if (!scenes || scenes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-4">
          No hay escenas disponibles
        </h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Parece que no se generaron escenas correctamente. Intenta volver al paso anterior y generar el guión nuevamente.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          Recargar Página
        </Button>
      </div>
    );
  }

  const handleEditStart = (scene: EnhancedScene) => {
    setEditingSceneId(scene.id);
    setEditedDescription(getSceneDescription(scene.description));
  };

  const handleEditSave = (sceneId: string) => {
    updateScene(sceneId, editedDescription);
    setEditingSceneId(null);
    setEditedDescription('');
  };

  const handleEditCancel = () => {
    setEditingSceneId(null);
    setEditedDescription('');
  };

  const handleRegenerateVideo = (sceneId: string) => {
    // Mostrar información contextual antes de regenerar
    const scene = scenes.find(s => s.id === sceneId);
    const sceneIndex = scenes.findIndex(s => s.id === sceneId);
    
    if (scene && window.confirm(
      `🧠 Regeneración Contextual Inteligente\n\n` +
      `Escena ${sceneIndex + 1} de ${scenes.length}\n\n` +
      `Esta regeneración mantendrá coherencia con:\n` +
      `• El objetivo del proyecto: ${objective}\n` +
      `• El tono narrativo: ${tone}\n` +
      `• El estilo visual: ${style}\n` +
      `• La continuidad con las demás escenas\n\n` +
      `¿Proceder con la regeneración contextual?`
    )) {
      console.log(`🎬 Iniciando regeneración contextual para Escena ${sceneIndex + 1}`);
      generateSingleVideo(sceneId);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
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
        return 'Listo para generar';
      case 'generating':
        return `Generando video... ${scene.videoProgress ? `${scene.videoProgress}%` : ''}`;
      case 'completed':
        return 'Video completado';
      case 'failed':
        return scene.errorMessage || 'Error en la generación';
      default:
        return 'Estado desconocido';
    }
  };

  const canGenerateVideos = scenes.length > 0;
  const completedScenes = scenes.filter(s => s.generationStatus === 'completed').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white px-4 sm:px-0">
          Revisa y Edita tu Guión
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          Tu guión generado por IA está listo. Revisa cada escena, haz ediciones si necesitas, y luego genera tus videos.
        </p>
        
        {/* Script Overview */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-400">{scenes.length}</div>
              <div className="text-xs sm:text-sm text-slate-400">Escenas</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-400">{duration}s</div>
              <div className="text-xs sm:text-sm text-slate-400">Duración Total</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-400">{completedScenes}</div>
              <div className="text-xs sm:text-sm text-slate-400">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate All Videos Button */}
      <div className="text-center px-4 sm:px-0">
        <Button
          onClick={onGenerateVideos}
          disabled={!canGenerateVideos}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium"
        >
          <Play className="w-5 h-5 mr-2" />
          Generar Todos los Videos
        </Button>
      </div>

      {/* Scenes List */}
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        {scenes.map((scene, index) => (
          <Card key={scene.id} className="p-4 sm:p-6 bg-slate-800/80 border-slate-600/50 hover:bg-slate-800 transition-colors">
            <div className="space-y-4">
              {/* Scene Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base sm:text-lg">
                      Escena {index + 1}
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-300">
                      {Math.round(duration / scenes.length)} segundos
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(scene.generationStatus)}
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">
                      {getStatusText(scene)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {editingSceneId === scene.id ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEditSave(scene.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                        >
                          Guardar
                        </Button>
                        <Button
                          onClick={handleEditCancel}
                          variant="outline"
                          size="sm"
                          className="text-slate-400 border-slate-600 hover:bg-slate-700 text-xs px-3 py-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEditStart(scene)}
                          variant="outline"
                          size="sm"
                          className="text-slate-400 border-slate-600 hover:bg-slate-700 text-xs px-3 py-1"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                        
                        {scene.generationStatus === 'completed' && (
                          <Button
                            onClick={() => handleRegenerateVideo(scene.id)}
                            variant="outline"
                            size="sm"
                            className="text-blue-400 border-blue-600/50 hover:bg-blue-600/20 text-xs px-3 py-1"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Regenerar</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scene Description */}
              <div>
                {editingSceneId === scene.id ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Descripción de la Escena:
                    </label>
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full h-24 sm:h-32 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                      placeholder="Describe cómo quieres que se vea esta escena..."
                    />
                  </div>
                ) : (
                  <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {getSceneDescription(scene.description)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      {scenes.length > 0 && (
        <div className="text-center pt-8 space-y-4">
          {/* Generate Videos Button */}
          {completedScenes < scenes.length && (
            <Button
              onClick={onGenerateVideos}
              disabled={!canGenerateVideos}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              {completedScenes > 0 ? 'Generar Videos Restantes' : 'Generar Todos los Videos'}
            </Button>
          )}
          
          {/* Concatenation Button - shown when all videos are completed BUT no final video exists */}
          {completedScenes === scenes.length && scenes.length > 0 && !currentProject?.finalVideoUrl && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¡Todas las escenas completadas!
                </h3>
                <p className="text-green-300 text-sm mb-4">
                  Tus {scenes.length} escenas están listas. Ahora puedes crear el video final combinándolas.
                </p>
                
                <Button
                  onClick={concatenateVideos}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
                >
                  <Film className="w-5 h-5 mr-2" />
                  Crear Video Final ({duration}s)
                </Button>
              </div>
            </div>
          )}
          
          {/* Show message when final video already exists */}
          {completedScenes === scenes.length && scenes.length > 0 && currentProject?.finalVideoUrl && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¡Video final ya creado!
                </h3>
                <p className="text-blue-300 text-sm mb-4">
                  Tu video final de {duration}s ya está listo. Puedes verlo en la sección de video completado.
                </p>
                
                <Button
                  onClick={() => {
                    const { setCurrentStep } = useVideoStore.getState();
                    setCurrentStep('completed');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
                >
                  <Film className="w-5 h-5 mr-2" />
                  Ver Video Final
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 