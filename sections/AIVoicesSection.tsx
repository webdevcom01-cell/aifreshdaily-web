"use client"
import { useState, useEffect, useCallback } from 'react';
import { MessageSquareQuote, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAIVoices } from '@/lib/supabase';
import type { AIVoice } from '@/types';

export default function AIVoicesSection() {
    const [voices, setVoices] = useState<AIVoice[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchAIVoices()
            .then((data) => {
                if (data.length > 0) {
                    setVoices(data);
                    setActiveIndex(0);
                }
            })
            .catch(() => { setError(true); })
            .finally(() => setLoading(false));
    }, []);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % voices.length);
    }, [voices.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + voices.length) % voices.length);
    }, [voices.length]);

    useEffect(() => {
        if (isPaused || voices.length === 0) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isPaused, nextSlide, voices.length]);

    if (loading) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 ai-gradient-bg rounded-lg">
                            <MessageSquareQuote className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">AI Voices</h2>
                    </div>
                    <div className="max-w-3xl mx-auto animate-pulse">
                        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-10 space-y-4">
                            <div className="h-5 w-8 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto" />
                            <div className="flex items-center justify-center gap-4 pt-4">
                                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800" />
                                <div className="space-y-2">
                                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-3 w-36 bg-gray-200 dark:bg-gray-800 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state — hide section cleanly if no voices in DB
    if (!loading && (voices.length === 0 || error)) return null;

    const voice = voices[activeIndex] ?? voices[0];
    if (!voice) return null;

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 ai-gradient-bg rounded-lg">
                        <MessageSquareQuote className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        AI Voices
                    </h2>
                    <span className="text-sm text-gray-400 dark:text-gray-500">— Industry Leaders</span>
                </div>

                {/* Quote Carousel */}
                <div
                    className="relative max-w-3xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 p-2 rounded-full bg-white dark:bg-white/10 shadow-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-colors z-10"
                        aria-label="Previous quote"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 p-2 rounded-full bg-white dark:bg-white/10 shadow-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-colors z-10"
                        aria-label="Next quote"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Quote Card */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/10 p-8 sm:p-10 text-center ai-glow-sm transition-all duration-500">
                        {/* Opening quote mark */}
                        <div className="text-5xl font-heading ai-gradient-text leading-none mb-4 select-none">"</div>

                        {/* Quote text */}
                        <blockquote className="text-lg sm:text-xl font-heading leading-relaxed text-gray-800 dark:text-gray-100 mb-8 min-h-[80px]">
                            {voice.quote}
                        </blockquote>

                        {/* Avatar + Attribution */}
                        <div className="flex items-center justify-center gap-4">
                            {voice.avatar && (
                                <img
                                    src={voice.avatar}
                                    alt={voice.name}
                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-500/30"
                                />
                            )}
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 dark:text-white">{voice.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {voice.title}{voice.company ? `, ${voice.company}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dot Navigation */}
                    <div className="flex justify-center gap-2 mt-6">
                        {voices.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? 'ai-gradient-bg w-8 ai-glow-sm'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to quote ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
