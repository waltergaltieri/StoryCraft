'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Play, Sparkles, Video, Users, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useVideoStore(state => state.login);
  const router = useRouter();

  const handleBackToLanding = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login(formData);
    router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Back to Landing Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={handleBackToLanding}
          className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </button>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">StoryCraft AI</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Crea videos de marketing
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> profesionales </span>
              con IA
            </h2>
            
            <p className="text-xl text-slate-300 mb-8">
              Transforma tus ideas en videos cinematográficos en minutos. 
              Perfecto para agencias de marketing y creadores de contenido.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-slate-300">
                <Sparkles className="w-5 h-5 text-indigo-400 mr-3" />
                <span>IA Filmmaker con 96 prompts especializados</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Play className="w-5 h-5 text-purple-400 mr-3" />
                <span>Generación automática con Veo 3</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Users className="w-5 h-5 text-pink-400 mr-3" />
                <span>Perfecto para equipos de marketing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">StoryCraft AI</h1>
            </div>

            <Card className="p-8 backdrop-blur-lg bg-white/10 border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Bienvenido</h2>
                <p className="text-slate-300">Accede a tu plataforma de creación de videos</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: María García"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: maria@empresa.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Ej: Agencia Digital Pro"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading || !formData.name || !formData.email}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Accediendo...
                    </div>
                  ) : (
                    'Acceder a StoryCraft AI'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Demo mode: Usa cualquier información para acceder
                </p>
              </div>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2024 StoryCraft AI. Plataforma de generación de videos con IA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 