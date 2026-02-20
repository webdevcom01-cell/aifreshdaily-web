"use client"
import { useState, useEffect } from 'react';
import { fetchArticles } from '@/lib/supabase';
import { TrendingUp, Flame } from 'lucide-react';
import Link from 'next/link';
import type { Article } from '@/types';

// Static topic metadata — structure that drives the UI
const TOPICS = [
  { label: 'GPT-5.3-Codex',   count: '12.4K', trending: true,  categorySlug: 'models' },
  { label: '1M Token Race',   count: '8.7K',  trending: true,  categorySlug: 'models' },
  { label: 'Agent Swarm',     count: '6.2K',  trending: true,  categorySlug: 'agents' },
  { label: 'DeepSeek V4',     count: '5.9K',  trending: true,  categorySlug: 'models' },
  { label: 'GPT-4o Retirement', count: '4.8K', trending: false, categorySlug: 'models' },
  { label: 'EU AI Act',       count: '3.5K',  trending: false, categorySlug: 'regulation' },
  { label: 'Gemini 3.0 GA',   count: '3.2K',  trending: true,  categorySlug: 'models' },
  { label: 'Grok 5 Beta',     count: '2.8K',  trending: true,  categorySlug: 'models' },
];

// Maps categorySlug → keywords to match against article.category
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  models:     ['model', 'llm', 'gpt', 'claude', 'gemini', 'deepseek', 'grok', 'kimi', 'llama', 'mistral'],
  agents:     ['agent', 'agentic', 'autonomous', 'multi-agent', 'swarm'],
  coding:     ['coding', 'code', 'developer', 'copilot', 'cursor'],
  regulation: ['regulat', 'policy', 'legal', 'compliance', 'act', 'executive order'],
  industry:   ['industry', 'enterprise', 'business', 'finance', 'healthcare', 'manufacturing'],
  education:  ['education', 'academy', 'tutorial', 'learn', 'course'],
};

function countForSlug(articles: Article[], slug: string): number {
  const keywords = CATEGORY_KEYWORDS[slug] ?? [slug];
  return articles.filter((a) =>
    keywords.some((k) => a.category.toLowerCase().includes(k))
  ).length;
}

type Topic = typeof TOPICS[number] & { liveCount: number | null };

export default function TrendingTopics() {
  const [topics, setTopics] = useState<Topic[]>(
    TOPICS.map((t) => ({ ...t, liveCount: null }))
  );

  useEffect(() => {
    fetchArticles(100)
      .then((articles: Article[]) => {
        setTopics(
          TOPICS.map((t) => ({
            ...t,
            liveCount: countForSlug(articles, t.categorySlug),
          }))
        );
      })
      .catch(() => {}); // silently keep static counts if Supabase fails
  }, []);

  return (
    <section className="py-8 bg-gray-50 dark:bg-ai-space-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Trending in AI</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-ai-purple/20 to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topics.map((topic, index) => {
            const countLabel = topic.liveCount !== null
              ? `${topic.liveCount} article${topic.liveCount !== 1 ? 's' : ''}`
              : `${topic.count} discussions`;

            return (
              <Link
                key={topic.label}
                href={`/category/${topic.categorySlug}`}
                className="group p-4 bg-white dark:bg-ai-space rounded-xl border border-gray-200 dark:border-ai-space-medium hover:border-ai-purple/30 dark:hover:border-ai-cyan/30 transition-all hover:shadow-ai-glow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-ai-purple dark:text-ai-cyan font-mono-ai">#{index + 1}</span>
                  {topic.trending && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading">
                  {topic.label}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono-ai">
                  {countLabel}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
