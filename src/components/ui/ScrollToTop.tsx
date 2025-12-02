import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/utils/utils';
import { Button } from './Button';
import { RoyalIcon, RoyalIconProps } from './RoyalIcon';

export interface ScrollToTopProps {
  threshold?: number;
  smooth?: boolean;
  duration?: number;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showProgress?: boolean;
  icon?: RoyalIconProps['variant'];
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  smooth = true,
  duration = 800,
  className,
  position = 'bottom-right',
  showProgress = false,
  icon = 'chevronUp',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only update state if scroll position changed significantly
      if (Math.abs(scrollTop - lastScrollTop) > 10) {
        lastScrollTop = scrollTop;
        
        // Use requestAnimationFrame to batch DOM reads/writes
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Cache DOM properties to avoid repeated reads
          const docElement = document.documentElement;
          const scrollHeight = docElement.scrollHeight - docElement.clientHeight;
          const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          
          setScrollProgress(progress);
          setIsVisible(scrollTop > threshold);
        });
      }
    };

    const handleScrollThrottled = throttle(handleScroll, 100);

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
      cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      const startPosition = window.pageYOffset;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function for smooth animation
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        
        const run = easeInOutCubic(progress);
        const newPosition = startPosition * (1 - run);
        
        window.scrollTo(0, newPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-40 transition-all duration-300 ease-out',
        positionClasses[position],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      <Button
        onClick={scrollToTop}
        variant="primary"
        size="sm"
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          'hover:scale-110 hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background'
        )}

        aria-label="Scroll to top of page"
      >
        {showProgress && (
          <div
            className="absolute inset-0 bg-accent-secondary/20 transition-all duration-300"
            style={{
              clipPath: `inset(0 0 0 ${100 - scrollProgress}%)`,
            }}
          />
        )}
        
        <div className="relative z-10 flex items-center justify-center">
          <RoyalIcon
            variant={icon}
            size={20}
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </div>
      </Button>
    </div>
  );
};

// Utility function for throttling
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return <>{children}</>;
};

export default ScrollToTop;