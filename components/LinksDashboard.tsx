'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkService } from '@/lib/linkService';
import { ShortenedLink } from '@/types/link';
import { Copy, ExternalLink, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function LinksDashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserLinks();
    }
  }, [user]);

  const loadUserLinks = async () => {
    if (!user) return;

    try {
      const userLinks = await LinkService.getUserLinks(user.uid);
      setLinks(userLinks);
    } catch (error) {
      toast.error('Failed to load your links');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openInNewTab = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    window.open(shortUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 flex-shrink-0" />
            <span>Your Links</span>
          </CardTitle>
          <CardDescription>
            Manage and track your shortened URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {links.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No links created yet.</p>
              <p className="text-sm mt-1">Create your first shortened URL above!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {links.map((link) => (
                <div 
                  key={link.id} 
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile-first stacked layout */}
                  <div className="space-y-3">
                    {/* Top row: Short code and custom badge */}
                    <div className="flex items-center flex-wrap gap-2">
                      <code className="text-xs sm:text-sm font-mono bg-gray-100 px-2 py-1 rounded break-all">
                        /{link.shortCode}
                      </code>
                      {link.customAlias && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                          Custom
                        </span>
                      )}
                    </div>

                    {/* Original URL - with proper text breaking */}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 break-all">
                        {link.originalUrl}
                      </p>
                    </div>

                    {/* Stats and actions row - responsive layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Stats - stack on mobile, inline on desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 flex-shrink-0" />
                          <span>{link.clickCount} clicks</span>
                        </span>
                        <span className="text-xs">
                          Created {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                        </span>
                      </div>

                      {/* Action buttons - always horizontal but responsive sizing */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => copyToClipboard(link.shortCode)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">Copy</span>
                        </Button>
                        <Button
                          onClick={() => openInNewTab(link.shortCode)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">Open</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}