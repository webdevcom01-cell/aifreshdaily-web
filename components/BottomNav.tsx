"use client"
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Zap, Bookmark, Menu } from 'lucide-react';

interface BottomNavProps {
  onOpenSearch: () => void;
  onOpenSidebar: () => void;
}

export default function BottomNav({ onOpenSearch, onOpenSidebar }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/', trigger: null },
    { label: 'Search', icon: Search, href: null, trigger: onOpenSearch },
    { label: 'Latest', icon: Zap, href: '/category/models', trigger: null },
    { label: 'Saved', icon: Bookmark, href: '/bookmarks', trigger: null },
    { label: 'Menu', icon: Menu, href: null, trigger: onOpenSidebar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-ai-space/80 backdrop-blur-lg border-t border-gray-200 dark:border-ai-space-medium md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === pathname;
          const Icon = item.icon;
          const content = (
            <div className="flex flex-col items-center gap-1 group">
              <div className={`relative p-1 transition-all duration-300 ${isActive ? 'text-ai-purple dark:text-ai-cyan' : 'text-gray-500 dark:text-gray-400'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ai-gradient-bg rounded-full ai-glow-sm" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-ai-purple dark:text-ai-cyan' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </div>
          );

          if (item.trigger) {
            return (
              <button key={item.label} onClick={item.trigger}
                className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform">
                {content}
              </button>
            );
          }
          return (
            <Link key={item.label} href={item.href || '/'}
              className="flex-1 flex flex-col items-center justify-center h-full active:scale-90 transition-transform">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
