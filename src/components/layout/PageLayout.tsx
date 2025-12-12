import React, { useEffect, useState } from 'react';
import { ErrorBoundary, BackToTop, GoldDustEffect } from '../ui';
import { CurrentEmperorBanner } from '../ui/CurrentEmperorBanner';
import { APP_CONFIG } from '@/core/constants/appConfig';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showBackgroundEffects?: boolean;
  layoutType?: 'default' | 'centered' | 'responsive';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  showBackgroundEffects = true,
  layoutType = 'default',
  maxWidth = 'full'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollTop;
          const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (windowHeight > 0) {
            setScrollProgress(totalScroll / windowHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const layoutClasses: Record<NonNullable<PageLayoutProps['layoutType']>, string> = {
    default: '',
    centered: 'flex flex-col items-center text-center',
    responsive: 'container-type-inline-size container-name-responsive-layout',
  };

  const maxWidthClasses: Record<NonNullable<PageLayoutProps['maxWidth']>, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={`bg-hero-gradient flex flex-col relative w-full min-h-full flex-grow ${layoutClasses[layoutType]} ${className}`}>
      <CurrentEmperorBanner />
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-secondary z-[60] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(255,215,0,0.5)]"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {showBackgroundEffects && (
        <div className="fixed inset-0 pointer-events-none z-0 backface-hidden" aria-hidden="true">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 royal-animated-gradient opacity-40"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-pattern-color,rgba(255,255,255,0.03))_1px,transparent_1px),linear-gradient(90deg,var(--grid-pattern-color,rgba(255,255,255,0.03))_1px,transparent_1px)] bg-[length:40px_40px]"></div>
          <GoldDustEffect />
        </div>
      )}

      <div className={`relative z-[1] w-full ${maxWidth === 'full' ? '' : 'mx-auto'} px-3 sm:px-4 lg:px-6 py-4 md:py-6 ${maxWidth === 'full' ? 'max-w-none' : maxWidthClasses[maxWidth]}`}>
        <ErrorBoundary>
          <main id="main-content" className="relative z-[1] w-full" role="main">{children}</main>
        </ErrorBoundary>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/20 font-mono">
          {APP_CONFIG.APP_NAME_DISPLAY} v{APP_CONFIG.VERSION} • {new Date().getFullYear()}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default PageLayout;
