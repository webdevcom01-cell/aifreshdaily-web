"use client"
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
}

export default function BookmarkButton({ articleId, className = '' }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Load bookmark state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-pulse-bookmarks');
    if (saved) {
      const bookmarks = JSON.parse(saved);
      setIsBookmarked(bookmarks.includes(articleId));
    }
  }, [articleId]);

  const toggleBookmark = () => {
    const saved = localStorage.getItem('ai-pulse-bookmarks');
    let bookmarks: string[] = saved ? JSON.parse(saved) : [];

    if (isBookmarked) {
      bookmarks = bookmarks.filter(id => id !== articleId);
    } else {
      bookmarks.push(articleId);
    }

    localStorage.setItem('ai-pulse-bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleBookmark}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isBookmarked
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
        {isBookmarked ? 'Saved' : 'Save'}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap animate-in fade-in duration-200">
          {isBookmarked ? 'Article saved!' : 'Article removed'}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
