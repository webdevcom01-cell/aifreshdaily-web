"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBreaking , articlePath } from '@/lib/supabase';
import type { Article } from '@/types';
import { X, Zap } from 'lucide-react';

export default function BreakingNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchBreaking(5).then(setArticles).catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused || articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  if (!isVisible || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div
      className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 dark:from-red-700 dark:via-red-600 dark:to-orange-600 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider font-heading">BREAKING</span>
          </div>
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-dot" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <Link href={articlePath(currentArticle)} className="block group">
              <p className="text-sm font-medium truncate group-hover:underline">
                {currentArticle.headline}
              </p>
            </Link>
          </div>
          <span className="flex-shrink-0 text-xs text-white/70 hidden sm:block font-mono-ai">
            {currentArticle.publishedAt ?? 'Just now'}
          </span>
          <div className="flex-shrink-0 flex items-center gap-1">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                }`}
                aria-label={`Go to news item ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close breaking news"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
