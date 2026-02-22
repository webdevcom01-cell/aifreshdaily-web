"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkX, Trash2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { fetchArticleById , articlePath } from '@/lib/supabase';
import type { Article } from '@/types';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookmarks.length === 0) { setSavedArticles([]); return; }
    setLoading(true);
    Promise.all(bookmarks.map((id) => fetchArticleById(id)))
      .then((results) => setSavedArticles(results.filter((a): a is Article => a !== null)))
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks.join(',')]);

  const totalCount = loading ? bookmarks.length : savedArticles.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-4">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">Saved Articles</h1>
              <p className="text-muted-foreground text-sm mt-1">{totalCount} {totalCount === 1 ? 'article' : 'articles'} saved</p>
            </div>
          </div>
          {totalCount > 0 && (
            <button onClick={clearBookmarks}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm">
              <Trash2 className="w-4 h-4" />Clear All
            </button>
          )}
        </div>
      </div>

      {!loading && savedArticles.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <BookmarkX className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">No saved articles</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Articles you bookmark will appear here.</p>
          <Link href="/" className="inline-flex items-center gap-2 ai-gradient-bg text-white px-6 py-3 rounded-lg hover:opacity-90">Browse Articles</Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedArticles.map((article) => (
          <div key={article.id} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg relative">
            <Link href={articlePath(article)}>
              {article.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={article.image} alt={article.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">{article.category}</span>
                <h3 className="text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{article.headline}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {article.readTime && <span>{article.readTime}</span>}
                  {article.publishedAt && <span>· {article.publishedAt}</span>}
                </div>
              </div>
            </Link>
            <button onClick={() => toggleBookmark(article.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-primary/80 text-white hover:bg-destructive transition-colors" aria-label="Remove">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        ))}
        {loading && bookmarks.map((id) => (
          <div key={`skel-${id}`} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-2"><div className="h-3 bg-muted rounded w-1/3" /><div className="h-4 bg-muted rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
