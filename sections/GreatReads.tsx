"use client"
import { useState, useEffect } from 'react';
import { fetchByCategory } from '@/lib/supabase';
import type { Article } from '@/types';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function GreatReads() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchByCategory('Education', 4).then(setArticles).catch(() => {});
  }, []);

  return (
    <section className="py-8 bg-gray-50 dark:bg-ai-space-light neural-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">AI Academy</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-ai-purple/20 to-transparent" />
          <Link href="/category/education" className="text-sm font-semibold text-ai-purple dark:text-ai-cyan hover:underline flex items-center gap-1 group">
            All courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Learn AI concepts from basics to advanced, explained simply.</p>

        {articles.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-ai-space rounded-xl border border-gray-200 dark:border-ai-space-medium overflow-hidden">
                <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-ai-space-medium animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`} className="group cursor-pointer bg-white dark:bg-ai-space rounded-xl border border-gray-200 dark:border-ai-space-medium overflow-hidden hover:border-ai-purple/30 dark:hover:border-ai-cyan/30 hover:shadow-ai-glow-sm transition-all">
                <div className="relative overflow-hidden">
                  <img src={article.image} alt={article.headline} className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  {(article as any).difficulty && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${difficultyColors[(article as any).difficulty] ?? ''}`}>
                        {(article as any).difficulty}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-ai-purple dark:text-ai-cyan" />
                    <span className="text-xs text-ai-purple dark:text-ai-cyan font-medium">Tutorial</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">{article.headline}</h3>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
