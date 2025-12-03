import React, { useEffect, useState } from 'react';
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
