'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkService } from '@/lib/linkService';
import { toast } from 'react-hot-toast';
import { Copy, Check, ExternalLink } from 'lucide-react';

export default function ShortenForm() {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!LinkService.isValidUrl(originalUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    
    try {
      const result = await LinkService.shortenUrl(
        originalUrl,
        user.uid,
        user.email || '',
        customAlias || undefined
      );
      
      const shortUrl = `${window.location.origin}/${result.shortCode}`;
      setShortenedUrl(shortUrl);
      toast.success('URL shortened successfully!');
      
      // Reset form
      setOriginalUrl('');
      setCustomAlias('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortenedUrl) return;
    
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openInNewTab = () => {
    if (shortenedUrl) {
      window.open(shortenedUrl, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Shorten Your URL
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create short, memorable links that are easy to share
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="originalUrl" className="text-sm font-medium text-gray-700">
                Long URL *
              </Label>
              <Input
                id="originalUrl"
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="customAlias" className="text-sm font-medium text-gray-700">
                Custom Alias (optional)
              </Label>
              <Input
                id="customAlias"
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="my-custom-link"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || !originalUrl}
              className="w-full"
              size="lg"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
          
          {shortenedUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <Label className="text-sm font-medium text-gray-700 block mb-2">
                Your shortened URL:
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={shortenedUrl}
                  readOnly
                  className="flex-1 bg-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}