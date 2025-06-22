'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/lib/ThemeContext';
import { Calendar, Clock, Play, Pause, Archive, Trash2, Plus, Eye, Download, Share2, CheckCircle, AlertCircle, Video, Users, TrendingUp, BarChart3, Target, Settings, Filter, Search, RefreshCw } from 'lucide-react';

export default function CampaignsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    user,
    isAuthenticated,
    campaigns, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign, 
    pauseCampaign, 
    resumeCampaign, 
    archiveCampaign,
    simulatePublishVideo,
    generateCampaignContent,
    generateVideoDescriptions,
    regenerateVideoDescription,
    generateCampaignVideo,
    downloadCampaignVideo
  } = useVideoStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Loading...</div>
      </div>
    );
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingDescriptions, setGeneratingDescriptions] = useState<string | null>(null);

  // Filtrar campañas
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Estadísticas generales
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalVideosGenerated = campaigns.reduce((sum, c) => sum + c.generatedVideos, 0);
  const totalVideosPublished = campaigns.reduce((sum, c) => sum + c.publishedVideos, 0);

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              📢 Gestión de Campañas
            </h1>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              Automatiza la creación y publicación de contenido para tus redes sociales
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nueva Campaña
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Total Campañas</p>
                <p className="text-2xl font-bold text-white">{totalCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Campañas Activas</p>
                <p className="text-2xl font-bold text-white">{activeCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Videos Generados</p>
                <p className="text-2xl font-bold text-white">{totalVideosGenerated}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Share2 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Videos Publicados</p>
                <p className="text-2xl font-bold text-white">{totalVideosPublished}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar campañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
                          <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
                             <select
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
                 className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 title="Filtrar por estado"
               >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="paused">Pausadas</option>
                <option value="completed">Completadas</option>
                <option value="archived">Archivadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de campañas */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 shadow-lg text-center">
            <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {campaigns.length === 0 ? 'No hay campañas creadas' : 'No se encontraron campañas'}
            </h3>
            <p className="text-slate-400 mb-6">
              {campaigns.length === 0 
                ? 'Crea tu primera campaña para comenzar a generar contenido automatizado'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {campaigns.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crear Primera Campaña
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onPause={() => pauseCampaign(campaign.id)}
                onResume={() => resumeCampaign(campaign.id)}
                onArchive={() => archiveCampaign(campaign.id)}
                onDelete={() => deleteCampaign(campaign.id)}
                onSelect={() => setSelectedCampaign(campaign.id)}
                onSimulatePublish={(videoId: string) => simulatePublishVideo(campaign.id, videoId)}
                onGenerateDescriptions={async () => {
                  setGeneratingDescriptions(campaign.id);
                  try {
                    await generateVideoDescriptions(campaign.id);
                  } finally {
                    setGeneratingDescriptions(null);
                  }
                }}
                onRegenerateDescription={(videoId: string) => regenerateVideoDescription(campaign.id, videoId)}
                onGenerateVideo={(videoId: string) => generateCampaignVideo(campaign.id, videoId)}
                onDownloadVideo={(videoId: string) => downloadCampaignVideo(campaign.id, videoId)}
                isGeneratingDescriptions={generatingDescriptions === campaign.id}
              />
            ))}
          </div>
        )}

        {/* Modal de creación de campaña */}
        {showCreateModal && (
          <CreateCampaignModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createCampaign}
          />
        )}

        {/* Modal de detalles de campaña */}
        {selectedCampaign && (
          <CampaignDetailsModal
            campaign={campaigns.find(c => c.id === selectedCampaign)!}
            onClose={() => setSelectedCampaign(null)}
                         onSimulatePublish={(videoId: string) => simulatePublishVideo(selectedCampaign, videoId)}
          />
        )}
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de campaña
function CampaignCard({ 
  campaign, 
  onPause, 
  onResume, 
  onArchive, 
  onDelete, 
  onSelect, 
  onSimulatePublish,
  onGenerateDescriptions,
  onRegenerateDescription,
  onGenerateVideo,
  onDownloadVideo,
  isGeneratingDescriptions
}: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const progress = campaign.totalVideos > 0 ? (campaign.publishedVideos / campaign.totalVideos) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{campaign.name}</h3>
          <p className="text-gray-600 text-sm">{campaign.objective}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
          {getStatusIcon(campaign.status)}
          {campaign.status === 'active' ? 'Activa' : 
           campaign.status === 'paused' ? 'Pausada' :
           campaign.status === 'completed' ? 'Completada' : 'Archivada'}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{campaign.totalVideos}</p>
          <p className="text-xs text-gray-500">Total Videos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{campaign.generatedVideos}</p>
          <p className="text-xs text-gray-500">Generados</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{campaign.publishedVideos}</p>
          <p className="text-xs text-gray-500">Publicados</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progreso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Redes sociales */}
      <div className="flex flex-wrap gap-2 mb-4">
        {campaign.socialNetworks.map((network: string) => (
          <span key={network} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {network}
          </span>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </button>
        
        {/* Botón generar descripciones */}
        <button
          onClick={onGenerateDescriptions}
          disabled={isGeneratingDescriptions}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isGeneratingDescriptions ? "Generando descripciones..." : "Generar descripciones con IA"}
        >
          {isGeneratingDescriptions ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
        </button>
        
        {campaign.status === 'active' ? (
          <button
            onClick={onPause}
            className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700 transition-colors"
            title="Pausar"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : campaign.status === 'paused' ? (
          <button
            onClick={onResume}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            title="Reanudar"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : null}
        
        <button
          onClick={onArchive}
          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title="Archivar"
        >
          <Archive className="w-4 h-4" />
        </button>
        
        <button
          onClick={onDelete}
          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Modal de creación de campaña
function CreateCampaignModal({ onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    name: '',
    objective: 'presentar-producto',
    tone: 'profesional',
    style: 'cinematografico',
    duration: 8,
    campaignDescription: '',
    scheduledDays: ['lunes', 'miércoles', 'viernes'],
    scheduledTimes: ['09:00', '15:00'],
    socialNetworks: ['Instagram', 'TikTok'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    constants: {
      watermark: '',
      brandElements: [],
      recurringPersons: []
    }
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      await onCreate({
        ...formData,
        status: 'active' as const
      });
      onClose();
    } catch (error) {
      console.error('Error creando campaña:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Campaña</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Campaña
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Campaña Navidad 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo
                </label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar objetivo de la campaña"
                >
                  <option value="presentar-producto">Presentar Producto</option>
                  <option value="generar-engagement">Generar Engagement</option>
                  <option value="llamar-accion">Llamar a Acción</option>
                  <option value="explicar-concepto">Explicar Concepto</option>
                </select>
              </div>
            </div>

            {/* Tono, estilo y duración */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tono
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar tono de la campaña"
                >
                  <option value="profesional">Profesional</option>
                  <option value="divertido">Divertido</option>
                  <option value="directo">Directo</option>
                  <option value="inspiracional">Inspiracional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo Visual
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData({...formData, style: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar estilo visual de la campaña"
                >
                  <option value="cinematografico">Cinematográfico</option>
                  <option value="influencer">Influencer</option>
                  <option value="comercial">Comercial</option>
                  <option value="sketch">Sketch</option>
                  <option value="documental">Documental</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (segundos)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar duración de los videos"
                >
                  <option value={8}>8 segundos (1 escena)</option>
                  <option value={16}>16 segundos (2 escenas)</option>
                  <option value={24}>24 segundos (3 escenas)</option>
                  <option value={32}>32 segundos (4 escenas)</option>
                </select>
              </div>
            </div>

            {/* Descripción de la campaña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la Campaña
              </label>
              <textarea
                required
                value={formData.campaignDescription}
                onChange={(e) => setFormData({...formData, campaignDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                placeholder="Ej: Quiero varios videos donde nuestro producto_1 sea visto en varios paisajes y lugares turísticos..."
                title="Descripción general de lo que quieres lograr con esta campaña"
              />
              <p className="text-xs text-gray-500 mt-1">
                La IA usará esta descripción para generar contenido específico para cada video programado.
              </p>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar fecha de inicio de la campaña"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar fecha de fin de la campaña (opcional)"
                />
              </div>
            </div>

            {/* Programación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Publicación
              </label>
              <div className="flex flex-wrap gap-2">
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.scheduledDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, scheduledDays: [...formData.scheduledDays, day]});
                        } else {
                          setFormData({...formData, scheduledDays: formData.scheduledDays.filter(d => d !== day)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redes Sociales
              </label>
              <div className="flex flex-wrap gap-2">
                {['Instagram', 'TikTok', 'Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map((network) => (
                  <label key={network} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.socialNetworks.includes(network)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, socialNetworks: [...formData.socialNetworks, network]});
                        } else {
                          setFormData({...formData, socialNetworks: formData.socialNetworks.filter(n => n !== network)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{network}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Crear Campaña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

 // Modal de detalles de campaña
 function CampaignDetailsModal({ campaign, onClose, onSimulatePublish }: any) {
   const { generateCampaignVideo, downloadCampaignVideo, regenerateVideoDescription } = useVideoStore();
  const [selectedWeek, setSelectedWeek] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
              <p className="text-gray-600">{campaign.objective}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Navegación por semanas */}
          {campaign.contentPlan.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.contentPlan.map((week: any, index: number) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => setSelectedWeek(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedWeek === index
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semana {week.weekNumber}
                  </button>
                ))}
              </div>

              {/* Videos de la semana seleccionada */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Videos - Semana {campaign.contentPlan[selectedWeek]?.weekNumber}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.contentPlan[selectedWeek]?.videos.map((video: any) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          video.status === 'published' ? 'bg-green-100 text-green-800' :
                          video.status === 'generated' ? 'bg-blue-100 text-blue-800' :
                          video.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                          video.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {video.status === 'published' ? 'Publicado' :
                           video.status === 'generated' ? 'Generado' :
                           video.status === 'generating' ? 'Generando' :
                           video.status === 'failed' ? 'Error' :
                           'Programado'}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-600 flex-1">{video.description}</p>
                          <button
                            onClick={() => regenerateVideoDescription(campaign.id, video.id)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs"
                            title="Regenerar descripción con IA"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                        {video.description.includes('[Pendiente de generar]') && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠️ Esta descripción aún no ha sido generada por IA
                          </p>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        📅 {video.scheduledDate} a las {video.scheduledTime}
                        <br />
                        📱 {video.socialNetworks.join(', ')}
                      </div>

                      {video.status === 'published' && video.generatedTitle && (
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Título generado: {video.generatedTitle}
                          </p>
                          <p className="text-xs text-green-700">
                            {video.generatedDescription}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Publicado: {new Date(video.publishedAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                                                 {video.status === 'scheduled' && (
                           <>
                             <button
                               onClick={() => generateCampaignVideo(campaign.id, video.id)}
                               className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                             >
                               <Video className="w-4 h-4" />
                               Generar Video
                             </button>
                             <button
                               onClick={() => onSimulatePublish(video.id)}
                               className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                             >
                               <Share2 className="w-4 h-4" />
                               Simular Publicación
                             </button>
                           </>
                         )}
                         
                         {video.status === 'generating' && (
                           <div className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-3 rounded-lg text-sm font-medium text-center">
                             🔄 Generando video...
                           </div>
                         )}
                         
                         {video.status === 'generated' && (
                           <button
                             onClick={() => onSimulatePublish(video.id)}
                             className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                           >
                             <Share2 className="w-4 h-4" />
                             Simular Publicación
                           </button>
                         )}
                        
                                                 {(video.status === 'published' || video.status === 'generated') && (
                           <>
                             <button 
                               onClick={() => downloadCampaignVideo(campaign.id, video.id)}
                               className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                             >
                               <Download className="w-4 h-4" />
                               Descargar Video
                             </button>
                             {video.scenes && video.scenes.length > 0 && (
                               <button 
                                 onClick={() => {
                                   video.scenes.forEach((scene: any, index: number) => {
                                     if (scene.videoUrl) {
                                       const link = document.createElement('a');
                                       link.href = scene.videoUrl;
                                       link.download = `${video.title}_escena_${index + 1}.mp4`;
                                       document.body.appendChild(link);
                                       link.click();
                                       document.body.removeChild(link);
                                     }
                                   });
                                 }}
                                 className="bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                               >
                                 <Download className="w-4 h-4" />
                                 Escenas
                               </button>
                             )}
                           </>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}