"use client"
import { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem('ai_fresh_daily_subscribed');
    if (subscribed === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      localStorage.setItem('ai_fresh_daily_subscribed', 'true');
      setTimeout(() => setIsSubscribed(true), 2000);
    }, 1500);
  };

  if (isSubscribed) return null;

  return (
    <section className="py-12 bg-ai-purple/5 border-y border-ai-purple/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ai-purple/10 text-ai-purple mb-6 animate-bounce-subtle">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black font-heading text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
          Neural <span className="ai-gradient-text">Intelligence</span> Digest
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto font-mono-ai">
          Join our community of AI enthusiasts. Get the week's most critical breakthroughs delivered to your terminal—er, inbox.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">Subscription Confirmed. Welcome to the future.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                  placeholder="Enter your neural address (email)..."
                  className={`w-full px-5 py-4 bg-white dark:bg-ai-space-light border ${status === 'error' ? 'border-red-500' : 'border-gray-200 dark:border-ai-space-medium'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-ai-purple transition-all dark:text-white`}
                />
                {status === 'error' && (
                  <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-bold">Please enter a valid neural address.</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 ai-gradient-bg text-white font-bold rounded-xl hover:shadow-ai-glow transition-all active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        <p className="mt-6 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono-ai">
          Zero noise. No spam. Level 5 encryption.
        </p>
      </div>
    </section>
  );
}
