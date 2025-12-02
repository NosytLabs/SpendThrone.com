import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/utils/utils';
import { Button } from './Button';
import { RoyalIcon } from './RoyalIcon';
import { useToast } from './use-toast';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon' | 'switch';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  variant = 'button',
  showLabel = false,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');
  const { addToast } = useToast();

  useEffect(() => {
    // Check for saved theme preference or default to 'system'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Save preference
    localStorage.setItem('theme', theme);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: effectiveTheme } }));
  }, [theme, systemTheme]);

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    
    const themeNames = {
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'System Mode'
    };
    
    addToast({
      type: 'success',
      title: 'Theme Changed',
      description: `Switched to ${themeNames[nextTheme]}`,
      duration: 2000
    });
  };

  const getIcon = () => {
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    if (effectiveTheme === 'light') {
      return 'sun';
    } else {
      return 'moon';
    }
  };

  const getLabel = () => {
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    if (theme === 'system') {
      return `System (${effectiveTheme})`;
    }
    
    return effectiveTheme === 'light' ? 'Light' : 'Dark';
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <button
          onClick={cycleTheme}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background',
            theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
              ? 'bg-accent-primary'
              : 'bg-background-secondary'
          )}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
                ? 'translate-x-6'
                : 'translate-x-1'
            )}
          />
        </button>
        {showLabel && (
          <span className="text-sm text-text-secondary">{getLabel()}</span>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={cycleTheme}
        className={cn(
          'flex items-center justify-center rounded-lg transition-colors',
          'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-primary',
          sizeClasses[size],
          className
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  
      >
        <RoyalIcon
          variant={getIcon() as 'sun' | 'moon'}
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
          className="text-text-secondary hover:text-text-primary transition-colors"
        />
      </button>
    );
  }

  return (
    <Button
      onClick={cycleTheme}
      variant="ghost"
      size={size}
      className={cn('flex items-center space-x-2', className)}
      title={`Current: ${getLabel()}`}
    >
      <RoyalIcon variant={getIcon() as 'sun' | 'moon'} size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      {showLabel && <span>{getLabel()}</span>}
    </Button>
  );
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
};

export default ThemeToggle;