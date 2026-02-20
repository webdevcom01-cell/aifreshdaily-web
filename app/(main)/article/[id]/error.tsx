"use client"
import { useEffect } from 'react';
import Link from 'next/link';
import { FileX, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ArticleError boundary]', error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 mb-6">
        <FileX className="w-8 h-8 text-red-500" />
      </div>

      <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
        Article Failed to Load
      </h1>
      <p className="text-muted-foreground mb-2">
        There was a problem loading this article. Please try again or go back to the homepage.
      </p>
      {error.digest && (
        <p className="text-xs font-mono-ai text-muted-foreground/60 mb-8">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg ai-gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
