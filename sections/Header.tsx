"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Cpu, Bookmark } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import SearchOverlay from '@/components/SearchOverlay';
import BottomNav from '@/components/BottomNav';

interface SubCategory {
  label: string;
  href: string;
}

interface NavItemWithChildren {
  label: string;
  href: string;
  children?: SubCategory[];
}

const navItemsWithSubcategories: NavItemWithChildren[] = [
  {
    label: 'Models & LLMs',
    href: '/category/models',
    children: [
      { label: 'OpenAI', href: '/tag/openai' },
      { label: 'Anthropic', href: '/tag/anthropic' },
      { label: 'Google', href: '/tag/google' },
      { label: 'Meta / Llama', href: '/tag/meta' },
      { label: 'xAI / Grok', href: '/tag/xai' },
      { label: 'DeepSeek', href: '/tag/deepseek-ai' },
      { label: 'Mistral', href: '/tag/mistral' },
      { label: 'Benchmarks', href: '/tag/benchmark' },
    ]
  },
  {
    label: 'AI Agents',
    href: '/category/agents',
    children: [
      { label: 'Agentic AI', href: '/tag/agentic-ai' },
      { label: 'Automation', href: '/tag/automation' },
      { label: 'Enterprise AI', href: '/tag/enterprise-ai' },
      { label: 'Robotics', href: '/tag/robotics' },
    ]
  },
  {
    label: 'Tools',
    href: '/category/tools',
    children: [
      { label: 'Code Generation', href: '/tag/code-generation' },
      { label: 'Productivity', href: '/tag/productivity' },
      { label: 'Open Source', href: '/tag/open-source' },
      { label: 'Prompt Engineering', href: '/tag/prompt-engineering' },
    ]
  },
  {
    label: 'Business',
    href: '/category/business',
    children: [
      { label: 'Funding & VC', href: '/tag/funding' },
      { label: 'Startups', href: '/tag/startup' },
      { label: 'Acquisitions', href: '/tag/acquisition' },
      { label: 'Enterprise', href: '/tag/enterprise-ai' },
    ]
  },
  {
    label: 'Research',
    href: '/category/research',
    children: [
      { label: 'Foundation Models', href: '/tag/foundation-models' },
      { label: 'Computer Vision', href: '/tag/computer-vision' },
      { label: 'Alignment', href: '/tag/alignment' },
      { label: 'Multimodal', href: '/tag/multimodal' },
    ]
  },
  {
    label: 'Policy',
    href: '/category/policy',
    children: [
      { label: 'Regulation', href: '/tag/regulation' },
      { label: 'Safety', href: '/tag/safety' },
      { label: 'Ethics', href: '/tag/ethics' },
      { label: 'Privacy', href: '/tag/privacy' },
    ]
  },
  {
    label: 'Hardware',
    href: '/category/hardware',
    children: [
      { label: 'NVIDIA', href: '/tag/nvidia' },
      { label: 'GPUs', href: '/tag/gpu' },
      { label: 'Data Centers', href: '/tag/data-center' },
      { label: 'Edge AI', href: '/tag/edge-ai' },
    ]
  },
  { label: 'Learn', href: '/category/learn' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white dark:bg-ai-space transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-ai-purple/5 dark:shadow-ai-purple/10' : ''
          }`}
      >
        {/* Logo Bar */}
        <div className="border-b border-gray-200 dark:border-ai-space-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Menu Button + Logo */}
              <div className="flex items-center gap-4">
                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-ai-space-light rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Logo */}
                <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                  <div className="w-8 h-8 ai-gradient-bg rounded-lg flex items-center justify-center ai-glow-sm">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-heading">
                    <span className="ai-gradient-text">AI</span>
                    <span className="text-gray-900 dark:text-white"> Fresh Daily</span>
                  </h1>
                </Link>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-5">
                <span className="text-xs font-mono-ai text-gray-400 dark:text-gray-500">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <Link
                  href="/bookmarks"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-ai-space-light rounded-full transition-colors relative group"
                  aria-label="Bookmarks"
                >
                  <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="/subscribe"
                  className="flex items-center gap-1 px-4 py-1.5 ai-gradient-bg text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-ai-purple dark:hover:text-ai-cyan transition-colors"
                >
                  Log in
                </Link>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-ai-space-light rounded-full transition-colors flex items-center gap-1.5"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono-ai text-gray-400 bg-gray-100 dark:bg-ai-space-light rounded border border-gray-200 dark:border-ai-space-medium">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 md:hidden">
                <Link
                  href="/bookmarks"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-ai-space-light rounded-full transition-colors"
                  aria-label="Bookmarks"
                >
                  <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </Link>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-ai-space-light rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Desktop */}
        <nav className="hidden md:block border-b border-gray-200 dark:border-ai-space-medium" ref={dropdownRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11">
              <ul className="flex items-center gap-0.5">
                {navItemsWithSubcategories.map((item) => (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-ai-purple dark:hover:text-ai-cyan transition-colors relative group"
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      )}
                      <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-ai-purple to-ai-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Dropdown Menu */}
                    {item.children && activeDropdown === item.label && (
                      <div className="absolute top-full left-0 z-50 w-60 bg-white dark:bg-ai-space-light shadow-xl border border-gray-200 dark:border-ai-space-medium rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ai-space-medium hover:text-ai-purple dark:hover:text-ai-cyan transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Sidebar — onOpenSearch wires sidebar search to the global SearchOverlay */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
    </>
  );
}
