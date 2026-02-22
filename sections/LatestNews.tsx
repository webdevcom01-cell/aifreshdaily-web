"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchArticles , articlePath } from '@/lib/supabase';
import { Clock } from 'lucide-react';
import type { Article } from '@/types';

export default function LatestNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles(6)
      .then((data) => {
        if (data.length > 0) setArticles(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-8 bg-white dark:bg-ai-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Latest AI News</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-ai-purple/20 to-transparent" />
        </div>

        {/* Skeleton while loading */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="group">
              {/* Clickable area: image + headline + meta */}
              <Link href={articlePath(article)} className="block cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-ai-space/80 backdrop-blur-sm text-ai-cyan text-xs font-bold uppercase tracking-wider rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">
                    {article.headline}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</span>
                      {article.publishedAt && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono-ai">{article.publishedAt}</span>
                        </>
                      )}
                    </div>
                    {article.source && (
                      <div className="flex items-center gap-1">
                        {article.source.favicon && (
                          <img src={article.source.favicon} alt={article.source.name} className="w-3.5 h-3.5 rounded-sm" />
                        )}
                        <span className="text-xs text-gray-400 dark:text-gray-500">{article.source.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              {/* Tags outside the article Link — valid HTML, link to /tag/[slug] */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded hover:bg-ai-purple/10 hover:text-ai-purple dark:hover:text-ai-cyan transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
