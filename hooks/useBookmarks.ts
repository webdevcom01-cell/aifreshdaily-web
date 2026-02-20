"use client"
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai-pulse-bookmarks';

function getStoredBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(getStoredBookmarks());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarks((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => bookmarks.includes(articleId),
    [bookmarks]
  );

  const clearBookmarks = useCallback(() => { setBookmarks([]); }, []);

  return { bookmarks, toggleBookmark, isBookmarked, clearBookmarks };
}
