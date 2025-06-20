import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StoryCraft AI - AI-Powered Video Generation Platform',
  description: 'Create stunning marketing videos with AI. Transform your ideas into professional videos in minutes.',
  keywords: ['AI video generation', 'marketing videos', 'video creation', 'artificial intelligence'],
  authors: [{ name: 'StoryCraft AI Team' }],
  openGraph: {
    title: 'StoryCraft AI - AI-Powered Video Generation',
    description: 'Create stunning marketing videos with AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoryCraft AI',
    description: 'Create stunning marketing videos with AI',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
} 