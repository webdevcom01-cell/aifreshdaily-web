"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Zap, Check } from 'lucide-react';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const existing = JSON.parse(localStorage.getItem('newsletter_subscribers') ?? '[]');
      localStorage.setItem('newsletter_subscribers', JSON.stringify([...existing, email.trim()]));
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="w-16 h-16 ai-gradient-bg rounded-2xl flex items-center justify-center ai-glow mb-6 mx-auto">
          <Mail className="w-8 h-8 text-white" />
        </div>
        {!submitted ? (
          <>
            <h1 className="text-3xl font-heading font-black text-gray-900 dark:text-white text-center mb-2">AI Fresh Daily Weekly</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">The smartest AI briefing in your inbox every week. No noise — just signal.</p>
            <ul className="space-y-3 mb-8">
              {['Top model releases & benchmark updates', 'Industry deep dives & regulation alerts', 'Exclusive AI Fresh Daily analysis & commentary'].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 ai-gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                className="w-full px-4 py-3 border border-gray-300 dark:border-ai-space-medium rounded-xl bg-white dark:bg-ai-space-light text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-ai-purple dark:focus:border-ai-cyan transition-colors" />
              <button type="submit" className="w-full py-3 ai-gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-opacity ai-glow-sm">
                Subscribe for Free
              </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">
              No spam. Unsubscribe anytime.{' '}
              <Link href="/privacy" className="underline hover:text-ai-purple dark:hover:text-ai-cyan">Privacy Policy</Link>
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-heading font-black text-gray-900 dark:text-white text-center mb-2">You&apos;re in!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Welcome to AI Fresh Daily Weekly. Your first issue lands next Tuesday.</p>
            <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 ai-gradient-bg text-white rounded-full font-semibold hover:opacity-90 ai-glow-sm">
              <ArrowLeft className="w-4 h-4" />Back to AI Fresh Daily
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
