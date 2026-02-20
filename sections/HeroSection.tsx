"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHeroArticles } from '@/lib/supabase';
import { Zap } from 'lucide-react';
import type { Article } from '@/types';

export default function HeroSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroArticles(3)
      .then((data) => {
        setArticles(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-6 bg-white dark:bg-ai-space neural-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 -mx-4 sm:mx-0">
              <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-ai-space-medium rounded-xl animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-5">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 pb-5 border-b border-gray-200 dark:border-ai-space-medium last:border-0">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                  </div>
                  <div className="flex-shrink-0 w-24 sm:w-32 aspect-[4/3] bg-gray-200 dark:bg-ai-space-medium rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  if (!mainArticle) return null;

  return (
    <section className="py-6 bg-white dark:bg-ai-space neural-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Featured Article */}
          <div className="lg:col-span-7 -mx-4 sm:mx-0">
            <Link href={`/article/${mainArticle.id}`} className="group block cursor-pointer">
              <div className="relative overflow-hidden sm:rounded-xl">
                <img
                  src={mainArticle.image}
                  alt={mainArticle.headline}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 ai-gradient-bg text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    <Zap className="w-3 h-3" />
                    {mainArticle.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white leading-tight font-heading drop-shadow-lg">
                    {mainArticle.headline}
                  </h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm text-white/70">{mainArticle.author}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-sm text-white/70 font-mono-ai">{mainArticle.readTime}</span>
                    {mainArticle.publishedAt && (
                      <>
                        <span className="text-white/40">·</span>
                        <span className="text-sm text-white/50 font-mono-ai">{mainArticle.publishedAt}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="lg:col-span-5 space-y-5">
            {sideArticles.map((article, index) => (
              <Link
                href={`/article/${article.id}`}
                key={article.id}
                className={`group block cursor-pointer ${
                  index !== sideArticles.length - 1
                    ? 'pb-5 border-b border-gray-200 dark:border-ai-space-medium'
                    : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    {article.isExclusive && (
                      <span className="inline-block px-2.5 py-0.5 ai-gradient-bg text-white text-xs font-bold uppercase tracking-wide mb-2 rounded">
                        Exclusive
                      </span>
                    )}
                    {article.isBreaking && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold uppercase tracking-wide mb-2 rounded animate-pulse-glow">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Breaking
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading">
                      {article.headline}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-ai-purple dark:text-ai-cyan font-medium">{article.category}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</span>
                    </div>
                  </div>
                  {article.image && (
                    <div className="flex-shrink-0 w-24 sm:w-32">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={article.image}
                          alt={article.headline}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
