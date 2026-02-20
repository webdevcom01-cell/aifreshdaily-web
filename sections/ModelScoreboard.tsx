"use client"
import { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ModelScore {
  id: number;
  name: string;
  company: string;
  score_overall: number;
  score_coding: number;
  score_reasoning: number;
  score_creative: number;
  context_window: string;
  highlight: string | null;
  trend: 'up' | 'down' | 'same';
  updated_at: string;
}

const CATEGORIES = ['Overall', 'Coding', 'Reasoning', 'Creative'] as const;
type Category = typeof CATEGORIES[number];

function getScore(model: ModelScore, cat: Category): number {
  const map: Record<Category, keyof ModelScore> = {
    Overall:   'score_overall',
    Coding:    'score_coding',
    Reasoning: 'score_reasoning',
    Creative:  'score_creative',
  };
  return model[map[cat]] as number;
}

export default function ModelScoreboard() {
  const [models, setModels] = useState<ModelScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('Overall');

  useEffect(() => {
    supabase
      .from('model_scores')
      .select('*')
      .order('score_overall', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setModels(data as ModelScore[]);
        setIsLoading(false);
      });
  }, []);

  const ranked = useMemo(() =>
    [...models]
      .sort((a, b) => getScore(b, activeCategory) - getScore(a, activeCategory))
      .map((m, i) => ({ ...m, displayRank: i + 1 })),
    [models, activeCategory]
  );

  const updatedAt = models[0]?.updated_at
    ? new Date(models[0].updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 ai-gradient-bg rounded-lg"><Trophy className="w-5 h-5 text-white" /></div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Model Scoreboard</h2>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 border-t border-gray-100 dark:border-white/5 animate-pulse bg-gray-50 dark:bg-white/[0.02]" />
          ))}
        </div>
      </section>
    );
  }

  if (models.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 ai-gradient-bg rounded-lg"><Trophy className="w-5 h-5 text-white" /></div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Model Scoreboard</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Rankings not available yet.</p>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 ai-gradient-bg rounded-lg"><Trophy className="w-5 h-5 text-white" /></div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Model Scoreboard</h2>
        <span className="ml-auto text-xs font-mono-ai text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Community Rankings
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'ai-gradient-bg text-white ai-glow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[640px] sm:min-w-full rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Model</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-3">{activeCategory} Score</div>
            <div className="col-span-1">Context</div>
            <div className="col-span-1 text-right">Trend</div>
          </div>

          {ranked.map((model, index) => {
            const score = getScore(model, activeCategory);
            return (
              <div key={model.id}
                className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center border-t border-gray-100 dark:border-white/5 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03] animate-fade-in-up stagger-${index + 1}`}>
                <div className="col-span-1">
                  <span className={`font-heading font-bold text-lg ${
                    model.displayRank === 1 ? 'ai-gradient-text' :
                    model.displayRank <= 3  ? 'text-gray-700 dark:text-gray-200' :
                                              'text-gray-400 dark:text-gray-500'}`}>
                    {model.displayRank}
                  </span>
                </div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-ai-purple dark:text-ai-cyan flex-shrink-0 hidden sm:block" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{model.name}</p>
                      {model.highlight && (
                        <span className="text-[10px] font-mono-ai px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 mt-0.5 inline-block">
                          {model.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400 truncate">{model.company}</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full ai-gradient-bg rounded-full" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-sm font-mono-ai font-bold text-gray-700 dark:text-gray-200 w-10 text-right">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-mono-ai px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                    {model.context_window}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  {model.trend === 'up'   && <ArrowUp   className="w-4 h-4 text-green-500 inline-block" />}
                  {model.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500   inline-block" />}
                  {model.trend === 'same' && <Minus     className="w-4 h-4 text-gray-400  inline-block" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
        <span className="font-mono-ai">Updated {updatedAt} — Community benchmark scores</span>
      </div>
    </section>
  );
}
