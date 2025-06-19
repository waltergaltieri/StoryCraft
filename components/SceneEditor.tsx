'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useVideoStore, { type EnhancedScene } from '@/stores/videoStore';
import { Edit3, Play, RefreshCw, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';

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
    generateSingleVideo 
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
    generateSingleVideo(sceneId);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">
          Revisa y Edita tu Guión
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Tu guión generado por IA está listo. Revisa cada escena, haz ediciones si necesitas, y luego genera tus videos.
        </p>
        
        {/* Script Overview */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-400">{scenes.length}</div>
              <div className="text-sm text-slate-400">Escenas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">{duration}s</div>
              <div className="text-sm text-slate-400">Duración Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">{completedScenes}</div>
              <div className="text-sm text-slate-400">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate All Videos Button */}
      <div className="text-center">
        <Button
          onClick={onGenerateVideos}
          disabled={!canGenerateVideos}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          <Play className="w-5 h-5 mr-2" />
          Generar Todos los Videos
        </Button>
      </div>

      {/* Scenes List */}
      <div className="space-y-6">
        {scenes.map((scene, index) => (
          <Card key={scene.id} className="p-6 bg-slate-800/80 border-slate-600/50 hover:bg-slate-800 transition-colors">
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
                    <h3 className="font-semibold text-white text-lg">
                      Escena {index + 1}
                    </h3>
                    <p className="text-sm text-indigo-300">
                      {Math.round(duration / scenes.length)} segundos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(scene.generationStatus)}
                    <span className="text-sm text-slate-200 font-medium">
                      {getStatusText(scene)}
                    </span>
                  </div>
                  
                  {scene.generationStatus === 'completed' && scene.videoUrl && (
                    <a
                      href={scene.videoUrl}
                      download
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors border border-green-500/30"
                      title="Descargar video"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  
                  {scene.generationStatus !== 'generating' && (
                    <Button
                      onClick={() => handleRegenerateVideo(scene.id)}
                      size="sm"
                      variant="outline"
                      className="text-indigo-300 border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      {scene.generationStatus === 'completed' ? 'Regenerar' : 'Generar'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Scene Description */}
              <div className="space-y-3">
                {editingSceneId === scene.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Describe esta escena..."
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditSave(scene.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Guardar Cambios
                      </Button>
                      <Button
                        onClick={handleEditCancel}
                        size="sm"
                        variant="outline"
                        className="text-slate-300 border-slate-600"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                      <p className="text-white leading-relaxed text-sm">
                        {getSceneDescription(scene.description)}
                      </p>
                    </div>
                    {scene.isEdited && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        Editado
                      </span>
                    )}
                    <Button
                      onClick={() => handleEditStart(scene)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Progress Bar for Generating Scenes */}
              {scene.generationStatus === 'generating' && scene.videoProgress !== undefined && (
                <div className="space-y-2">
                  <div className="w-full bg-slate-600/50 rounded-full h-3 border border-slate-500/30">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${scene.videoProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-indigo-300 text-center font-medium">
                    {scene.videoProgress}% completado
                  </p>
                </div>
              )}

              {/* Video Preview */}
              {scene.generationStatus === 'completed' && scene.videoUrl && (
                <div className="mt-4 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <video
                    src={scene.videoUrl}
                    controls
                    className="w-full max-w-md mx-auto rounded-lg border border-slate-500/30"
                    poster="/video-placeholder.jpg"
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              )}

              {/* Error Message */}
              {scene.generationStatus === 'failed' && scene.errorMessage && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm font-medium">{scene.errorMessage}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Action */}
      {scenes.length > 0 && (
        <div className="text-center pt-8">
          <Button
            onClick={onGenerateVideos}
            disabled={!canGenerateVideos}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            <Play className="w-5 h-5 mr-2" />
            {completedScenes > 0 ? 'Generar Videos Restantes' : 'Generar Todos los Videos'}
          </Button>
        </div>
      )}
    </div>
  );
} 