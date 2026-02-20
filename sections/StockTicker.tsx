"use client"
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TickerRow {
  id: number;
  symbol: string;
  name: string | null;
  change_pct: number;
  type: 'stock' | 'crypto' | 'index';
}

// Fallback data shown until DB table is available
const FALLBACK_TICKERS: TickerRow[] = [
  { id: 1, symbol: 'NVDA',     name: 'NVIDIA',         change_pct:  2.34, type: 'stock' },
  { id: 2, symbol: 'MSFT',     name: 'Microsoft',      change_pct: -0.12, type: 'stock' },
  { id: 3, symbol: 'GOOGL',    name: 'Alphabet',       change_pct:  1.87, type: 'stock' },
  { id: 4, symbol: 'META',     name: 'Meta',           change_pct:  0.95, type: 'stock' },
  { id: 5, symbol: 'AMD',      name: 'AMD',            change_pct:  1.73, type: 'stock' },
  { id: 6, symbol: 'ORCL',     name: 'Oracle',         change_pct: -0.44, type: 'stock' },
  { id: 7, symbol: 'PLTR',     name: 'Palantir',       change_pct:  3.21, type: 'stock' },
  { id: 8, symbol: 'SNOW',     name: 'Snowflake',      change_pct:  4.15, type: 'stock' },
  { id: 9, symbol: 'AI INDEX', name: 'AI Power Index', change_pct:  1.42, type: 'index' },
];

export default function StockTicker() {
  const [tickers, setTickers] = useState<TickerRow[]>(FALLBACK_TICKERS);

  useEffect(() => {
    supabase
      .from('stock_tickers')
      .select('id, symbol, name, change_pct, type')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setTickers(data as TickerRow[]);
        }
        // On error (table not yet created) we silently keep the fallback
      });
  }, []);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="bg-white dark:bg-ai-space border-b border-gray-200 dark:border-ai-space-medium overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto scrollbar-hide">

          {/* Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Activity className="w-4 h-4 text-ai-purple dark:text-ai-purple-light" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white font-heading">
              AI Power Index
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-ai-space-medium flex-shrink-0" />

          {/* Ticker items */}
          <div className="flex items-center gap-5">
            {tickers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center gap-1.5 flex-shrink-0 px-2 py-1"
              >
                <span className={`text-xs font-semibold uppercase font-mono-ai ${
                  stock.type === 'index'
                    ? 'text-ai-purple dark:text-ai-purple-light'
                    : 'text-gray-900 dark:text-gray-200'
                }`}>
                  {stock.symbol}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-medium font-mono-ai ${
                  stock.change_pct >= 0
                    ? 'text-emerald-600 dark:text-ai-green-light'
                    : 'text-red-600 dark:text-ai-red-light'
                }`}>
                  {stock.change_pct >= 0
                    ? <TrendingUp  className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />
                  }
                  {formatChange(stock.change_pct)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
