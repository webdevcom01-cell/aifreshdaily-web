"use client"
import { Scale, AlertTriangle, Clock, Shield } from 'lucide-react';

// Static regulation data — inlined from data/articles.ts
const regulationItems = [
  {
    id: 'reg-1',
    title: 'EU AI Act — Full Enforcement',
    region: 'EU',
    status: 'enacted' as const,
    deadline: '2026-08-02',
    impact: 'high' as const,
    description: 'The EU AI Act reaches full enforcement on August 2, 2026. All high-risk AI systems must comply with transparency, risk assessment, and human oversight requirements.',
  },
  {
    id: 'reg-2',
    title: 'US AI Executive Order 2.0',
    region: 'US',
    status: 'pending' as const,
    impact: 'high' as const,
    description: 'Expanded executive order requiring AI safety evaluations for frontier models exceeding 10^26 FLOPs. Mandates red-teaming and watermarking for government use.',
  },
  {
    id: 'reg-3',
    title: 'China Deep Synthesis Rules v3',
    region: 'China',
    status: 'enacted' as const,
    deadline: '2026-06-01',
    impact: 'medium' as const,
    description: 'Updated regulations requiring deepfake labeling, algorithm registration, and content traceability for all AI-generated media.',
  },
  {
    id: 'reg-4',
    title: 'GDPR AI Amendments',
    region: 'EU',
    status: 'proposed' as const,
    impact: 'medium' as const,
    description: 'Proposed amendments to align GDPR with the EU AI Act, covering automated decision-making, profiling, and data minimization for AI training sets.',
  },
  {
    id: 'reg-5',
    title: 'Global AI Safety Summit Accord',
    region: 'Global',
    status: 'proposed' as const,
    impact: 'low' as const,
    description: 'Non-binding international accord from the 2025 AI Safety Summit. Establishes voluntary reporting standards for frontier AI capabilities and safety incidents.',
  },
];

/** Compute real days remaining from ISO deadline string */
function getDaysRemaining(deadline?: string): number | null {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Total days between a past anchor and the deadline (for progress bar width) */
function getTotalDays(deadline: string, monthsBefore = 18): number {
    const end = new Date(deadline).getTime();
    const start = end - monthsBefore * 30 * 24 * 60 * 60 * 1000;
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

const regionFlags: Record<string, string> = {
    EU: '🇪🇺',
    US: '🇺🇸',
    China: '🇨🇳',
    Global: '🌍',
};

const statusColors: Record<string, string> = {
    enacted:  'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    proposed: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
};

const impactColors: Record<string, string> = {
    high:   'text-red-500',
    medium: 'text-yellow-500',
    low:    'text-green-500',
};

const impactIcons: Record<string, React.ReactNode> = {
    high:   <AlertTriangle className="w-3.5 h-3.5" />,
    medium: <Shield className="w-3.5 h-3.5" />,
    low:    <Shield className="w-3.5 h-3.5" />,
};

export default function RegulationTracker() {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <Scale className="w-4 h-4 text-ai-purple dark:text-ai-cyan" />
                <h3 className="text-sm font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Regulation Tracker
                </h3>
            </div>

            {/* Regulation Items */}
            <div className="divide-y divide-gray-100 dark:divide-white/5">
                {regulationItems.map((item) => (
                    <div key={item.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        {/* Title + Region */}
                        <div className="flex items-start gap-2 mb-2">
                            <span className="text-base flex-shrink-0" aria-label={item.region}>
                                {regionFlags[item.region]}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                    {item.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {/* Status + Impact + Countdown */}
                        <div className="flex items-center gap-2 flex-wrap ml-6">
                            {/* Status Badge */}
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${statusColors[item.status]}`}>
                                {item.status}
                            </span>

                            {/* Impact */}
                            <span className={`flex items-center gap-1 text-[10px] font-medium uppercase ${impactColors[item.impact]}`}>
                                {impactIcons[item.impact]}
                                {item.impact}
                            </span>

                            {/* Countdown — computed live from deadline */}
                            {item.deadline && (() => {
                                const days = getDaysRemaining(item.deadline);
                                if (days === null) return null;
                                return (
                                    <span className="flex items-center gap-1 text-[10px] font-mono-ai text-gray-500 dark:text-gray-400 ml-auto">
                                        <Clock className="w-3 h-3" />
                                        {days === 0 ? 'Today' : `${days}d left`}
                                    </span>
                                );
                            })()}
                        </div>

                        {/* Progress Bar — computed live from deadline */}
                        {item.deadline && (() => {
                            const days = getDaysRemaining(item.deadline);
                            if (days === null) return null;
                            const total = getTotalDays(item.deadline);
                            const pct = Math.max(5, Math.min(100, ((total - days) / total) * 100));
                            return (
                                <div className="mt-2 ml-6">
                                    <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full ai-gradient-bg transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                ))}
            </div>
        </div>
    );
}
