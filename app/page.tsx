'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Zap, 
  Clock, 
  Target, 
  Check, 
  Star,
  Users,
  Video,
  TrendingUp,
  Rocket,
  Shield,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">StoryCraft AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Características</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Precios</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonios</a>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Comenzar Prueba
              </button>
            </div>
            <div className="md:hidden">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                Probar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Crea Videos de
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Marketing </span>
              con IA
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
              La plataforma definitiva para agencias de marketing que necesitan crear videos profesionales 
              en minutos, no días. Potenciado por IA de última generación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Prueba Gratuita 14 Días
              </button>
              <button className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200">
                Ver Demo en Vivo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4 px-4 sm:px-0">
              Sin tarjeta de crédito requerida • Acceso inmediato • Cancela cuando quieras
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-slate-400 text-sm sm:text-base">Tiempo Ahorrado</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-400 text-sm sm:text-base">Agencias Activas</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-slate-400 text-sm sm:text-base">Videos Creados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-slate-400 text-sm sm:text-base">Satisfacción Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
              Todo lo que necesitas para videos de marketing
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
              Desde la conceptualización hasta la entrega final, StoryCraft AI automatiza 
              todo el proceso de creación de video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-slate-600 transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-slate-300 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
              Planes diseñados para agencias
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
              Desde equipos pequeños hasta agencias enterprise. Elige el plan que mejor se adapte a tu volumen de trabajo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-slate-800 border rounded-xl p-6 sm:p-8 transition-all duration-200 ${
                  plan.featured 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 md:scale-105' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    ${plan.price}
                    <span className="text-base sm:text-lg text-slate-400">/mes</span>
                  </div>
                  <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">{plan.description}</p>
                  <button 
                    onClick={handleGetStarted}
                    className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      plan.featured
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
                <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-slate-300 text-sm sm:text-base">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu creación de videos?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Únete a más de 500 agencias que ya están creando videos increíbles con StoryCraft AI
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Comenzar Prueba Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">StoryCraft AI</span>
              </div>
              <p className="text-slate-400">
                La plataforma de IA más avanzada para crear videos de marketing profesionales.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 StoryCraft AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: 'AI Filmmaker Avanzado',
    description: 'Nuestra IA entiende tus objetivos de marketing y crea guiones cinematográficos profesionales automáticamente.'
  },
  {
    icon: Zap,
    title: 'Prompt Engineering Inteligente',
    description: 'Optimización avanzada de prompts que garantiza videos perfectos para tu estilo y objetivo específico.'
  },
  {
    icon: Clock,
    title: 'Generación Ultra Rápida',
    description: 'Crea videos profesionales en minutos, no días. Perfecto para deadlines ajustados y campañas urgentes.'
  },
  {
    icon: Target,
    title: 'Enfocado en Marketing',
    description: 'Construido específicamente para equipos de marketing con plantillas y estilos que realmente convierten.'
  },
  {
    icon: Video,
    title: 'Calidad 4K HD',
    description: 'Genera videos en alta definición listos para cualquier plataforma o campaña de marketing.'
  },
  {
    icon: Users,
    title: 'Colaboración en Equipo',
    description: 'Flujo de trabajo simple: describe, revisa, genera. Sin habilidades técnicas requeridas.'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfecto para equipos pequeños',
    buttonText: 'Comenzar Prueba',
    featured: false,
    features: [
      '20 videos por mes',
      'HD 1080p calidad',
      'Plantillas básicas',
      'Soporte por email',
      'Exportación estándar',
      'Colaboración hasta 3 usuarios'
    ]
  },
  {
    name: 'Professional',
    price: 149,
    description: 'Para agencias en crecimiento',
    buttonText: 'Comenzar Prueba',
    featured: true,
    features: [
      '100 videos por mes',
      '4K Ultra HD calidad',
      'Todas las plantillas premium',
      'Soporte prioritario 24/7',
      'Exportación sin marca de agua',
      'Colaboración hasta 10 usuarios',
      'Integraciones API',
      'Analytics avanzados'
    ]
  },
  {
    name: 'Enterprise',
    price: 399,
    description: 'Para agencias enterprise',
    buttonText: 'Contactar Ventas',
    featured: false,
    features: [
      'Videos ilimitados',
      '8K calidad disponible',
      'Plantillas personalizadas',
      'Account manager dedicado',
      'Marca blanca completa',
      'Usuarios ilimitados',
      'Integraciones personalizadas',
      'SLA garantizado 99.9%',
      'Entrenamiento del equipo'
    ]
  }
];

const testimonials = [
  {
    name: 'María González',
    role: 'Directora Creativa, Digital Agency Pro',
    quote: 'StoryCraft AI ha revolucionado nuestro proceso. Lo que antes nos tomaba semanas, ahora lo hacemos en horas. Increíble calidad y velocidad.'
  },
  {
    name: 'Carlos Mendoza',
    role: 'CEO, Marketing Solutions',
    quote: 'La mejor inversión que hemos hecho. Nuestros clientes están impresionados con la calidad de los videos. ROI increíble.'
  },
  {
    name: 'Ana Rodríguez',
    role: 'Head of Marketing, TechStart',
    quote: 'Fácil de usar, resultados profesionales. Nuestro equipo adoptó la plataforma en días. Simplemente funciona.'
  }
]; 