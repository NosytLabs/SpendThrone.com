import React from 'react';
import { cn } from '@/shared/utils/utils';

/**
 * Professional Badge Component
 * Supports multiple variants and sizes for status indicators
 */

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'tier-bronze' | 'tier-silver' | 'tier-gold' | 'tier-platinum' | 'tier-diamond' | 'tier-common' | 'tier-rare' | 'tier-epic' | 'tier-legendary' | 'tier-mythic';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  rounded = false,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium',
    'transition-colors duration-200',
    rounded ? 'rounded-full' : 'rounded-md',
    className
  );

  const variantClasses = {
    default: cn(
      'bg-background-tertiary text-text hover:bg-background-hover'
    ),
    primary: cn(
      'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
    ),
    secondary: cn(
      'bg-background-tertiary text-text-secondary hover:bg-background-tertiary/80'
    ),
    success: cn(
      'bg-success/10 text-success hover:bg-success/20'
    ),
    warning: cn(
      'bg-warning/10 text-warning hover:bg-warning/20'
    ),
    error: cn(
      'bg-error/10 text-error hover:bg-error/20'
    ),
    info: cn(
      'bg-info/10 text-info hover:bg-info/20'
    ),
    'tier-bronze': cn(
      'bg-tier-bronze/10 text-tier-bronze hover:bg-tier-bronze/20'
    ),
    'tier-silver': cn(
      'bg-tier-silver/10 text-tier-silver hover:bg-tier-silver/20'
    ),
    'tier-gold': cn(
      'bg-tier-gold/10 text-tier-gold hover:bg-tier-gold/20'
    ),
    'tier-platinum': cn(
      'bg-tier-platinum/10 text-tier-platinum hover:bg-tier-platinum/20'
    ),
    'tier-diamond': cn(
      'bg-tier-diamond/10 text-tier-diamond hover:bg-tier-diamond/20'
    ),
    'tier-common': cn(
      'bg-tier-common/10 text-tier-common hover:bg-tier-common/20'
    ),
    'tier-rare': cn(
      'bg-tier-rare/10 text-tier-rare hover:bg-tier-rare/20'
    ),
    'tier-epic': cn(
      'bg-tier-epic/10 text-tier-epic hover:bg-tier-epic/20'
    ),
    'tier-legendary': cn(
      'bg-tier-legendary/10 text-tier-legendary hover:bg-tier-legendary/20'
    ),
    'tier-mythic': cn(
      'bg-tier-mythic/10 text-tier-mythic hover:bg-tier-mythic/20'
    )
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2 py-2 text-sm gap-1',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size]
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Specialized badge components
export const TierBadge: React.FC<{ tier: string; size?: BadgeProps['size'] }> = ({ tier, size = 'md' }) => {
  const tierMap: Record<string, BadgeProps['variant']> = {
    'bronze': 'tier-bronze',
    'silver': 'tier-silver',
    'gold': 'tier-gold',
    'platinum': 'tier-platinum',
    'diamond': 'tier-diamond',
    'common': 'tier-common',
    'rare': 'tier-rare',
    'epic': 'tier-epic',
    'legendary': 'tier-legendary',
    'mythic': 'tier-mythic'
  };

  const variant = tierMap[tier.toLowerCase()] || 'default';

  return (
    <Badge variant={variant} size={size} rounded>
      {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
    </Badge>
  );
};

export const StatusBadge: React.FC<{ 
  status: 'active' | 'pending' | 'completed' | 'failed' | 'cancelled';
  size?: BadgeProps['size'] 
}> = ({ status, size = 'md' }) => {
  const statusMap: Record<string, BadgeProps['variant']> = {
    'active': 'primary',
    'pending': 'warning',
    'completed': 'success',
    'failed': 'error',
    'cancelled': 'default'
  };

  const statusIcons: Record<string, string> = {
    'active': '●',
    'pending': '⏳',
    'completed': '✓',
    'failed': '✗',
    'cancelled': '⊝'
  };

  const variant = statusMap[status] || 'default';
  const icon = statusIcons[status] || '●';

  return (
    <Badge variant={variant} size={size} rounded>
      <span aria-hidden="true">{icon}</span>
      <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  );
};

export default Badge;