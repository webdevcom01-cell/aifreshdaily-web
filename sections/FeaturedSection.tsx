"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFeatured , articlePath } from '@/lib/supabase';
import type { Article } from '@/types';
import { Star } from 'lucide-react';

export default function FeaturedSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchFeatured(6).then(setArticles).catch(() => {});
  }, []);

  if (articles.length === 0) {
    return (
      <section className="py-8 bg-white dark:bg-ai-space">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Editor's Picks</h2>
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
              </div>
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-ai-space-medium rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white dark:bg-ai-space">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Editor's Picks</h2>
      </div>
      <div className="space-y-5">
        {articles.map((article) => (
          <Link href={articlePath(article)} key={article.id} className="group block cursor-pointer flex gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-xs text-ai-purple dark:text-ai-cyan font-medium uppercase tracking-wider">{article.category}</span>
              <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">
                {article.headline}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</p>
            </div>
            {article.image && (
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
