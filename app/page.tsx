'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useVideoStore from '@/stores/videoStore';
import { ArrowRight, Play, Sparkles, Zap, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useVideoStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: 'AI Filmmaker',
    description: 'Our AI understands your objectives and creates compelling scene breakdowns automatically.'
  },
  {
    icon: Zap,
    title: 'Smart Prompting',
    description: 'Advanced prompt engineering ensures optimal video generation for your specific style.'
  },
  {
    icon: Clock,
    title: 'Fast Generation',
    description: 'Create professional videos in minutes, not hours. Perfect for tight deadlines.'
  },
  {
    icon: Target,
    title: 'Marketing Focused',
    description: 'Built specifically for marketing teams with templates and styles that convert.'
  },
  {
    icon: Play,
    title: 'HD Quality',
    description: 'Generate high-definition videos ready for any platform or marketing campaign.'
  },
  {
    icon: ArrowRight,
    title: 'Easy Workflow',
    description: 'Simple 3-step process: describe, review, generate. No technical skills required.'
  }
]; 