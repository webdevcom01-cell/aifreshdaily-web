"use client"
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(true); // Default to dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    // Default to dark mode for AI Fresh Daily
    const shouldBeDark = saved ? saved === 'true' : true;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', String(newValue));

    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <button className={`p-2.5 rounded-full bg-ai-space-light ai-glow-sm ${className}`}>
        <Moon className="w-5 h-5 text-ai-cyan" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2.5 rounded-full transition-all ${isDark
          ? 'bg-ai-space-light text-ai-cyan hover:bg-ai-space-medium ai-glow-sm'
          : 'bg-gray-100 text-ai-purple hover:bg-gray-200'
        } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
