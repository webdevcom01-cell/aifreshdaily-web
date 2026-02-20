"use client"
import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIsVisible(isElementVisible);
        if (isElementVisible && freezeOnceVisible) { observer.unobserve(element); }
      },
      { threshold, root, rootMargin }
    );
    observer.observe(element);
    return () => { if (element) { observer.unobserve(element); } };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { elementRef, isVisible };
}
