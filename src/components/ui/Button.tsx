import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/utils';
import { RippleEffect } from './AnimationUtilities';
import { useSoundEffects } from './useSoundEffects';

/**
 * Professional Button Component
 * Unified component replacing previous Button and EnhancedButton
 * Supports multiple variants, sizes, states, and advanced animations
 */

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'warning' | 'success' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  as?: 'button' | 'link';
  href?: string;
  to?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  tilt?: boolean;
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loadingText?: string;
  state?: 'default' | 'loading' | 'success' | 'error';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  hoverScale?: boolean;
  soundEffect?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  as = 'button',
  href,
  to,
  className,
  type = 'button',
  fullWidth = false,
  ripple = true,
  glow = false,
  pulse = false,
  bounce = false,
  tilt = false,
  magnetic = false,
  icon,
  iconPosition = 'left',
  loadingText = 'Loading...',
  state = 'default',
  animationSpeed = 'normal',
  hoverScale = true,
  soundEffect = false,
  ...props
}) => {
  const { playSound } = useSoundEffects();
  const speedMap = {
    slow: 'duration-300',
    normal: 'duration-200',
    fast: 'duration-100'
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    hoverScale && 'transform-gpu',
    'transition-all',
    speedMap[animationSpeed],
    fullWidth && 'w-full',
    glow && 'hover:shadow-2xl',
    pulse && 'animate-pulse',
    bounce && 'animate-bounce',
    className
  );

  const variantClasses = {
    primary: cn(
      'bg-accent-primary text-black hover:bg-accent-secondary',
      'focus:ring-accent-primary/50',
      'active:bg-yellow-600 shadow-md hover:shadow-lg hover:shadow-accent-primary/30',
      glow && 'hover:shadow-accent-primary/40',
      'bg-gradient-to-r from-yellow-400 to-yellow-600'
    ),
    secondary: cn(
      'bg-background-tertiary text-white hover:bg-background-tertiary/80',
      'focus:ring-background-tertiary/50',
      'active:bg-background-tertiary/70',
      glow && 'hover:shadow-background-tertiary/40'
    ),
    outline: cn(
      'bg-background-secondary/30 border-2 border-accent-primary text-accent-primary',
      'hover:bg-accent-primary/10 hover:border-accent-primary/80',
      'focus:ring-accent-primary/50',
      'active:bg-accent-primary/20',
      glow && 'hover:shadow-accent-primary/30'
    ),
    ghost: cn(
      'bg-background-secondary/50 text-text hover:bg-background-secondary/70',
      'focus:ring-accent-primary/50',
      'active:bg-background-secondary/60',
      glow && 'hover:shadow-white/20',
      'border border-border-primary/30'
    ),
    gradient: cn(
      'bg-gradient-to-r from-accent-secondary to-accent-primary text-white',
      'hover:from-purple-600 hover:to-yellow-500',
      'focus:ring-accent-secondary/50',
      'active:from-purple-700 active:to-yellow-600',
      glow && 'hover:shadow-accent-secondary/40'
    ),
    glass: cn(
      'bg-background-glass text-white backdrop-blur-sm',
      'hover:bg-background-glass-hover',
      'border border-border-primary',
      'focus:ring-accent-primary/50',
      'active:bg-background-glass/80',
      glow && 'hover:shadow-accent-primary/20'
    ),
    error: cn(
      'bg-error text-white hover:bg-error/90',
      'focus:ring-error/50',
      'active:bg-error/80',
      glow && 'hover:shadow-error/40'
    ),
    warning: cn(
      'bg-warning text-white hover:bg-warning/90',
      'focus:ring-warning/50',
      'active:bg-warning/80',
      glow && 'hover:shadow-warning/40'
    ),
    success: cn(
      'bg-success text-white hover:bg-success/90',
      'focus:ring-success/50',
      'active:bg-success/80',
      glow && 'hover:shadow-success/40'
    )
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-4'
  };

  const hoverClasses = cn(
    hoverScale && 'hover:scale-105 active:scale-95',
    tilt && 'hover:rotate-1',
    magnetic && 'hover:translate-x-px hover:-translate-y-px'
  );

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses,
    'hover:z-10'
  );

  const isDisabled = disabled || loading || state !== 'default';

  const handleClick = async () => {
    if (isDisabled || !onClick) return;

    if (soundEffect) {
      playSound('click');
    }

    // If loading prop is managed externally, we don't need to set local loading state
    // But for auto-handling promises, we could.
    // For now, just call onClick.
    if (onClick) onClick();
  };

  const renderContent = () => (
    <>
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </>
  );

  const Component = (
    <>
      {as === 'link' && to ? (
        <Link
          to={to}
          className={classes}
          onClick={handleClick}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...props as any}
        >
          {renderContent()}
        </Link>
      ) : as === 'link' && href ? (
        <a
          href={href}
          className={classes}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...props as any}
        >
          {renderContent()}
        </a>
      ) : (
        <button
          type={type}
          className={classes}
          onClick={handleClick}
          disabled={isDisabled}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...props as any}
        >
          {renderContent()}
        </button>
      )}
    </>
  );

  if (ripple) {
    return <RippleEffect>{Component}</RippleEffect>;
  }

  return Component;
};

// Pre-defined button components

export default Button;
