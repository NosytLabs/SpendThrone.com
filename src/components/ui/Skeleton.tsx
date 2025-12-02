import React from 'react';
import { cn } from '@/shared/utils/utils';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle' | 'avatar' | 'card' | 'button';
  animated?: boolean;
  count?: number;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  variant = 'rect',
  animated = true,
  count = 1,
  shimmer = true,
}) => {
  const baseClasses = cn(
    'relative overflow-hidden bg-white/5 rounded-md',
    // Use shimmer animation if requested, otherwise fallback to simple pulse
    animated && shimmer && 'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
    animated && !shimmer && 'animate-pulse',
    variant === 'circle' && 'rounded-full',
    variant === 'text' && 'rounded-sm',
    variant === 'avatar' && 'rounded-full w-12 h-12',
    variant === 'card' && 'rounded-lg',
    variant === 'button' && 'rounded-lg h-10',
    className
  );

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={baseClasses}
      style={style}
    />
  ));

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0];
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 bg-background-secondary/50 backdrop-blur-sm rounded-lg border border-border-primary/50 shadow-lg', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circle" className="w-12 h-12 bg-white/10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4 bg-white/10" />
        <Skeleton variant="text" className="h-3 w-1/2 bg-white/5" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton variant="text" className="h-3 w-full bg-white/5" />
      <Skeleton variant="text" className="h-3 w-5/6 bg-white/5" />
      <Skeleton variant="text" className="h-3 w-4/6 bg-white/5" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={cn('w-full', className)}>
    <div className="grid gap-4">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-12 gap-4 p-4 bg-background-secondary rounded-lg border border-border-primary">
          <div className="col-span-1">
            <Skeleton variant="text" className="h-4 w-8" />
          </div>
          <div className="col-span-3">
            <Skeleton variant="text" className="h-4 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton variant="text" className="h-4 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton variant="text" className="h-4 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton variant="text" className="h-4 w-full" />
          </div>
          <div className="col-span-2">
            <div className="flex space-x-2">
              <Skeleton variant="button" className="h-8 w-16" />
              <Skeleton variant="button" className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Backwards compatibility for LoadingSkeleton usage in other files
export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  rounded = true,
  className,
  lines = 1
}) => (
  <Skeleton 
    width={width} 
    height={height} 
    className={cn(rounded && "rounded-md", className)} 
    count={lines} 
  />
);

export default Skeleton;