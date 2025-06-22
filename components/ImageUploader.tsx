'use client';

import { useRef, useState, useEffect } from 'react';
import useVideoStore, { type UploadedImage } from '@/stores/videoStore';
import Button from './ui/Button';
import { 
  Upload, 
  X, 
  User, 
  Package, 
  MapPin, 
  Eye,
  Loader2,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';

export default function ImageUploader() {
  const { 
    uploadedImages, 
    maxImages, 
    uploadImage, 
    removeImage, 
    analyzeImageWithAI,
    openaiQuotaStatus,
    checkOpenAIQuota
  } = useVideoStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<'persona' | 'objeto' | 'entorno'>('persona');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Verificar fondos automáticamente al cargar el componente
  useEffect(() => {
    // Solo verificar si no se ha verificado en los últimos 5 minutos
    const lastChecked = openaiQuotaStatus.lastChecked;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    if (!lastChecked || lastChecked < fiveMinutesAgo) {
      checkOpenAIQuota();
    }
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length && uploadedImages.length < maxImages; i++) {
      const file = files[i];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      await uploadImage(file, selectedType);
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (let i = 0; i < imageFiles.length && uploadedImages.length < maxImages; i++) {
      const file = imageFiles[i];
      
      if (file.size <= 10 * 1024 * 1024) {
        await uploadImage(file, selectedType);
      }
    }
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const getTypeIcon = (type: 'persona' | 'objeto' | 'entorno') => {
    switch (type) {
      case 'persona':
        return <User className="w-4 h-4" />;
      case 'objeto':
        return <Package className="w-4 h-4" />;
      case 'entorno':
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: 'persona' | 'objeto' | 'entorno') => {
    switch (type) {
      case 'persona':
        return 'from-blue-500 to-cyan-500';
      case 'objeto':
        return 'from-green-500 to-emerald-500';
      case 'entorno':
        return 'from-purple-500 to-pink-500';
    }
  };

  const canUploadMore = uploadedImages.length < maxImages;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-white">
          Referencias Visuales
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm text-slate-400">
            {uploadedImages.length}/{maxImages} imágenes
          </div>
        </div>
      </div>

      {/* OpenAI Quota Status */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              openaiQuotaStatus.mode === 'ai' ? 'bg-green-500' :
              openaiQuotaStatus.mode === 'fallback' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-xs sm:text-sm text-slate-300">
              {openaiQuotaStatus.mode === 'ai' ? '🤖 Análisis con IA' :
               openaiQuotaStatus.mode === 'fallback' ? '⚡ Modo respaldo' :
               '⚠️ Estado incierto'}
            </span>
          </div>
          <button
            onClick={checkOpenAIQuota}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Verificar fondos
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {openaiQuotaStatus.message}
          {openaiQuotaStatus.lastChecked && (
            <span className="ml-2">
              (Verificado: {openaiQuotaStatus.lastChecked.toLocaleTimeString()})
            </span>
          )}
        </p>
      </div>

      {/* Upload Area */}
      {canUploadMore && (
        <div className="space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de imagen
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'persona', label: 'Persona', icon: User },
                { value: 'objeto', label: 'Objeto', icon: Package },
                { value: 'entorno', label: 'Entorno', icon: MapPin }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value as any)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                    selectedType === value
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-600 rounded-lg p-6 sm:p-8 text-center hover:border-slate-500 transition-colors"
          >
            <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2 text-sm sm:text-base">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Máximo 10MB por imagen • JPG, PNG, WebP
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-700"
            >
              Seleccionar Archivos
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Seleccionar archivos de imagen"
            />
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">
            Imágenes Subidas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {uploadedImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onRemove={removeImage}
                onRetryAnalysis={analyzeImageWithAI}
                onCopyTag={copyTag}
                copiedTag={copiedTag}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {uploadedImages.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-indigo-300">
                Cómo usar los tags
              </h4>
              <p className="text-xs text-slate-300">
                Copia los tags (ej: <code className="bg-slate-700 px-1 rounded">Personaje_1</code>) y pégalos en la descripción de tu video donde quieras que aparezcan. 
                La IA reemplazará automáticamente cada tag con la descripción detallada de la imagen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ImageCardProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  onRetryAnalysis: (id: string) => Promise<void>;
  onCopyTag: (tag: string) => void;
  copiedTag: string | null;
  getTypeIcon: (type: 'persona' | 'objeto' | 'entorno') => JSX.Element;
  getTypeColor: (type: 'persona' | 'objeto' | 'entorno') => string;
}

function ImageCard({ 
  image, 
  onRemove, 
  onRetryAnalysis, 
  onCopyTag, 
  copiedTag,
  getTypeIcon,
  getTypeColor 
}: ImageCardProps) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg overflow-hidden">
      {/* Image Preview */}
      <div className="relative aspect-video">
        <img
          src={image.preview}
          alt={`${image.type} preview`}
          className="w-full h-full object-cover"
        />
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
          title="Eliminar imagen"
          aria-label="Eliminar imagen"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Type Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTypeColor(image.type)}`}>
          <div className="flex items-center space-x-1">
            {getTypeIcon(image.type)}
            <span className="capitalize">{image.type}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Tag */}
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono bg-slate-600/50 px-2 py-1 rounded text-slate-200">
            {image.tag}
          </code>
          <button
            onClick={() => onCopyTag(image.tag)}
            className="p-1 hover:bg-slate-600/50 rounded transition-colors"
            title="Copiar tag"
          >
            {copiedTag === image.tag ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* Analysis Status */}
        {image.isAnalyzing ? (
          <div className="flex items-center space-x-2 text-blue-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs">Analizando con IA...</span>
          </div>
        ) : image.analysisError ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">Error en análisis</span>
            </div>
            <Button
              onClick={() => onRetryAnalysis(image.id)}
              variant="outline"
              className="w-full text-xs py-1 px-2 h-6 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/10"
            >
              Reintentar
            </Button>
          </div>
        ) : image.description ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {image.description.includes('cuota de OpenAI agotada') || image.description.includes('Descripción generada automáticamente') ? (
                <span className="text-xs text-yellow-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Modo respaldo</span>
                </span>
              ) : (
                <span className="text-xs text-green-400">✓ Analizada</span>
              )}
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showDescription ? 'Ocultar' : 'Ver descripción'}
              </button>
            </div>
            {showDescription && (
              <div className="space-y-1">
                <p className="text-xs text-slate-300 bg-slate-800/50 p-2 rounded">
                  {image.description}
                </p>
                {(image.description.includes('cuota de OpenAI agotada') || image.description.includes('Descripción generada automáticamente')) && (
                  <p className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded">
                    💸 Esta descripción fue generada automáticamente porque se agotó la cuota de OpenAI. Aún es útil para generar videos.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
} 