import React from 'react';
import { cn } from '@/shared/utils/utils';
import { BounceAnimation, RippleEffect, TiltEffect, GlowPulse, ShimmerEffect } from './AnimationUtilities';

/**
 * Professional Card Component
 * Modern card with subtle design and hover effects
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  'aria-label'?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  interactive = false,
  padding = 'md',
  variant = 'default',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = cn(
    'bg-background-card rounded-lg border transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
    'motion-reduce:transition-none motion-reduce:hover:transform-none',
    className
  );

  const variantClasses = {
    default: cn(
      'border-border shadow-sm',
      hover && 'hover:shadow-md hover:border-border-hover motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] transform-gpu',
      interactive && 'hover:shadow-md hover:border-border-hover cursor-pointer focus:ring-accent-primary/50 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] transform-gpu'
    ),
    elevated: cn(
      'border-border shadow-lg',
      hover && 'hover:shadow-xl hover:border-border-hover motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02] transform-gpu',
      interactive && 'hover:shadow-xl hover:border-border-hover cursor-pointer focus:ring-accent-primary/50 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02] transform-gpu'
    ),
    outlined: cn(
      'border-2 border-accent-primary/30 bg-transparent',
      hover && 'border-accent-primary/50',
      interactive && 'border-accent-primary/50 cursor-pointer focus:ring-accent-primary/50'
    ),
    glass: cn(
      'glass-panel transition-all duration-300',
      hover && 'hover:border-accent-primary/40 hover:shadow-lg hover:shadow-accent-primary/10',
      interactive && 'cursor-pointer hover:border-accent-primary/40 hover:shadow-lg hover:shadow-accent-primary/10 focus:ring-accent-primary/50'
    )
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8', // Increased standard padding
    lg: 'p-8 md:p-10',
    xl: 'p-12',
    '2xl': 'p-16'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding]
  );

  return (
    <article
      className={classes}
      role="article"
      aria-label={ariaLabel}
      data-testid="card"
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </article>
  );
};

// Card header component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  'aria-label'?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  bordered = false,
  'aria-label': ariaLabel
}) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between',
        bordered && 'border-b border-border pb-4 mb-4',
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </header>
  );
};

// Card title component
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  size = 'md',
  id
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <h3
      id={id}
      className={cn(
        'font-semibold text-text font-bold',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </h3>
  );
};

// Card content component
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  id
}) => {
  return (
    <div
      id={id}
      className={cn('text-base text-text-secondary', className)}
    >
      {children}
    </div>
  );
};

// Card footer component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  'aria-label'?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  bordered = false,
  'aria-label': ariaLabel
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        bordered && 'border-t border-border pt-4 mt-4',
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Enhanced Card Variants                           */
/* -------------------------------------------------------------------------- */

export interface EnhancedCardProps extends CardProps {
  // Animation options
  bounceOnHover?: boolean;
  rippleOnClick?: boolean;
  tiltOnHover?: boolean;
  glowOnHover?: boolean;
  shimmerOnHover?: boolean;
  
  // Entrance animations
  entrance?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate';
  entranceDelay?: number;
  
  // Interactive states
  interactive?: boolean;
  hoverScale?: boolean;
  hoverShadow?: boolean;
  
  // Visual enhancements
  borderAnimation?: 'rainbow' | 'pulse' | 'glow';
  backgroundEffect?: 'gradient-shift' | 'float' | 'wave';
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  // Animation options
  bounceOnHover = false,
  rippleOnClick = false,
  tiltOnHover = false,
  glowOnHover = false,
  shimmerOnHover = false,
  
  // Entrance animations
  entrance,
  entranceDelay = 0,
  
  // Interactive states
  interactive = false,
  hoverScale = false,
  hoverShadow = false,
  
  // Visual enhancements
  borderAnimation,
  backgroundEffect,
  
  // Card props
  variant = 'default',
  className,
  children,
  ...cardProps
}) => {
  let content = (
    <Card 
      variant={variant} 
      className={cn(
        'transition-all duration-300',
        interactive && 'cursor-pointer',
        hoverScale && 'hover:scale-105',
        hoverShadow && 'hover:shadow-2xl',
        borderAnimation === 'rainbow' && 'border-rainbow animate-rainbow-border',
        borderAnimation === 'pulse' && 'border-accent-primary animate-pulse-border',
        borderAnimation === 'glow' && 'border-accent-primary/30 hover:border-accent-primary/60 shadow-lg',
        backgroundEffect === 'gradient-shift' && 'bg-gradient-to-br from-background-primary to-background-secondary animate-gradient-shift',
        backgroundEffect === 'float' && 'animate-float',
        backgroundEffect === 'wave' && 'animate-wave-bg',
        className
      )}
      {...cardProps}
    >
      {children}
    </Card>
  );

  // Apply entrance animation wrapper if specified
  if (entrance) {
    content = (
      <div 
        className={cn(
          entrance === 'fade-in' && 'animate-fade-in',
          entrance === 'slide-up' && 'animate-slide-up',
          entrance === 'slide-down' && 'animate-slide-down',
          entrance === 'slide-left' && 'animate-slide-left',
          entrance === 'slide-right' && 'animate-slide-right',
          entrance === 'scale' && 'animate-scale-in',
          entrance === 'rotate' && 'animate-rotate-in'
        )}
        style={{ animationDelay: `${entranceDelay}ms` }}
      >
        {content}
      </div>
    );
  }

  // Apply animation wrappers based on props
  if (shimmerOnHover) {
    content = <ShimmerEffect>{content}</ShimmerEffect>;
  }

  if (glowOnHover) {
    content = <GlowPulse>{content}</GlowPulse>;
  }

  if (tiltOnHover) {
    content = <TiltEffect maxRotation={10}>{content}</TiltEffect>;
  }

  if (bounceOnHover) {
    content = <BounceAnimation intensity="subtle" trigger="hover">{content}</BounceAnimation>;
  }

  if (rippleOnClick) {
    content = <RippleEffect>{content}</RippleEffect>;
  }

  return content;
};

// Pre-configured enhanced card variants
export const AnimatedCard: React.FC<EnhancedCardProps> = (props) => (
  <EnhancedCard entrance="fade-in" {...props} />
);

export const InteractiveCard: React.FC<Omit<EnhancedCardProps, 'interactive' | 'hoverScale' | 'rippleOnClick'>> = (props) => (
  <EnhancedCard 
    interactive={true} 
    hoverScale={true} 
    rippleOnClick={true} 
    {...props} 
  />
);

export const GlowCard: React.FC<EnhancedCardProps> = (props) => (
  <EnhancedCard 
    glowOnHover={true} 
    borderAnimation="glow" 
    {...props} 
  />
);

export const ShimmerCard: React.FC<EnhancedCardProps> = (props) => (
  <EnhancedCard 
    shimmerOnHover={true} 
    backgroundEffect="gradient-shift" 
    {...props} 
  />
);

export const RoyalCard: React.FC<EnhancedCardProps> = (props) => (
  <EnhancedCard 
    variant="glass" 
    borderAnimation="pulse" 
    glowOnHover={true} 
    entrance="slide-up"
    {...props} 
  />
);

export default Card;
