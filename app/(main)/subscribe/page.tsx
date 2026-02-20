"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Zap, Check, Loader2, AlertCircle } from 'lucide-react';
import { subscribeEmail } from '@/lib/supabase';

export default function SubscribePage() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrMsg('');

    const err = await subscribeEmail(email);
    if (err) {
      setErrMsg('Something went wrong. Please try again.');
      setStatus('error');
      return;
    }

    setStatus('success');
    localStorage.setItem('ai_fresh_daily_subscribed', 'true');
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="w-16 h-16 ai-gradient-bg rounded-2xl flex items-center justify-center ai-glow mb-6 mx-auto">
          <Mail className="w-8 h-8 text-white" />
        </div>

        {status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-heading font-black text-gray-900 dark:text-white text-center mb-2">You&apos;re in!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
              Welcome to AI Fresh Daily Weekly. Your first issue lands next Tuesday.
            </p>
            <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 ai-gradient-bg text-white rounded-full font-semibold hover:opacity-90 ai-glow-sm">
              <ArrowLeft className="w-4 h-4" />Back to AI Fresh Daily
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-heading font-black text-gray-900 dark:text-white text-center mb-2">
              AI Fresh Daily Weekly
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
              The smartest AI briefing in your inbox every week. No noise — just signal.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Top model releases & benchmark updates',
                'Industry deep dives & regulation alerts',
                'Exclusive AI Fresh Daily analysis & commentary',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 ai-gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                  disabled={status === 'loading'}
                  placeholder="your@email.com"
                  required
                  className={`w-full px-4 py-3 border ${
                    status === 'error' ? 'border-red-500' : 'border-gray-300 dark:border-ai-space-medium'
                  } rounded-xl bg-white dark:bg-ai-space-light text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-ai-purple dark:focus:border-ai-cyan transition-colors`}
                />
                {status === 'error' && errMsg && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />{errMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 ai-gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-opacity ai-glow-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Subscribing...</>
                ) : (
                  'Subscribe for Free'
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              No spam. Unsubscribe anytime.{' '}
              <Link href="/privacy" className="underline hover:text-ai-purple dark:hover:text-ai-cyan">
                Privacy Policy
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
