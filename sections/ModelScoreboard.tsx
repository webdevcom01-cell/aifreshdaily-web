"use client"
import { useState, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus, Cpu } from 'lucide-react';
import type { AIModelScores } from '@/types';

// Static model data — inlined from data/articles.ts
interface AIModel {
  rank: number;
  name: string;
  company: string;
  score: number;
  category: string;
  change: 'up' | 'down' | 'same';
  contextWindow: string;
  highlight?: string;
  scores?: AIModelScores;
  displayRank?: number;
}

const aiModels: AIModel[] = [
  { rank: 1, name: 'Claude Opus 4.6',  company: 'Anthropic',   score: 94.2, category: 'Overall', change: 'up',   contextWindow: '1M',   highlight: 'Multi-agent teams',
    scores: { overall: 94.2, coding: 91.8, reasoning: 96.1, creative: 94.8 } },
  { rank: 2, name: 'GPT-5.3-Codex',    company: 'OpenAI',      score: 92.8, category: 'Overall', change: 'up',   contextWindow: '256K', highlight: 'Self-improving coding',
    scores: { overall: 92.8, coding: 97.3, reasoning: 91.5, creative: 89.9 } },
  { rank: 3, name: 'Gemini 3.0 Pro',   company: 'Google',      score: 91.5, category: 'Overall', change: 'up',   contextWindow: '2M',   highlight: 'Personal Intelligence',
    scores: { overall: 91.5, coding: 89.2, reasoning: 92.7, creative: 92.1 } },
  { rank: 4, name: 'Grok 5',           company: 'xAI',         score: 89.1, category: 'Overall', change: 'up',   contextWindow: '512K', highlight: '6T parameters',
    scores: { overall: 89.1, coding: 87.4, reasoning: 90.2, creative: 89.7 } },
  { rank: 5, name: 'DeepSeek V4',      company: 'DeepSeek',    score: 88.7, category: 'Overall', change: 'same', contextWindow: '1M',   highlight: 'Coding champion',
    scores: { overall: 88.7, coding: 95.6, reasoning: 87.3, creative: 83.2 } },
  { rank: 6, name: 'Kimi K2.5',        company: 'Moonshot AI', score: 87.3, category: 'Overall', change: 'up',   contextWindow: '256K', highlight: 'Agent Swarm (100 agents)',
    scores: { overall: 87.3, coding: 86.1, reasoning: 86.5, creative: 89.4 } },
  { rank: 7, name: 'Llama 4',          company: 'Meta',        score: 84.6, category: 'Overall', change: 'same', contextWindow: '128K', highlight: 'Open source leader',
    scores: { overall: 84.6, coding: 82.3, reasoning: 84.9, creative: 86.7 } },
  { rank: 8, name: 'Mistral Large 3',  company: 'Mistral AI',  score: 82.1, category: 'Overall', change: 'down', contextWindow: '128K', highlight: 'EU compliant',
    scores: { overall: 82.1, coding: 80.7, reasoning: 81.8, creative: 84.3 } },
];

const categories = ['Overall', 'Coding', 'Reasoning', 'Creative'] as const;
type Category = typeof categories[number];

function getScore(model: AIModel, cat: Category): number {
  if (!model.scores) return model.score;
  const key = cat.toLowerCase() as keyof AIModelScores;
  return model.scores[key] ?? model.score;
}

export default function ModelScoreboard() {
  const [activeCategory, setActiveCategory] = useState<Category>('Overall');

  const rankedModels = useMemo(() => {
    return [...aiModels]
      .sort((a, b) => getScore(b, activeCategory) - getScore(a, activeCategory))
      .map((model, index) => ({ ...model, displayRank: index + 1 }));
  }, [activeCategory]);

  const updatedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 ai-gradient-bg rounded-lg">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Model Scoreboard
        </h2>
        <span className="ml-auto text-xs font-mono-ai text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Live Rankings
        </span>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeCategory === cat
                ? 'ai-gradient-bg text-white ai-glow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Leaderboard Wrapper for Mobile Scroll */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[700px] sm:min-w-full rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Model</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-3">{activeCategory} Score</div>
            <div className="col-span-1">Context</div>
            <div className="col-span-1 text-right">Trend</div>
          </div>

          {/* Model Rows */}
          {rankedModels.map((model, index) => {
            const displayScore = getScore(model, activeCategory);
            return (
              <div
                key={model.name}
                className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center border-t border-gray-100 dark:border-white/5 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03] animate-fade-in-up stagger-${index + 1}`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <span className={`font-heading font-bold text-lg ${model.displayRank === 1 ? 'ai-gradient-text' :
                    model.displayRank! <= 3 ? 'text-gray-700 dark:text-gray-200' :
                      'text-gray-400 dark:text-gray-500'
                    }`}>
                    {model.displayRank}
                  </span>
                </div>

                {/* Model Name + Highlight */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-ai-purple dark:text-ai-cyan flex-shrink-0 hidden sm:block" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                        {model.name}
                      </p>
                      {model.highlight && (
                        <span className="text-[10px] font-mono-ai px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 mt-0.5 inline-block">
                          {model.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {model.company}
                </div>

                {/* Score Bar */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full ai-gradient-bg rounded-full animate-score-grow"
                        style={{ width: `${displayScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono-ai font-bold text-gray-700 dark:text-gray-200 w-10 text-right">
                      {displayScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Context Window */}
                <div className="col-span-1">
                  <span className="text-xs font-mono-ai px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                    {model.contextWindow}
                  </span>
                </div>

                {/* Trend Indicator */}
                <div className="col-span-1 text-right">
                  {model.change === 'up'   && <ArrowUp   className="w-4 h-4 text-green-500 inline-block" />}
                  {model.change === 'down' && <ArrowDown className="w-4 h-4 text-red-500   inline-block" />}
                  {model.change === 'same' && <Minus     className="w-4 h-4 text-gray-400  inline-block" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
        <span className="font-mono-ai">Updated {updatedDate} — Composite benchmark scores</span>
        <button className="text-ai-purple dark:text-ai-cyan hover:underline">
          Full methodology →
        </button>
      </div>
    </section>
  );
}
