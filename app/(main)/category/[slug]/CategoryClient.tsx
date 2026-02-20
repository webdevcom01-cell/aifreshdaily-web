"use client"
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter, TrendingUp, Clock, Flame } from 'lucide-react';
import { fetchByCategory } from '@/lib/supabase';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Article } from '@/types';

const categoryMeta: Record<string, { label: string; description: string; icon: string }> = {
  models:   { label: 'Models & LLMs', description: 'The latest large language models, architectures, and benchmark results from OpenAI, Anthropic, Google, and more.', icon: '🧠' },
  agents:   { label: 'AI Agents',     description: 'Multi-agent systems, autonomous workflows, and the rise of agentic AI across enterprise and consumer platforms.', icon: '🤖' },
  tools:    { label: 'Tools',         description: 'AI apps, APIs, SDKs, developer tools, and AI-powered products shaping how we build and work.', icon: '🛠️' },
  research: { label: 'Research',      description: 'Academic papers, lab breakthroughs, and scientific studies pushing the frontier of AI.', icon: '🔬' },
  business: { label: 'Business',      description: 'Funding rounds, acquisitions, partnerships, and the market forces driving the AI economy.', icon: '💼' },
  policy:   { label: 'Policy',        description: 'Global AI regulation, governance, ethics, safety policy, and the evolving legal landscape.', icon: '⚖️' },
  hardware: { label: 'Hardware',      description: 'Chips, GPUs, data centers, edge AI, and the compute infrastructure powering the AI revolution.', icon: '⚙️' },
  learn:    { label: 'Learn',         description: 'Tutorials, explainers, courses, and how-to guides — AI knowledge for every level.', icon: '📚' },
};

function matchesCategory(article: Article, slug: string): boolean {
  const cat = article.category.toLowerCase();
  return cat === slug || cat.includes(slug);
}

type SortType = 'latest' | 'trending' | 'popular';

export default function CategoryClient({ slug }: { slug: string }) {
  const [sort, setSort] = useState<SortType>('latest');
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [sourceArticles, setSourceArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchByCategory(slug, 40).then(setSourceArticles).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const meta = categoryMeta[slug];
  const label = meta?.label || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // DB already filtered by category — no client-side re-filter needed
  const articles = useMemo(() => sourceArticles, [sourceArticles]);

  const sortedArticles = useMemo(() => {
    const arr = [...articles];
    if (sort === 'trending') return arr.reverse();
    if (sort === 'popular') return arr.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
    return arr;
  }, [articles, sort]);

  const featured = sortedArticles[0];
  const rest = sortedArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-4">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-start gap-4 mt-4">
          {meta && <span className="text-4xl">{meta.icon}</span>}
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">{label}</h1>
            {meta && <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">{meta.description}</p>}
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-border">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
        {([
          { key: 'latest' as SortType, label: 'Latest', icon: Clock },
          { key: 'trending' as SortType, label: 'Trending', icon: TrendingUp },
          { key: 'popular' as SortType, label: 'Most Read', icon: Flame },
        ]).map(({ key, label: sortLabel, icon: Icon }) => (
          <button key={key} onClick={() => setSort(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              sort === key ? 'ai-gradient-bg text-white ai-glow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}>
            <Icon className="w-3.5 h-3.5" />{sortLabel}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((n) => (
            <div key={n} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2"><div className="h-3 w-20 bg-muted rounded" /><div className="h-4 bg-muted rounded" /></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && sortedArticles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">No articles found</h2>
          <p className="text-muted-foreground">There are no articles in this category yet.</p>
        </div>
      )}

      {/* Featured */}
      {featured && (
        <Link href={`/article/${featured.id}`}
          className="group block mb-8 rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {featured.image && (
              <div className="aspect-video lg:aspect-auto overflow-hidden">
                <img src={featured.image} alt={featured.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3">{featured.category}</span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors mb-3">{featured.headline}</h2>
              {featured.tags && featured.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {featured.tags.slice(0, 4).map((tag) => (
                    <span key={tag} onClick={(e) => e.stopPropagation()}>
                      <Link href={`/tag/${tag}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                        #{tag}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {featured.author && <span>{featured.author}</span>}
                {featured.readTime && <span>· {featured.readTime}</span>}
                {featured.publishedAt && <span>· {featured.publishedAt}</span>}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}
            className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg">
            {article.image && (
              <div className="aspect-video overflow-hidden relative">
                <img src={article.image} alt={article.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(article.id); }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                    isBookmarked(article.id) ? 'bg-primary/80 text-white opacity-100' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                  }`}>
                  <svg className="w-4 h-4" fill={isBookmarked(article.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">{article.category}</span>
              <h3 className="text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{article.headline}</h3>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} onClick={(e) => e.stopPropagation()}>
                      <Link href={`/tag/${tag}`}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                        #{tag}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {article.readTime && <span>{article.readTime}</span>}
                {article.publishedAt && <span>· {article.publishedAt}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
