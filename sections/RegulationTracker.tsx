"use client"
import { useState, useEffect } from 'react';
import { Scale, AlertTriangle, Clock, Shield, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Regulation {
  id: number;
  title: string;
  region: string;
  status: 'enacted' | 'pending' | 'proposed';
  impact: 'high' | 'medium' | 'low';
  deadline: string | null;
  description: string;
  source_url: string | null;
  sort_order: number;
}

function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTotalDays(deadline: string, monthsBefore = 18): number {
  const end = new Date(deadline).getTime();
  const start = end - monthsBefore * 30 * 24 * 60 * 60 * 1000;
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

const regionFlags: Record<string, string> = {
  EU: '🇪🇺', US: '🇺🇸', China: '🇨🇳', Global: '🌍',
  UK: '🇬🇧', India: '🇮🇳', Japan: '🇯🇵', Canada: '🇨🇦',
};

const statusColors: Record<string, string> = {
  enacted:  'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
  proposed: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
};

const impactColors: Record<string, string> = {
  high: 'text-red-500', medium: 'text-yellow-500', low: 'text-green-500',
};

export default function RegulationTracker() {
  const [items, setItems] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('regulations')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Regulation[]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
          <Scale className="w-4 h-4 text-ai-purple dark:text-ai-cyan" />
          <h3 className="text-sm font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wider">Regulation Tracker</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-ai-space-medium rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-ai-space-medium rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
          <Scale className="w-4 h-4 text-ai-purple dark:text-ai-cyan" />
          <h3 className="text-sm font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wider">Regulation Tracker</h3>
        </div>
        <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500">No regulations tracked yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
        <Scale className="w-4 h-4 text-ai-purple dark:text-ai-cyan" />
        <h3 className="text-sm font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Regulation Tracker
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {items.map((item) => {
          const days = getDaysRemaining(item.deadline);
          const pct = item.deadline && days !== null
            ? Math.max(5, Math.min(100, ((getTotalDays(item.deadline) - days) / getTotalDays(item.deadline)) * 100))
            : null;

          return (
            <div key={item.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base flex-shrink-0" aria-label={item.region}>
                  {regionFlags[item.region] ?? '🌐'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{item.title}</p>
                    {item.source_url && (
                      <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 text-gray-400 hover:text-ai-purple dark:hover:text-ai-cyan transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap ml-6">
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${statusColors[item.status]}`}>
                  {item.status}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-medium uppercase ${impactColors[item.impact]}`}>
                  {item.impact === 'high'
                    ? <AlertTriangle className="w-3.5 h-3.5" />
                    : <Shield className="w-3.5 h-3.5" />}
                  {item.impact}
                </span>
                {days !== null && (
                  <span className="flex items-center gap-1 text-[10px] font-mono-ai text-gray-500 dark:text-gray-400 ml-auto">
                    <Clock className="w-3 h-3" />
                    {days === 0 ? 'Today' : `${days}d left`}
                  </span>
                )}
              </div>

              {pct !== null && (
                <div className="mt-2 ml-6">
                  <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full ai-gradient-bg transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
