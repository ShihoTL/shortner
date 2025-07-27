import { LinkService } from '@/lib/linkService';
import { redirect, notFound } from 'next/navigation';

interface PageProps {
  params: {
    shortCode: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = params;

  // Ignore favicon and other static file requests
  if (shortCode === 'favicon.ico' || shortCode.includes('.')) {
    notFound();
    return;
  }

  console.log('Redirect page called for shortCode:', shortCode);
  
  const originalUrl = await LinkService.getOriginalUrl(shortCode);
  
  if (originalUrl) {
    console.log('Redirecting to:', originalUrl);
    redirect(originalUrl);
  } else {
    console.log('Short code not found, redirecting to home with error');
    redirect('/?error=not-found');
  }
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: PageProps) {
  return {
    title: 'Redirecting...',
    description: 'Redirecting to the original URL',
  };
}