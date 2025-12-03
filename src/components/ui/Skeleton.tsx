import React from 'react';
import { cn } from '@/shared/utils/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animated = true,
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-background-tertiary',
        animated && 'animate-pulse',
        variantClasses[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-4 border border-border-primary rounded-lg space-y-3", className)}>
      <Skeleton variant="rectangular" height={150} className="w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton variant="text" height={20} className="w-3/4" />
        <Skeleton variant="text" height={16} className="w-1/2" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ rows = 5, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={16} className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface LoadingSkeletonProps extends SkeletonProps {
    count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, ...props }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} {...props} />
            ))}
        </>
    );
};
