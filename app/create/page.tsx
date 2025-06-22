'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import VideoCreator from '@/components/VideoCreator';
import Sidebar from '@/components/Sidebar';

export default function CreateVideoPage() {
  const router = useRouter();
  const { isAuthenticated } = useVideoStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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
        <VideoCreator />
      </div>
    </div>
  );
} 