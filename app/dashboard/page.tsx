'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/lib/ThemeContext';
import { 
  Plus, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Trash2, 
  Edit,
  User,
  Calendar,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Globe,
  Activity,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    user, 
    isAuthenticated, 
    projects, 
    logout, 
    loadProject, 
    deleteProject,
    startNewProject
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

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      deleteProject(projectId);
    }
  };

  const handleEditProject = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
      loadProject(projectId);
      setTimeout(() => {
        const { setCurrentStep } = useVideoStore.getState();
        setCurrentStep('scene-editing');
      }, 100);
    }
    router.push('/create');
  };

  const handleViewProject = (projectId: string) => {
    loadProject(projectId);
    router.push('/create');
  };

  const handleCreateNewVideo = () => {
    startNewProject();
    router.push('/create');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'generating':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Edit className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'generating':
        return 'Generando';
      case 'failed':
        return 'Error';
      default:
        return 'Borrador';
    }
  };

  // Métricas calculadas
  const totalVideos = projects.reduce((sum, project) => sum + project.completedVideos, 0);
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalMinutes = projects.reduce((sum, project) => {
    return sum + (project.scenes.length * project.duration / 60);
  }, 0);
  
  // Métricas simuladas para agencias
  const activeCampaigns = 3;
  const scheduledVideos = 15;
  const publishedThisMonth = 28;
  const engagementRate = 8.5;

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ¡Bienvenido, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              Resumen de tu actividad y métricas de contenido
            </p>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="solid" className={`p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>Total Proyectos</p>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </Card>

            <Card variant="solid" className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">Videos Generados</p>
                  <p className="text-3xl font-bold text-white">{totalVideos}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card variant="solid" className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">Minutos Creados</p>
                  <p className="text-3xl font-bold text-white">{Math.round(totalMinutes)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </Card>

            <Card variant="solid" className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">Campañas Activas</p>
                  <p className="text-3xl font-bold text-white">{activeCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Métricas Secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Videos Programados</h3>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">{scheduledVideos}</p>
              <p className="text-sm text-slate-400">Para los próximos 7 días</p>
            </Card>

            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Publicados Este Mes</h3>
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">{publishedThisMonth}</p>
              <p className="text-sm text-green-400">+12% vs mes anterior</p>
            </Card>

            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Engagement Rate</h3>
                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">{engagementRate}%</p>
              <p className="text-sm text-green-400">+2.3% vs semana anterior</p>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCreateNewVideo}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Video Individual
                </Button>
                <Button
                  onClick={() => router.push('/campaigns')}
                  variant="outline"
                  className="w-full border-slate-600 hover:border-slate-500"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Nueva Campaña Masiva
                </Button>
                <Button
                  onClick={() => router.push('/calendar')}
                  variant="outline"
                  className="w-full border-slate-600 hover:border-slate-500"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Calendario
                </Button>
              </div>
            </Card>

            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm text-white">Campaña "Verano 2024" completada</p>
                    <p className="text-xs text-slate-400">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm text-white">15 videos programados para mañana</p>
                    <p className="text-xs text-slate-400">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm text-white">Manual de marca actualizado</p>
                    <p className="text-xs text-slate-400">Hace 1 día</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Proyectos Recientes */}
          {projects.length > 0 && (
            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Proyectos Recientes</h3>
                <Button
                  onClick={() => router.push('/create')}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:border-slate-500"
                >
                  Ver Todos
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleViewProject(project.id)}
                    className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <span className="text-xs text-slate-400 font-medium">
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEditProject(project.id, e)}
                          className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-semibold text-white mb-2 truncate">
                      {project.title}
                    </h4>
                    
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>Escenas:</span>
                        <span>{project.scenes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completados:</span>
                        <span>{project.completedVideos}/{project.totalScenes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duración:</span>
                        <span>{project.duration}s</span>
                      </div>
                    </div>

                    {project.completedVideos > 0 && (
                      <div className="mt-3 w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(project.completedVideos / project.totalScenes) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 