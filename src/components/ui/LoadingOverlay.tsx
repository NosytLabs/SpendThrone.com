import React from 'react';
import { cn } from '@/shared/utils/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse' | 'wave' | 'crown';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  opacity?: 'light' | 'medium' | 'dark';
  blur?: boolean;
  className?: string;
  zIndex?: number;
  allowInteraction?: boolean;
  showProgress?: boolean;
  progress?: number;
  progressMax?: number;
  animatedBackground?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  subMessage,
  variant = 'spinner',
  size = 'lg',
  color = 'primary',
  opacity = 'medium',
  blur = true,
  className,
  zIndex = 50,
  allowInteraction = false,
  showProgress = false,
  progress = 0,
  progressMax = 100,
  animatedBackground = false
}) => {
  if (!isLoading) return null;

  const opacityClasses = {
    light: 'bg-black bg-opacity-25',
    medium: 'bg-black bg-opacity-50',
    dark: 'bg-black bg-opacity-75'
  };

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center transition-opacity duration-300',
        opacityClasses[opacity],
        blur && 'backdrop-blur-sm',
        !allowInteraction && 'pointer-events-none',
        animatedBackground && 'particle-bg',
        className
      )}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label="Loading overlay"
    >
      <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-background-glass border border-border-primary shadow-2xl">
        <LoadingSpinner
          variant={variant}
          size={size}
          color={color}
          message={message}
          showMessage={false}
        />
        
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-text-primary animate-pulse">
            {message}
          </p>
          
          {subMessage && (
            <p className="text-sm text-text-secondary">
              {subMessage}
            </p>
          )}
          
          {showProgress && (
            <div className="w-48 mt-4">
              <div className="bg-background-tertiary rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-accent-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min((progress / progressMax) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {Math.round((progress / progressMax) * 100)}% Complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};