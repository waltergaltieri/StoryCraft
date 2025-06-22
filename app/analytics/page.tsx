'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/ui/Card';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useVideoStore();

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

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Analíticas
            </h1>
            <p className="text-slate-400">
              Reportes detallados de rendimiento
            </p>
          </div>

          <Card variant="solid" className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Próximamente
            </h2>
            <p className="text-slate-400">
              Esta sección incluirá reportes detallados de engagement, alcance y métricas de rendimiento.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
} 