'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import ShortenForm from '@/components/ShortenForm';
import LinksDashboard from '@/components/LinksDashboard';

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'not-found') {
      toast.error('Short link not found');
    } else if (error === 'server-error') {
      toast.error('Server error occurred');
    }
  }, [searchParams]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <ShortenForm />
            <LinksDashboard />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}