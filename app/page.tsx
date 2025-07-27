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
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <Header />
        </div>

        {/* Main Content with top padding to account for fixed header */}
        <main className="pt-16 sm:pt-20 lg:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <ShortenForm />
              <LinksDashboard />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}