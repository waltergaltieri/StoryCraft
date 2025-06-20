'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  Plus, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Trash2, 
  Edit,
  LogOut,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
    
    // Para editar SIEMPRE ir a las escenas separadas
    const project = projects.find(p => p.id === projectId);
    if (project) {
      loadProject(projectId);
      // Forzar ir a scene-editing para editar escenas individuales
      setTimeout(() => {
        const { setCurrentStep } = useVideoStore.getState();
        setCurrentStep('scene-editing');
      }, 100);
    }
    router.push('/create');
  };

  const handleViewProject = (projectId: string) => {
    // Para ver el proyecto, usar la lógica inteligente del loadProject
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

  const totalVideos = projects.reduce((sum, project) => sum + project.completedVideos, 0);
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">StoryCraft AI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-300">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.name}</span>
                {user.company && (
                  <span className="text-xs text-slate-400 ml-2">• {user.company}</span>
                )}
              </div>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-400">
            Gestiona tus proyectos de video y crea contenido increíble con IA
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="solid" className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 hover:from-indigo-500/15 hover:to-purple-500/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Total Proyectos</p>
                <p className="text-3xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card variant="solid" className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:from-green-500/15 hover:to-emerald-500/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Videos Generados</p>
                <p className="text-3xl font-bold text-white">{totalVideos}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <Play className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="solid" className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:from-amber-500/15 hover:to-orange-500/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Completados</p>
                <p className="text-3xl font-bold text-white">{completedProjects}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Create New Video Button */}
        <div className="mb-8">
          <Button 
            onClick={handleCreateNewVideo}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nuevo Video
          </Button>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Tus Proyectos</h3>
            {projects.length > 0 && (
              <p className="text-sm text-slate-400">
                {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {projects.length === 0 ? (
            <Card variant="solid" className="p-12 text-center border-dashed border-slate-600 bg-slate-800/50">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                No tienes proyectos aún
              </h4>
              <p className="text-slate-400 mb-6">
                Crea tu primer video con IA y transforma tus ideas en contenido profesional
              </p>
              <Button 
                onClick={handleCreateNewVideo}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Video
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => handleViewProject(project.id)}
                  className="cursor-pointer"
                >
                  <Card 
                    variant="solid" 
                    className="p-6 bg-slate-800/80 border-slate-600/50 hover:bg-slate-700/80 transition-colors group"
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-2 text-sm text-slate-200 font-medium">
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditProject(project.id, e)}
                        className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white"
                        title="Editar proyecto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-white mb-2 line-clamp-2 text-lg">
                    {project.title}
                  </h4>
                  
                  <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Videos:</span>
                      <span className="text-white font-medium">
                        {project.completedVideos}/{project.totalScenes}
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-600/50 rounded-full h-2 border border-slate-500/30">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: project.totalScenes > 0 
                            ? `${(project.completedVideos / project.totalScenes) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-slate-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(project.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs border border-indigo-500/30">
                        {project.style}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                        {project.duration}s
                      </span>
                    </div>
                  </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 