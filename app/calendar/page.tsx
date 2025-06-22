'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Play, 
  Calendar as CalendarIcon,
  Clock,
  Target,
  Globe,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface ScheduledVideo {
  id: string;
  title: string;
  campaignName: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  socialNetworks: string[];
  status: 'scheduled' | 'generated' | 'published' | 'failed';
  videoUrl?: string;
  thumbnail?: string;
  duration: number;
  objective: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useVideoStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Datos simulados de videos programados
  const [scheduledVideos] = useState<ScheduledVideo[]>([
    {
      id: '1',
      title: 'Promoción Productos Verano - Trajes de Baño',
      campaignName: 'Campaña Verano 2024',
      description: 'Video promocional destacando la nueva colección de trajes de baño con modelos en la playa',
      scheduledDate: '2024-06-21',
      scheduledTime: '09:00',
      socialNetworks: ['Instagram', 'TikTok'],
      status: 'generated',
      videoUrl: '/videos/sample1.mp4',
      duration: 15,
      objective: 'Promocionar productos de verano'
    },
    {
      id: '2',
      title: 'Tips de Moda Verano - Combinaciones',
      campaignName: 'Campaña Verano 2024',
      description: 'Consejos sobre cómo combinar ropa de verano para diferentes ocasiones',
      scheduledDate: '2024-06-21',
      scheduledTime: '15:00',
      socialNetworks: ['Instagram', 'YouTube'],
      status: 'scheduled',
      duration: 15,
      objective: 'Educar sobre tendencias'
    },
    {
      id: '3',
      title: 'Descuentos Flash - 50% Off',
      campaignName: 'Black Friday 2024',
      description: 'Promoción urgente de descuentos por tiempo limitado',
      scheduledDate: '2024-06-22',
      scheduledTime: '12:00',
      socialNetworks: ['Instagram', 'Facebook', 'TikTok'],
      status: 'scheduled',
      duration: 10,
      objective: 'Maximizar ventas'
    },
    {
      id: '4',
      title: 'Tutorial Cuidado de Ropa',
      campaignName: 'Contenido Educativo Q1',
      description: 'Guía sobre cómo cuidar y mantener la ropa en buen estado',
      scheduledDate: '2024-06-23',
      scheduledTime: '10:00',
      socialNetworks: ['LinkedIn', 'YouTube'],
      status: 'published',
      videoUrl: '/videos/sample2.mp4',
      duration: 30,
      objective: 'Educar a la audiencia'
    },
    {
      id: '5',
      title: 'Nuevas Tendencias Otoño',
      campaignName: 'Campaña Verano 2024',
      description: 'Adelanto de las tendencias que vienen para la temporada de otoño',
      scheduledDate: '2024-06-24',
      scheduledTime: '09:00',
      socialNetworks: ['Instagram'],
      status: 'failed',
      duration: 15,
      objective: 'Anticipar próxima temporada'
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const getVideosForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledVideos.filter(video => video.scheduledDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'generated':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'published':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado';
      case 'generated':
        return 'Generado';
      case 'published':
        return 'Publicado';
      case 'failed':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 lg:h-32"></div>);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const videosForDay = getVideosForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 lg:h-32 p-2 border border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors ${
            isToday ? 'bg-indigo-500/10 border-indigo-500/50' : ''
          } ${isSelected ? 'bg-indigo-500/20 border-indigo-500' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm ${isToday ? 'text-indigo-300 font-bold' : 'text-slate-300'}`}>
              {day}
            </span>
            {videosForDay.length > 0 && (
              <span className="text-xs bg-indigo-500/30 text-indigo-300 px-1 rounded">
                {videosForDay.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {videosForDay.slice(0, 2).map((video) => (
              <div
                key={video.id}
                className="text-xs p-1 rounded bg-slate-700/50 text-slate-300 truncate"
                title={video.title}
              >
                {video.scheduledTime} - {video.title}
              </div>
            ))}
            {videosForDay.length > 2 && (
              <div className="text-xs text-slate-400">
                +{videosForDay.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const selectedDateVideos = selectedDate ? getVideosForDate(selectedDate) : [];
  const totalScheduled = scheduledVideos.filter(v => v.status === 'scheduled').length;
  const totalGenerated = scheduledVideos.filter(v => v.status === 'generated').length;
  const totalPublished = scheduledVideos.filter(v => v.status === 'published').length;
  const totalFailed = scheduledVideos.filter(v => v.status === 'failed').length;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Calendario de Contenido
              </h1>
              <p className="text-slate-400">
                Visualiza y gestiona tu contenido programado
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
                variant="outline"
                className="border-slate-600 hover:border-slate-500"
              >
                {viewMode === 'month' ? 'Vista Semanal' : 'Vista Mensual'}
              </Button>
              <Button
                onClick={() => router.push('/campaigns/create')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Campaña
              </Button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card variant="solid" className="p-4 bg-blue-500/10 border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Programados</p>
                  <p className="text-2xl font-bold text-white">{totalScheduled}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card variant="solid" className="p-4 bg-green-500/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Generados</p>
                  <p className="text-2xl font-bold text-white">{totalGenerated}</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card variant="solid" className="p-4 bg-purple-500/10 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Publicados</p>
                  <p className="text-2xl font-bold text-white">{totalPublished}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
            </Card>

            <Card variant="solid" className="p-4 bg-red-500/10 border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Errores</p>
                  <p className="text-2xl font-bold text-white">{totalFailed}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendario */}
            <div className="lg:col-span-2">
              <Card variant="solid" className="bg-slate-800/50 border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white capitalize">
                      {getMonthName(currentDate)}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => navigateMonth('prev')}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 hover:border-slate-500"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => navigateMonth('next')}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 hover:border-slate-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-0 mb-4">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Grid del calendario */}
                  <div className="grid grid-cols-7 gap-0">
                    {renderCalendarGrid()}
                  </div>
                </div>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Videos del día seleccionado */}
              {selectedDate && (
                <Card variant="solid" className="bg-slate-800/50 border-slate-700">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedDate.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  
                  <div className="p-4">
                    {selectedDateVideos.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        No hay videos programados para este día
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateVideos.map((video) => (
                          <div key={video.id} className="p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                {video.scheduledTime}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(video.status)}`}>
                                {getStatusText(video.status)}
                              </span>
                            </div>
                            
                            <h4 className="font-medium text-white mb-1 text-sm">
                              {video.title}
                            </h4>
                            
                            <p className="text-xs text-slate-400 mb-2">
                              {video.campaignName}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-1">
                                {video.socialNetworks.map((network) => (
                                  <span key={network} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                                    {network}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {video.videoUrl && (
                                  <Button size="sm" variant="outline" className="border-slate-600 hover:border-slate-500">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" className="border-slate-600 hover:border-slate-500">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Próximos videos */}
              <Card variant="solid" className="bg-slate-800/50 border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">Próximos Videos</h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {scheduledVideos
                      .filter(video => new Date(video.scheduledDate + 'T' + video.scheduledTime) > new Date())
                      .sort((a, b) => new Date(a.scheduledDate + 'T' + a.scheduledTime).getTime() - new Date(b.scheduledDate + 'T' + b.scheduledTime).getTime())
                      .slice(0, 5)
                      .map((video) => (
                        <div key={video.id} className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {video.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(video.scheduledDate).toLocaleDateString('es-ES')} a las {video.scheduledTime}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(video.status)}`}>
                            {getStatusText(video.status)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 