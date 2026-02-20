"use client"
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Layers, ExternalLink, Loader2, ChevronDown } from 'lucide-react';
import { fetchArticlesPaged } from '@/lib/supabase';
import type { Article } from '@/types';

const categoryTabs = [
  { label: 'All',      slug: 'all' },
  { label: 'Models',   slug: 'models' },
  { label: 'Agents',   slug: 'agents' },
  { label: 'Tools',    slug: 'tools' },
  { label: 'Research', slug: 'research' },
  { label: 'Business', slug: 'business' },
  { label: 'Policy',   slug: 'policy' },
  { label: 'Hardware', slug: 'hardware' },
];

const PAGE_SIZE = 12;

export default function IndustryDeepDive() {
  const [activeTab, setActiveTab]       = useState('all');
  const [articles, setArticles]         = useState<Article[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore]           = useState(true);

  // Fetch first page whenever tab changes
  useEffect(() => {
    setIsLoading(true);
    setArticles([]);
    setHasMore(true);
    fetchArticlesPaged(activeTab, 0, PAGE_SIZE - 1)
      .then((data) => {
        setArticles(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const from = articles.length;
      const to   = from + PAGE_SIZE - 1;
      const data = await fetchArticlesPaged(activeTab, from, to);
      setArticles((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      // silent fail
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeTab, articles.length, hasMore, isLoadingMore]);

  const featured     = articles[0];
  const sideArticles = articles.slice(1, 3);
  const gridArticles = articles.slice(3);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 ai-gradient-bg rounded-lg">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Browse by Category</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categoryTabs.map((tab) => (
          <button key={tab.slug} onClick={() => setActiveTab(tab.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.slug
                ? 'ai-gradient-bg text-white ai-glow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 aspect-[16/9] bg-gray-200 dark:bg-ai-space-medium rounded-xl animate-pulse" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                <div className="aspect-[2/1] bg-gray-200 dark:bg-ai-space-medium animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-ai-space-medium rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured layout */}
      {!isLoading && featured && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured — large card */}
          <Link href={`/article/${featured.id}`} className="lg:col-span-2 group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={featured.image} alt={featured.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2 py-0.5 ai-gradient-bg text-white text-[10px] font-mono-ai rounded font-bold uppercase mb-2 inline-block">
                    {featured.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-white leading-tight">{featured.headline}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
                    <span>{featured.author}</span><span>·</span><span>{featured.readTime}</span>
                    {featured.publishedAt && (<><span>·</span><span>{featured.publishedAt}</span></>)}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}
                className="block group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img src={article.image} alt={article.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 text-white text-[10px] font-mono-ai rounded font-bold uppercase backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors">
                    {article.headline}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 dark:text-gray-500">
                    <span>{article.readTime}</span><ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
            {sideArticles.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No articles in this category yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Additional articles grid (articles[3+]) */}
      {!isLoading && gridArticles.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}
              className="group block bg-white dark:bg-white/[0.02] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-ai-purple/30 dark:hover:border-ai-cyan/30 transition-all hover:shadow-lg">
              {article.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={article.image} alt={article.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ai-purple dark:text-ai-cyan mb-1 block">
                  {article.category}
                </span>
                <h4 className="text-sm font-heading font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors">
                  {article.headline}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                  <span>{article.readTime}</span>
                  {article.publishedAt && <><span>·</span><span>{article.publishedAt}</span></>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !featured && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">No articles found for this category.</div>
      )}

      {/* Load More button */}
      {!isLoading && hasMore && (
        <div className="mt-8 flex justify-center">
          <button onClick={loadMore} disabled={isLoadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-ai-purple/40 dark:hover:border-ai-cyan/40 hover:text-ai-purple dark:hover:text-ai-cyan transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoadingMore ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Loading...</>
            ) : (
              <><ChevronDown className="w-4 h-4" />Load More Articles</>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
