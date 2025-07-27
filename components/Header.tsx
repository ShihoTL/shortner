'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Link as LinkIcon } from 'lucide-react';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-gray-900" />
            <span className="text-md lg:text-xl font-semibold text-gray-900">short.com</span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <img 
                  src={user.photoURL || ''} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-xs lg:text-sm text-gray-700">{user.displayName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}