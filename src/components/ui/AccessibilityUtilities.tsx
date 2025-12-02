import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/shared/utils/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        "bg-background-primary text-text-primary px-4 py-2 rounded-md shadow-lg z-50",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary",
        className
      )}
    >
      {children}
    </a>
  );
};

interface HighContrastModeProps {
  children: React.ReactNode;
}

export const HighContrastMode: React.FC<HighContrastModeProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkHighContrast = () => {
      // Check if high contrast mode is enabled via system preferences
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setIsHighContrast(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkHighContrast();
  }, []);

  return (
    <div className={cn({
      "filter contrast-125": isHighContrast,
      "bg-black text-white": isHighContrast,
      "border-2 border-white": isHighContrast
    })}>
      {children}
    </div>
  );
};

interface ReducedMotionProps {
  children: React.ReactNode;
}

export const ReducedMotion: React.FC<ReducedMotionProps> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={cn({
      "motion-reduce:*": prefersReducedMotion,
      "animate-none": prefersReducedMotion
    })}>
      {children}
    </div>
  );
};

interface FocusVisibleProps {
  children: React.ReactNode;
  className?: string;
}

export const FocusVisible: React.FC<FocusVisibleProps> = ({ children, className }) => {
  return (
    <div className={cn("focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary", className)}>
      {children}
    </div>
  );
};

interface AriaLiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({ 
  message, 
  priority = 'polite',
  className 
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
};

interface KeyboardNavigationHintProps {
  shortcuts: Array<{
    key: string;
    description: string;
    modifier?: string;
  }>;
  className?: string;
}

export const KeyboardNavigationHint: React.FC<KeyboardNavigationHintProps> = ({ 
  shortcuts, 
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.ctrlKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className={cn("fixed bottom-4 left-4 z-40 print:hidden", className)}>
      <button
        onClick={() => setIsVisible(true)}
        className="bg-background-secondary/80 backdrop-blur-sm border border-border-primary text-text-primary px-3 py-2 rounded-md shadow-lg hover:bg-background-tertiary transition-colors flex items-center gap-2 group"
        aria-label="Show keyboard shortcuts"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">⌨️</span>
        <span className="text-sm font-medium hidden group-hover:inline-block transition-all duration-300">Shortcuts</span>
      </button>
    </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 bg-black/50 z-50 flex items-center justify-center", className)}>
      <div className="bg-background-primary rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-text-secondary hover:text-text-primary"
              aria-label="Close keyboard shortcuts"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-background-secondary text-text-primary rounded text-sm font-mono">
                  {shortcut.modifier && `${shortcut.modifier} + `}{shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Press Ctrl + ? to toggle this help
          </div>
        </div>
      </div>
    </div>
  );
};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children, className }) => {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
};

interface ColorContrastCheckerProps {
  foregroundColor: string;
  backgroundColor: string;
  fontSize?: number;
  fontWeight?: number;
}

export const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({
  foregroundColor,
  backgroundColor,
  fontSize = 16,
  fontWeight = 400
}) => {
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);
  const [wcagLevel, setWcagLevel] = useState<string>('');

  const getLuminance = useCallback((color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }, []);

  useEffect(() => {
    try {
      const fgLuminance = getLuminance(foregroundColor);
      const bgLuminance = getLuminance(backgroundColor);
      const lighter = Math.max(fgLuminance, bgLuminance);
      const darker = Math.min(fgLuminance, bgLuminance);
      
      const ratio = (lighter + 0.05) / (darker + 0.05);
      setContrastRatio(ratio);

      // Determine WCAG level
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
      
      if (ratio >= 7) {
        setWcagLevel('AAA');
      } else if (ratio >= 4.5) {
        setWcagLevel('AA');
      } else if (isLargeText && ratio >= 3) {
        setWcagLevel('AA Large Text');
      } else {
        setWcagLevel('Fail');
      }
    } catch (error) {
      // Silently handle contrast calculation errors
      // In production, you might want to log to a service
    }
  }, [foregroundColor, backgroundColor, fontSize, fontWeight, getLuminance]);

  if (contrastRatio === null) {
    return (
      <div className="text-text-secondary text-sm">
        Calculating contrast ratio...
      </div>
    );
  }

  const getWcagColor = (level: string) => {
    switch (level) {
      case 'AAA': return 'text-green-600';
      case 'AA':
      case 'AA Large Text': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="text-sm">
      <div className="text-text-primary">
        Contrast Ratio: <span className="font-mono">{contrastRatio.toFixed(2)}:1</span>
      </div>
      <div className={cn("font-semibold", getWcagColor(wcagLevel))}>
        WCAG Level: {wcagLevel}
      </div>
    </div>
  );
};