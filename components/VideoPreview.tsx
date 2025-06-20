'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useVideoStore, { type EnhancedScene } from '@/stores/videoStore';
import { Download, RefreshCw, Play, Share, ExternalLink, CheckCircle } from 'lucide-react';

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

export default function VideoPreview() {
  const { 
    scenes, 
    objective, 
    tone, 
    style, 
    duration, 
    reset, 
    generateSingleVideo, 
    currentProject 
  } = useVideoStore();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const completedScenes = scenes.filter(scene => scene.generationStatus === 'completed');
  const totalVideos = scenes.length;
  const completedCount = completedScenes.length;
  
  // Video final concatenado
  const finalVideo = currentProject?.finalVideoUrl;
  const hasAllVideosCompleted = completedCount === totalVideos;

  const handleDownloadAll = () => {
    completedScenes.forEach((scene, index) => {
      if (scene.videoUrl) {
        const link = document.createElement('a');
        link.href = scene.videoUrl;
        link.download = `storycraft-scene-${index + 1}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    console.log(`📥 Descargando ${completedScenes.length} videos individuales`);
  };

  const handleDownloadFinal = () => {
    if (finalVideo) {
      // Obtener información del blob si está disponible
      let filename = `storycraft-video-final-${Date.now()}.webm`;
      
      if (currentProject && (window as any).storyCraftVideoBlobs?.[currentProject.id]?.final) {
        const finalBlob = (window as any).storyCraftVideoBlobs[currentProject.id].final;
        filename = finalBlob.filename || filename;
        console.log(`💾 Descargando video final: ${filename} (${(finalBlob.blob.size / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      const link = document.createElement('a');
      link.href = finalVideo;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`✅ Video final descargado: ${filename}`);
    }
  };

  const handleShareVideo = (videoUrl: string, index: number) => {
    if (navigator.share) {
      navigator.share({
        title: `StoryCraft AI Video - Escena ${index + 1}`,
        url: videoUrl,
      });
    } else {
      navigator.clipboard.writeText(videoUrl);
      // You could add a toast notification here
    }
  };

  const handleStartOver = () => {
    reset();
  };

  const handleRegenerateVideo = (sceneId: string) => {
    generateSingleVideo(sceneId);
  };

  if (completedScenes.length === 0) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
          <Play className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No hay videos generados aún
          </h2>
          <p className="text-slate-300">
            Completa el proceso de generación de videos para ver tus videos aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold text-white">
            ¡Tus Videos Están Listos!
          </h2>
        </div>
        
        <p className="text-slate-300 max-w-2xl mx-auto">
          ¡Felicitaciones! Tus videos generados por IA están completos. Previsualiza, descarga o comparte tu contenido.
        </p>

        {/* Project Summary */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-white mb-4">Resumen del Proyecto</h3>
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
              <div className="font-medium text-white">{completedCount}/{totalVideos}</div>
              <div className="text-slate-400">Completados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={handleDownloadAll}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Todos los Videos
        </Button>
        {finalVideo && (
          <Button
            onClick={handleDownloadFinal}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Video Final
          </Button>
        )}
        <Button
          onClick={handleStartOver}
          variant="outline"
          className="text-slate-300 border-slate-600 hover:border-slate-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Crear Nuevo Proyecto
        </Button>
      </div>

      {/* Final Video Section */}
      {finalVideo && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center">
            Video Final Completo
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-900">
                <video
                  src={finalVideo}
                  controls
                  className="w-full h-full object-contain"
                  poster="/video-placeholder.jpg"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {objective.charAt(0).toUpperCase() + objective.slice(1)} - {style.charAt(0).toUpperCase() + style.slice(1)}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Duración: {duration} segundos</span>
                      <span>Escenas: {totalVideos}</span>
                      <span>Tono: {tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDownloadFinal}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    
                    <Button
                      onClick={() => finalVideo && navigator.share && navigator.share({
                        title: 'Mi video creado con StoryCraft AI',
                        url: finalVideo,
                      })}
                      variant="outline"
                      className="text-slate-300 border-slate-600 hover:border-slate-500"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm">
                    Video generado con IA basado en tus preferencias. Incluye {totalVideos} escenas 
                    de 8 segundos cada una, concatenadas en un video fluido y profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-slate-700 pt-8">
        <h3 className="text-xl font-semibold text-white text-center mb-6">
          Escenas Individuales
        </h3>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedScenes.map((scene, index) => (
            <Card key={scene.id} className="overflow-hidden bg-slate-800/50 border-slate-700">
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative aspect-video bg-slate-700">
                  {selectedVideo === scene.id ? (
                    <video
                      src={scene.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  ) : (
                    <div 
                      className="w-full h-full cursor-pointer relative group"
                      onClick={() => setSelectedVideo(scene.id)}
                    >
                      <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <span className="text-sm text-slate-300">Click para reproducir</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      Escena {index + 1}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {Math.round(duration / scenes.length)} segundos
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2">
                    {getSceneDescription(scene.description)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => scene.videoUrl && window.open(scene.videoUrl, '_blank')}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-slate-300 border-slate-600 hover:border-slate-500"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </Button>
                    
                    <Button
                      onClick={() => scene.videoUrl && handleShareVideo(scene.videoUrl, index)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-slate-300 border-slate-600 hover:border-slate-500"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      Compartir
                    </Button>
                    
                    <Button
                      onClick={() => handleRegenerateVideo(scene.id)}
                      size="sm"
                      variant="outline"
                      className="text-slate-300 border-slate-600 hover:border-slate-500"
                      title="Regenerar video"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* What's Next Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">¿Qué sigue?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="font-medium text-white mb-1">Descarga tus videos</h4>
              <p className="text-sm text-slate-400">
                Guarda tus videos en alta calidad para usar en tus campañas
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Share className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-medium text-white mb-1">Comparte en redes</h4>
              <p className="text-sm text-slate-400">
                Publica directamente en tus plataformas favoritas
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="font-medium text-white mb-1">Crea más contenido</h4>
              <p className="text-sm text-slate-400">
                Experimenta con diferentes estilos y objetivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 