"use client"
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const aiStocks = [
  { symbol: 'NVDA',     change: 2.34,  type: 'stock' as const },
  { symbol: 'MSFT',     change: -0.12, type: 'stock' as const },
  { symbol: 'GOOGL',    change: 1.87,  type: 'stock' as const },
  { symbol: 'META',     change: 0.95,  type: 'stock' as const },
  { symbol: 'AMD',      change: 1.73,  type: 'stock' as const },
  { symbol: 'ORCL',     change: -0.44, type: 'stock' as const },
  { symbol: 'PLTR',     change: 3.21,  type: 'stock' as const },
  { symbol: 'SNOW',     change: 4.15,  type: 'stock' as const },
  { symbol: 'AI INDEX', change: 1.42,  type: 'index' as const },
];

export default function StockTicker() {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="bg-white dark:bg-ai-space border-b border-gray-200 dark:border-ai-space-medium overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto scrollbar-hide">
          {/* AI Power Index Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Activity className="w-4 h-4 text-ai-purple dark:text-ai-purple-light" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white font-heading">AI Power Index</span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 dark:bg-ai-space-medium flex-shrink-0" />

          {/* Stock Items — display-only ticker, no navigation */}
          <div className="flex items-center gap-5">
            {aiStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center gap-1.5 flex-shrink-0 px-2 py-1"
              >
                <span className={`text-xs font-semibold uppercase font-mono-ai ${stock.type === 'index'
                    ? 'text-ai-purple dark:text-ai-purple-light'
                    : 'text-gray-900 dark:text-gray-200'
                  }`}>
                  {stock.symbol}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium font-mono-ai ${stock.change >= 0
                      ? 'text-emerald-600 dark:text-ai-green-light'
                      : 'text-red-600 dark:text-ai-red-light'
                    }`}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {formatChange(stock.change)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
