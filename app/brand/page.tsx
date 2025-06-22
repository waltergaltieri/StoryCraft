'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  Palette, 
  User, 
  Package, 
  MapPin, 
  Edit, 
  Copy,
  Check,
  Image,
  Globe
} from 'lucide-react';

export default function BrandPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useVideoStore();
  const [activeTab, setActiveTab] = useState<'info' | 'assets' | 'social'>('info');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [brandInfo, setBrandInfo] = useState({
    companyName: 'Mi Empresa',
    description: 'Empresa líder en innovación tecnológica',
    industry: 'Tecnología',
    targetAudience: 'Profesionales de 25-45 años',
    colorPalette: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: '#1E293B'
    }
  });

  const [brandAssets] = useState([
    {
      id: '1',
      name: 'Logo Principal',
      type: 'logo',
      tag: 'logo_principal',
      description: 'Logo principal de la empresa con fondo transparente, colores corporativos azul y blanco, diseño moderno y minimalista',
      uploadedAt: '2024-06-01'
    },
    {
      id: '2',
      name: 'CEO - Juan Pérez',
      type: 'persona',
      tag: 'ceo_empresa',
      description: 'Hombre de 45 años, traje formal azul marino, sonrisa profesional, cabello corto gris, postura ejecutiva confiada',
      uploadedAt: '2024-06-01'
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

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'logo':
        return <Image className="w-4 h-4" />;
      case 'persona':
        return <User className="w-4 h-4" />;
      case 'objeto':
        return <Package className="w-4 h-4" />;
      case 'entorno':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'logo':
        return 'from-purple-500 to-pink-500';
      case 'persona':
        return 'from-blue-500 to-cyan-500';
      case 'objeto':
        return 'from-green-500 to-emerald-500';
      case 'entorno':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Manual de Marca
              </h1>
              <p className="text-slate-400">
                Personaliza tu marca y gestiona tus assets visuales
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-slate-600 hover:border-slate-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1">
            {[
              { id: 'info', label: 'Información de Marca', icon: Palette },
              { id: 'assets', label: 'Assets Visuales', icon: Image },
              { id: 'social', label: 'Redes Sociales', icon: Globe }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Contenido de tabs */}
          {activeTab === 'info' && (
            <div className="space-y-8">
              <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-6">Información Básica</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      value={brandInfo.companyName}
                      onChange={(e) => setBrandInfo(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Ingresa el nombre de tu empresa"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Industria
                    </label>
                    <input
                      type="text"
                      value={brandInfo.industry}
                      onChange={(e) => setBrandInfo(prev => ({ ...prev, industry: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Ej: Tecnología, Marketing, Retail"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={brandInfo.description}
                      onChange={(e) => setBrandInfo(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Describe tu empresa, sus valores y lo que la hace única"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>
              </Card>

              <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-6">Paleta de Colores</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(brandInfo.colorPalette).map(([key, color]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                        {key}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-slate-600"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-slate-400 font-mono">{color}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-6">Subir Nuevos Assets</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { type: 'logo', label: 'Logo', icon: Image, color: 'from-purple-500 to-pink-500' },
                    { type: 'persona', label: 'Persona', icon: User, color: 'from-blue-500 to-cyan-500' },
                    { type: 'objeto', label: 'Objeto', icon: Package, color: 'from-green-500 to-emerald-500' },
                    { type: 'entorno', label: 'Entorno', icon: MapPin, color: 'from-amber-500 to-orange-500' }
                  ].map(({ type, label, icon: Icon, color }) => (
                    <div key={type} className={`p-6 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors bg-gradient-to-br ${color} bg-opacity-10`}>
                      <Icon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-300 text-center font-medium">{label}</p>
                      <p className="text-xs text-slate-400 text-center mt-1">Próximamente</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="solid" className="bg-slate-800/50 border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-semibold text-white">Assets Existentes</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brandAssets.map((asset) => (
                      <div key={asset.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded bg-gradient-to-r ${getTypeColor(asset.type)} flex items-center justify-center`}>
                              {getTypeIcon(asset.type)}
                            </div>
                            <span className="text-sm font-medium text-white">{asset.name}</span>
                          </div>
                        </div>

                        <div className="w-full h-32 bg-slate-600 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-slate-400 text-sm">Imagen placeholder</span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Tag:</span>
                            <Button
                              onClick={() => copyTag(asset.tag)}
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              {copiedTag === asset.tag ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <code className="text-xs bg-slate-800 px-2 py-1 rounded text-indigo-300 block">
                            {asset.tag}
                          </code>
                        </div>

                        <p className="text-xs text-slate-400">
                          {asset.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'social' && (
            <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-6">Redes Sociales</h2>
              <p className="text-slate-400 mb-6">
                Esta sección estará disponible próximamente para conectar tus redes sociales.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 