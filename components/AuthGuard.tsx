'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Welcome to short.com
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to start shortening your URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              size="lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}