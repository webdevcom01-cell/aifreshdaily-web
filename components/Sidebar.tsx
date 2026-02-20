"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search, ChevronDown, ArrowUpRight, Cpu } from 'lucide-react';

interface SubCategory {
  label: string;
  href: string;
}

interface Category {
  label: string;
  href: string;
  children?: SubCategory[];
}

/**
 * All nav routes mapped to /category/:slug — matching App.tsx router.
 * Sub-categories link to parent category for now; will be refined
 * once CategoryPage supports sub-category filtering (Phase 2).
 */
const categories: Category[] = [
  {
    label: 'Models & LLMs',
    href: '/category/models',
    children: [
      { label: 'Latest Releases', href: '/category/models' },
      { label: 'OpenAI / GPT', href: '/category/models' },
      { label: 'Anthropic / Claude', href: '/category/models' },
      { label: 'Google / Gemini', href: '/category/models' },
      { label: 'xAI / Grok', href: '/category/models' },
      { label: 'DeepSeek', href: '/category/models' },
      { label: 'Moonshot / Kimi', href: '/category/models' },
      { label: 'Benchmark Arena', href: '/category/models' },
    ],
  },
  {
    label: 'AI Agents',
    href: '/category/agents',
    children: [
      { label: 'Multi-Agent Systems', href: '/category/agents' },
      { label: 'Enterprise Agents', href: '/category/agents' },
      { label: 'AI Assistants', href: '/category/agents' },
      { label: 'Agent Swarm', href: '/category/agents' },
    ],
  },
  {
    label: 'Industry',
    href: '/category/industry',
    children: [
      { label: 'Healthcare', href: '/category/industry' },
      { label: 'Finance & Banking', href: '/category/industry' },
      { label: 'Legal', href: '/category/industry' },
      { label: 'Education', href: '/category/industry' },
      { label: 'Manufacturing', href: '/category/industry' },
    ],
  },
  {
    label: 'AI Coding',
    href: '/category/coding',
    children: [
      { label: 'GPT-5.3-Codex', href: '/category/coding' },
      { label: 'Claude Code', href: '/category/coding' },
      { label: 'Cursor / Windsurf', href: '/category/coding' },
      { label: 'Agentic Coding', href: '/category/coding' },
      { label: 'Tutorials', href: '/category/coding' },
    ],
  },
  {
    label: 'Regulation',
    href: '/category/regulation',
    children: [
      { label: 'EU AI Act', href: '/category/regulation' },
      { label: 'US Policy', href: '/category/regulation' },
      { label: 'China AI Policy', href: '/category/regulation' },
      { label: 'Compliance Guides', href: '/category/regulation' },
    ],
  },
  {
    label: 'Science',
    href: '/category/science',
    children: [
      { label: 'Quantum Computing', href: '/category/science' },
      { label: 'Robotics', href: '/category/science' },
      { label: 'Edge AI', href: '/category/science' },
      { label: 'Research Papers', href: '/category/science' },
    ],
  },
  {
    label: 'AI Academy',
    href: '/category/education',
    children: [
      { label: 'Beginner', href: '/category/education' },
      { label: 'Intermediate', href: '/category/education' },
      { label: 'Advanced', href: '/category/education' },
    ],
  },
  {
    label: 'Video',
    href: '/category/video',
    children: [
      { label: 'Demos', href: '/category/video' },
      { label: 'Explainers', href: '/category/video' },
      { label: 'Comparisons', href: '/category/video' },
      { label: 'Deep Dives', href: '/category/video' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional: triggers the global SearchOverlay instead of a local form search */
  onOpenSearch?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpenSearch }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggleCategory = (label: string) => {
    setExpandedCategory(expandedCategory === label ? null : label);
  };

  /**
   * Search handler: closes the sidebar and opens the global SearchOverlay
   * via the onOpenSearch callback (wired from Header).
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchQuery('');
      onClose();
      if (onOpenSearch) {
        onOpenSearch();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Sidebar panel */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white dark:bg-ai-space z-50 overflow-hidden flex flex-col animate-in slide-in-from-left duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-ai-space-medium">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-7 h-7 ai-gradient-bg rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight font-heading">
              <span className="ai-gradient-text">AI</span>
              <span className="text-gray-900 dark:text-white"> Fresh Daily</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="w-10 h-10 ai-gradient-bg rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-ai-space-medium">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI models, topics..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-ai-space-medium rounded-xl bg-white dark:bg-ai-space-light text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-ai-purple dark:focus:border-ai-cyan transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
            </button>
          </form>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-0">
            {categories.map((category) => (
              <div key={category.label} className="border-b border-dotted border-gray-300 dark:border-ai-space-medium">
                <button
                  onClick={() => toggleCategory(category.label)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading">
                    {category.label}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      expandedCategory === category.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedCategory === category.label && category.children && (
                  <div className="pb-4 pl-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <Link
                      href={category.href}
                      className="block py-2 text-sm font-semibold text-ai-purple dark:text-ai-cyan hover:underline"
                      onClick={onClose}
                    >
                      View all {category.label} →
                    </Link>
                    {category.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-ai-purple dark:hover:text-ai-cyan transition-colors"
                        onClick={onClose}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="py-6 space-y-4">
            <Link
              href="/subscribe"
              className="flex items-center gap-2 text-lg font-semibold ai-gradient-text hover:underline"
              onClick={onClose}
            >
              <ArrowUpRight className="w-5 h-5 text-ai-purple" />
              Subscribe
            </Link>
            <Link
              href="/subscribe"
              className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-ai-purple dark:hover:text-ai-cyan transition-colors"
              onClick={onClose}
            >
              AI Fresh Daily Weekly
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-ai-space-medium bg-white dark:bg-ai-space">
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-mono-ai">
            © {new Date().getFullYear()} AI Fresh Daily
          </div>
        </div>
      </div>
    </>
  );
}
