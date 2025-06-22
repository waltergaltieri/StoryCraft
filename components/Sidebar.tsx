import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Video, 
  Calendar, 
  Settings, 
  Palette, 
  Megaphone,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import useVideoStore from '@/stores/videoStore';
import { useTheme } from '@/lib/ThemeContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useVideoStore();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: Home,
      href: '/dashboard',
      description: 'Métricas y resumen'
    },
    {
      id: 'create',
      label: 'Crear Video',
      icon: Video,
      href: '/create',
      description: 'Generación individual'
    },
    {
      id: 'campaigns',
      label: 'Campañas',
      icon: Megaphone,
      href: '/campaigns',
      description: 'Generación masiva'
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: Calendar,
      href: '/calendar',
      description: 'Programación de contenido'
    },
    {
      id: 'brand',
      label: 'Manual de Marca',
      icon: Palette,
      href: '/brand',
      description: 'Personalización y assets'
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: BarChart3,
      href: '/analytics',
      description: 'Reportes detallados'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      href: '/settings',
      description: 'Ajustes generales'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-gray-200'
    } border-r transition-all duration-300 flex flex-col h-screen ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>StoryCraft</h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>Marketing AI</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                active 
                  ? 'text-white' 
                  : theme === 'dark'
                    ? 'text-slate-400 group-hover:text-white'
                    : 'text-gray-600 group-hover:text-gray-900'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${
                    active 
                      ? 'text-white' 
                      : theme === 'dark'
                        ? 'text-slate-300'
                        : 'text-gray-700'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${
                    active 
                      ? 'text-indigo-200' 
                      : theme === 'dark'
                        ? 'text-slate-500'
                        : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            isCollapsed 
              ? 'justify-center' 
              : 'justify-start'
          } ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          {!isCollapsed && (
            <span className="text-sm">
              Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </span>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      }`}>
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || 'Usuario'}
                </div>
                <div className={`text-xs truncate ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {user?.email || 'usuario@ejemplo.com'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
              <User className="w-4 h-4 text-white" />
            </div>
            <button
              onClick={logout}
              className={`w-full p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 mx-auto" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 