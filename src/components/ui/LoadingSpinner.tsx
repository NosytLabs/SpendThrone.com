import React from 'react';
import { cn } from '@/shared/utils/utils';
import { RoyalIcon } from './RoyalIcon';
import { GlowPulse } from './AnimationUtilities';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'solana-purple' | 'solana-green' | 'solana-blue';
  thickness?: 'thin' | 'normal' | 'thick';
  speed?: 'slow' | 'normal' | 'fast';
  variant?: 'spinner' | 'crown' | 'dots' | 'bars' | 'pulse' | 'wave';
  message?: string;
  showMessage?: boolean;
  ariaLabel?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  color = 'primary',
  thickness = 'normal',
  speed = 'normal',
  variant = 'spinner',
  message = 'Loading...',
  showMessage = false,
  ariaLabel = 'Loading',
  // zIndex was unused after removing overlay
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-accent-primary',
    secondary: 'border-text-secondary',
    white: 'border-white',
    'solana-purple': 'border-accent-secondary',
    'solana-green': 'border-success',
    'solana-blue': 'border-info'
  };

  const thicknessClasses = {
    thin: 'border',
    normal: 'border-2',
    thick: 'border-4'
  };

  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  // Handle numeric size for CSS spinner variant
  const getSpinnerSize = () => {
    if (typeof size === 'number') {
      return {
        width: `${size}px`,
        height: `${size}px`
      };
    }
    return {};
  };

  // Create the spinner content based on variant
  const renderSpinner = () => {
    if (variant === 'crown') {
      const crownSize = typeof size === 'number' ? size : 
        size === 'sm' ? 24 : 
        size === 'md' ? 32 : 
        size === 'lg' ? 48 : 64;
        
      return (
        <div
          className={cn('flex flex-col items-center justify-center', className)}
          role="status"
          aria-live="polite"
          aria-label={ariaLabel}
          aria-busy="true"
        >
          <GlowPulse color="gold" intensity="medium" duration={1500}>
             <div className="relative animate-bounce">
                <RoyalIcon variant="crown" size={crownSize} className="text-accent-primary filter drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                <div className="absolute inset-0 animate-ping opacity-30">
                    <RoyalIcon variant="crown" size={crownSize} className="text-accent-primary" />
                </div>
             </div>
          </GlowPulse>
          {showMessage && message && (
            <p className="mt-4 text-sm text-text-secondary font-cinzel animate-pulse">
              {message}
            </p>
          )}
        </div>
      );
    }

    // Enhanced CSS spinner variants
    const spinnerSize = getSpinnerSize();

    if (variant === 'dots') {
      return (
        <div
          className={cn('flex space-x-1', className)}
          role="status"
          aria-label={ariaLabel}
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'rounded-full',
                typeof size === 'string' ? sizeClasses[size] : '',
                colorClasses[color].replace('border-', 'bg-'),
                'animate-bounce'
              )}
              style={{
                ...spinnerSize,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
          <span className="sr-only">{message}</span>
        </div>
      );
    }

    if (variant === 'bars') {
      return (
        <div
          className={cn('flex space-x-1', className)}
          role="status"
          aria-label={ariaLabel}
          aria-busy="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1 rounded-sm',
                colorClasses[color].replace('border-', 'bg-'),
                'animate-pulse'
              )}
              style={{
                height: typeof size === 'number' ? `${size}px` : 
                  size === 'sm' ? '16px' : 
                  size === 'md' ? '24px' : 
                  size === 'lg' ? '32px' : '48px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
          <span className="sr-only">{message}</span>
        </div>
      );
    }

    if (variant === 'pulse') {
      return (
        <div
          className={cn(
            'rounded-full animate-pulse',
            typeof size === 'string' && sizeClasses[size],
            colorClasses[color].replace('border-', 'bg-'),
            className
          )}
          style={spinnerSize}
          role="status"
          aria-label={ariaLabel}
          aria-busy="true"
        >
          <span className="sr-only">{message}</span>
        </div>
      );
    }

    if (variant === 'wave') {
      return (
        <div
          className={cn('flex', className)}
          role="status"
          aria-label={ariaLabel}
          aria-busy="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1 rounded-full mx-px',
                colorClasses[color].replace('border-', 'bg-')
              )}
              style={{
                height: typeof size === 'number' ? `${size}px` : 
                  size === 'sm' ? '16px' : 
                  size === 'md' ? '24px' : 
                  size === 'lg' ? '32px' : '48px',
                animation: `wave 1.2s ease-in-out infinite ${i * 0.1}s`
              }}
            />
          ))}
          <span className="sr-only">{message}</span>
        </div>
      );
    }

    // Default CSS spinner variant
    return (
      <div
        className={cn(
          'inline-block',
          typeof size === 'string' && sizeClasses[size],
          'border-solid',
          colorClasses[color],
          'border-t-transparent',
          thicknessClasses[thickness],
          speedClasses[speed],
          'rounded-full',
          className
        )}
        style={spinnerSize}
        role="status"
        aria-label={ariaLabel}
        aria-busy="true"
      >
        <span className="sr-only">{message}</span>
      </div>
    );
  };

  // Return standalone spinner
  return renderSpinner();
};