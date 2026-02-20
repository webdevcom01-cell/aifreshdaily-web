"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchArticles } from '@/lib/supabase';
import type { Article } from '@/types';
import { BarChart3 } from 'lucide-react';

export default function MostPopular() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles(5).then(setArticles).catch(() => {});
  }, []);

  if (articles.length === 0) {
    return (
      <section className="py-8 bg-white dark:bg-ai-space">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Most Read</h2>
        </div>
        <div className="space-y-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4 py-4 border-b border-gray-200 dark:border-ai-space-medium last:border-0">
              <div className="w-8 h-6 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white dark:bg-ai-space">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Most Read</h2>
      </div>
      <div className="space-y-0">
        {articles.map((article, index) => (
          <Link href={`/article/${article.id}`} key={article.id} className="group block cursor-pointer py-4 border-b border-gray-200 dark:border-ai-space-medium last:border-0">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-gray-200 dark:text-ai-space-medium font-heading group-hover:ai-gradient-text transition-colors w-8 flex-shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-ai-purple dark:text-ai-cyan font-medium uppercase tracking-wider">{article.category}</span>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">
                  {article.headline}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
