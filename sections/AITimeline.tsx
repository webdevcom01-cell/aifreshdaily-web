"use client"
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchTimelineEvents } from '@/lib/supabase';
import type { TimelineEvent } from '@/types';

export default function AITimeline() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimelineEvents()
            .then((data) => {
                if (data.length > 0) setEvents(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading && events.length === 0) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 ai-gradient-bg rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">AI Timeline</h2>
                    </div>
                    <div className="relative max-w-3xl mx-auto space-y-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex gap-6 animate-pulse">
                                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 ai-gradient-bg rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        AI Timeline
                    </h2>
                    <span className="text-sm text-gray-400 dark:text-gray-500">— From GPT-4 to AGI</span>
                </div>

                {/* Timeline */}
                <div className="relative max-w-3xl mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-purple-400 to-cyan-400 dark:from-gray-700 dark:via-purple-500 dark:to-cyan-500" />

                    {events.map((event, index) => {
                        const isPast = event.type === 'past';
                        const isPresent = event.type === 'present';
                        const isFuture = event.type === 'future';

                        return (
                            <div
                                key={index}
                                className="relative flex gap-4 sm:gap-6 mb-8 last:mb-0 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                {/* Dot */}
                                <div className="relative z-10 flex-shrink-0 mt-1">
                                    {isPresent ? (
                                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ai-gradient-bg flex items-center justify-center ai-glow animate-pulse-glow">
                                            <span className="text-white text-xs font-bold font-mono-ai">NOW</span>
                                        </div>
                                    ) : (
                                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 ${isPast
                                                ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                                : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-500/50 border-dashed'
                                            }`}>
                                            <span className={`text-xs font-mono-ai font-bold ${isPast ? 'text-gray-400 dark:text-gray-500' : 'text-purple-500 dark:text-purple-400'
                                                }`}>
                                                {event.year.slice(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`flex-1 pb-2 ${isPast ? 'opacity-60' : ''}`}>
                                    {/* Year + Quarter */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-sm font-heading font-bold ${isPresent ? 'ai-gradient-text' :
                                                isFuture ? 'text-purple-500 dark:text-purple-400' :
                                                    'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {event.year}
                                            {event.quarter && ` ${event.quarter}`}
                                        </span>
                                        {isPresent && (
                                            <span className="text-[10px] font-mono-ai px-2 py-0.5 rounded-full ai-gradient-bg text-white uppercase tracking-wider">
                                                You Are Here
                                            </span>
                                        )}
                                        {isFuture && (
                                            <span className="text-[10px] font-mono-ai px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                                                Upcoming
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-base font-semibold mb-1 ${isPresent ? 'text-gray-900 dark:text-white' :
                                            isFuture ? 'text-gray-700 dark:text-gray-300' :
                                                'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {event.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm leading-relaxed ${isPresent ? 'text-gray-600 dark:text-gray-300' :
                                            'text-gray-400 dark:text-gray-500'
                                        }`}>
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
