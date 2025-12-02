import React from 'react';
import { ScrollToTop, ErrorBoundary } from '../ui';
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
  const layoutClasses: Record<NonNullable<PageLayoutProps['layoutType']>, string> = {
    default: '',
    centered: 'flex flex-col items-center text-center',
    responsive: 'container-type-inline-size container-name-responsive-layout',
  };

  const maxWidthClasses: Record<NonNullable<PageLayoutProps['maxWidth']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={`bg-hero-gradient flex flex-col relative w-full min-h-full flex-grow ${layoutClasses[layoutType]} ${className}`}>
      {showBackgroundEffects && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-mesh opacity-60 backface-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-pattern-color,rgba(255,255,255,0.03))_1px,transparent_1px),linear-gradient(90deg,var(--grid-pattern-color,rgba(255,255,255,0.03))_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        </div>
      )}

      <div className={`relative z-[1] w-full ${maxWidth === 'full' ? '' : 'mx-auto'} px-4 sm:px-6 lg:px-8 py-8 md:py-10 ${maxWidth === 'full' ? 'max-w-none' : maxWidthClasses[maxWidth]}`}>
        <ErrorBoundary>
          <main id="main-content" className="relative z-[1] w-full" role="main">{children}</main>
        </ErrorBoundary>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/20 font-mono">
          {APP_CONFIG.APP_NAME_DISPLAY} v{APP_CONFIG.VERSION} • {new Date().getFullYear()}
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
};

export default PageLayout;
