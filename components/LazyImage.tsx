"use client"
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackClassName?: string;
    aspectRatio?: string;
}

export default function LazyImage({
    src,
    alt,
    className = '',
    fallbackClassName = '',
    aspectRatio = 'aspect-video',
    ...props
}: LazyImageProps) {
    const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: '200px' });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasStartedLoading, setHasStartedLoading] = useState(false);

    useEffect(() => {
        if (isVisible && !hasStartedLoading) {
            setHasStartedLoading(true);
        }
    }, [isVisible, hasStartedLoading]);

    return (
        <div
            ref={elementRef as any}
            className={`relative overflow-hidden bg-gray-100 dark:bg-ai-space-medium ${aspectRatio} ${className}`}
        >
            {/* Placeholder / Skeleton */}
            {(!isLoaded) && (
                <div className={`absolute inset-0 skeleton ${fallbackClassName}`} />
            )}

            {/* Actual Image */}
            {hasStartedLoading && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    {...props}
                />
            )}
        </div>
    );
}
