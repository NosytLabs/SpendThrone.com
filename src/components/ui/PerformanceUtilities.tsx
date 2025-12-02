import React, { useEffect, useState, useRef, useCallback } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  children, 
  placeholder = null,
  threshold = 0.1,
  rootMargin = '50px',
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
};

interface ImageLazyLoadProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageLazyLoad: React.FC<ImageLazyLoadProps> = ({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=',
  className,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imageRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(imageRef);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef!);
      }
    };
  }, [imageRef, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
    />
  );
};

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  buffer?: number;
}

export function VirtualScroll<T>({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  className,
  buffer = 5
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}

interface DebounceProps<T> {
  children: (debouncedValue: T) => React.ReactNode;
  value: T;
  delay?: number;
}

export const Debounce = <T,>({ children, value, delay = 300 }: DebounceProps<T>) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return <>{children(debouncedValue)}</>;
};

interface ThrottleProps<T> {
  children: (throttledValue: T) => React.ReactNode;
  value: T;
  delay?: number;
}

export const Throttle = <T,>({ children, value, delay = 300 }: ThrottleProps<T>) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    
    if (now - lastExecuted.current >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timeoutId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - (now - lastExecuted.current));

      return () => clearTimeout(timeoutId);
    }
  }, [value, delay]);

  return <>{children(throttledValue)}</>;
};

interface MemoProps {
  children: React.ReactNode;
  dependencies: React.DependencyList;
}

export const Memo: React.FC<MemoProps> = ({ children, dependencies }) => {
  const [cachedChildren, setCachedChildren] = useState(children);

  useEffect(() => {
    setCachedChildren(children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return <>{cachedChildren}</>;
};

interface PerformanceMonitorProps {
  children: (metrics: PerformanceMetrics) => React.ReactNode;
}

interface PerformanceMetrics {
  fps: number;
  memory: number | null;
  timing: PerformanceNavigationTiming | null;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    timing: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Check for Chrome memory API
        const memoryInfo = (performance as typeof performance & { memory?: { usedJSHeapSize: number } }).memory;
        setMetrics({
          fps,
          memory: memoryInfo ? memoryInfo.usedJSHeapSize / 1048576 : null,
          timing: null
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <>{children(metrics)}</>;
};

interface ResourcePreloaderProps {
  resources: string[];
  children: React.ReactNode;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ 
  resources, 
  children, 
  onProgress,
  onComplete
}) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (resources.length === 0) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let loaded = 0;
    const total = resources.length;

    const loadResource = (resource: string) => {
      const img = new window.Image();
      img.onload = () => {
        loaded++;
        onProgress?.(loaded, total);
        
        if (loaded === total) {
          setIsComplete(true);
          onComplete?.();
        }
      };
      img.onerror = () => {
        loaded++;
        onProgress?.(loaded, total);
        
        if (loaded === total) {
          setIsComplete(true);
          onComplete?.();
        }
      };
      img.src = resource;
    };

    resources.forEach(loadResource);
  }, [resources, onProgress, onComplete]);

  return (
    <>
      {children}
      {isComplete && (
        <div className="sr-only" aria-live="polite">
          All resources loaded
        </div>
      )}
    </>
  );
};