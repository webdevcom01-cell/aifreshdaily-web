"use client"
import { useState, useEffect } from 'react';
import BreakingNews from '@/sections/BreakingNews';
import Header from '@/sections/Header';
import StockTicker from '@/sections/StockTicker';
import Footer from '@/sections/Footer';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-ai-space transition-colors duration-300">
      <BreakingNews />
      <Header />
      <StockTicker />
      <main className="bg-white dark:bg-ai-space">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <DarkModeToggle />
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 ai-gradient-bg text-white rounded-full shadow-lg hover:opacity-90 transition-all ai-glow-sm"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
