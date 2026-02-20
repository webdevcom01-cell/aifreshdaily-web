"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { fetchArticles } from '@/lib/supabase';
import type { Article } from '@/types';

// Module-level cache: fetch once per session, reuse across overlay opens
let articleCache: Article[] | null = null;
let fetchPromise: Promise<Article[]> | null = null;

function primeCache(): Promise<Article[]> {
    if (articleCache !== null) return Promise.resolve(articleCache);
    if (fetchPromise) return fetchPromise;
    fetchPromise = fetchArticles(100)
        .then((data) => {
            articleCache = data;
            fetchPromise = null;
            return data;
        })
        .catch(() => {
            fetchPromise = null;
            return [];
        });
    return fetchPromise;
}

// Inline trending topics — no longer imported from articles.ts
const TRENDING_TOPICS = [
    { label: 'GPT-5.3-Codex',    count: '12.4K', trending: true  },
    { label: '1M Token Race',    count: '8.7K',  trending: true  },
    { label: 'Agent Swarm',      count: '6.2K',  trending: true  },
    { label: 'DeepSeek V4',      count: '5.9K',  trending: true  },
    { label: 'GPT-4o Retirement', count: '4.8K', trending: false },
    { label: 'EU AI Act',        count: '3.5K',  trending: false },
    { label: 'Gemini 3.0 GA',    count: '3.2K',  trending: true  },
    { label: 'Grok 5 Beta',      count: '2.8K',  trending: true  },
];

const RECENT_SEARCHES_KEY = 'ai-freshdaily-recent-searches';

function getRecentSearches(): string[] {
    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(query: string) {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((s) => s !== query)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function fuzzyMatch(text: string, query: string): boolean {
    const lower = text.toLowerCase();
    const q = query.toLowerCase();
    return q.split(/\s+/).every((word) => lower.includes(word));
}

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [articles, setArticles] = useState<Article[]>(articleCache ?? []);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches] = useState<string[]>(getRecentSearches);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Debounce query by 300ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Prime the cache as soon as overlay opens (if not already cached)
    useEffect(() => {
        if (!isOpen) return;
        setQuery('');
        setDebouncedQuery('');
        setTimeout(() => inputRef.current?.focus(), 100);

        if (articleCache !== null) return; // already loaded
        setIsLoading(true);
        primeCache().then((data) => {
            setArticles(data);
            setIsLoading(false);
        });
    }, [isOpen]);

    // Sync from cache if it was filled before this component mounted
    useEffect(() => {
        if (articleCache !== null && articles.length === 0) {
            setArticles(articleCache);
        }
    }, [articles.length]);

    // Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) onClose();
            }
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Search on debounced query against Supabase-cached articles
    const results = useMemo(() => {
        if (!debouncedQuery.trim()) return [];
        return articles
            .filter((a) =>
                fuzzyMatch(a.headline, debouncedQuery) ||
                fuzzyMatch(a.category, debouncedQuery) ||
                (a.tags ?? []).some((t) => fuzzyMatch(t, debouncedQuery))
            )
            .slice(0, 8);
    }, [debouncedQuery, articles]);

    const handleSelect = useCallback(
        (articleId: string) => {
            if (query.trim()) saveRecentSearch(query.trim());
            onClose();
            router.push(`/article/${articleId}`);
        },
        [query, router, onClose]
    );

    const handleTrendingClick = (topic: string) => {
        setQuery(topic);
        inputRef.current?.focus();
    };

    const handleRecentClick = (search: string) => {
        setQuery(search);
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) handleSelect(results[0].id);
    };

    if (!isOpen) return null;

    // Determine UI state
    const isTyping = query.trim() !== debouncedQuery.trim();
    const hasQuery = debouncedQuery.trim().length > 0;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="absolute top-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-ai-space shadow-2xl animate-in slide-in-from-top-2 duration-300 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                    {/* Search Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            {isLoading || isTyping ? (
                                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                            ) : (
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search AI Fresh Daily..."
                                className="w-full pl-12 pr-24 py-4 text-lg bg-card text-foreground border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors font-heading"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono-ai text-muted-foreground bg-secondary rounded border border-border">
                                    ESC
                                </kbd>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Search Results */}
                    {hasQuery && results.length > 0 && !isTyping && (
                        <div className="mt-4 max-h-[50vh] overflow-y-auto">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>
                            <div className="space-y-1">
                                {results.map((article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => handleSelect(article.id)}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors group text-left"
                                    >
                                        {article.image && (
                                            <img
                                                src={article.image}
                                                alt=""
                                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {article.headline}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                                    {article.category}
                                                </span>
                                                {article.readTime && (
                                                    <span className="text-xs text-muted-foreground">· {article.readTime}</span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {hasQuery && !isTyping && results.length === 0 && !isLoading && (
                        <div className="mt-6 text-center py-8">
                            <p className="text-muted-foreground">
                                No articles found for "<span className="font-semibold text-foreground">{debouncedQuery}</span>"
                            </p>
                        </div>
                    )}

                    {/* Trending + Recent (when no query) */}
                    {!hasQuery && !isTyping && (
                        <div className="mt-6 space-y-6 max-h-[50vh] overflow-y-auto">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        Recent Searches
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search) => (
                                            <button
                                                key={search}
                                                onClick={() => handleRecentClick(search)}
                                                className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm text-foreground transition-colors border border-border"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trending Topics */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Trending
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {TRENDING_TOPICS.slice(0, 8).map((topic) => (
                                        <button
                                            key={topic.label}
                                            onClick={() => handleTrendingClick(topic.label)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm text-foreground transition-colors border border-border hover:border-primary/20"
                                        >
                                            {topic.trending && <span className="text-orange-500 text-xs">🔥</span>}
                                            {topic.label}
                                            <span className="text-xs text-muted-foreground">{topic.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Keyboard Shortcut hint */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                    Keyboard Shortcut
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Press <kbd className="px-1.5 py-0.5 bg-secondary rounded border border-border font-mono-ai text-xs">⌘K</kbd> anytime to open search
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
