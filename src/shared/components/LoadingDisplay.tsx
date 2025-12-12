import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { cn } from '@/shared/utils/utils';
import { LoadingConfig } from '@/shared/config/loadingConfig';

export interface LoadingDisplayProps {
  isLoading: boolean;
  context?: keyof LoadingConfig['messages'];
  customMessage?: string;
  variant?: 'spinner' | 'overlay' | 'skeleton' | 'skeleton-card' | 'skeleton-table' | 'dots' | 'bars' | 'pulse' | 'wave' | 'crown';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'solana-purple' | 'solana-green' | 'solana-blue';
  className?: string;
  fullScreen?: boolean;
  centered?: boolean;
  showIcon?: boolean;
  progress?: number;
  error?: string | null;
  onRetry?: () => void;
  skeletonCount?: number;
  skeletonHeight?: string;
  children?: React.ReactNode;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({
  isLoading,
  context = 'default',
  customMessage,
  variant = 'spinner',
  size = 'lg',
  color = 'primary',
  className,
  fullScreen = false,
  centered = true,
  showIcon = true,
  progress,
  error,
  onRetry,
  skeletonCount = 3,
  skeletonHeight = '4rem',
  children
}) => {
  if (!isLoading && !error) {
    return <>{children}</>;
  }

  if (error) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        fullScreen && 'min-h-[50vh]',
        centered && 'mx-auto',
        className
      )}>
        <RoyalIcon variant="warning" size={48} className="text-error mb-4" />
        <h3 className="text-xl font-bold text-text-primary mb-2">Failed to Load</h3>
        <p className="text-text-secondary mb-6 max-w-md">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  const message = customMessage || getDefaultMessage(context);

  // Handle different loading variants
  if (variant === 'overlay') {
    return (
      <LoadingOverlay
        isLoading={isLoading}
        message={message}
        variant={['dots', 'bars', 'pulse', 'wave', 'crown'].includes(variant) ? variant as 'dots' | 'bars' | 'pulse' | 'wave' | 'crown' : 'spinner'}
        size={size}
        color={color === 'primary' || color === 'secondary' || color === 'white' ? color : 'primary'}
        showProgress={progress !== undefined}
        progress={progress}
      />
    );
  }

  if (variant === 'skeleton-card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return <SkeletonTable rows={skeletonCount} className={className} />;
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            height={skeletonHeight}
            animated={true}
          />
        ))}
      </div>
    );
  }

  // Default spinner with optional full-screen layout
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      fullScreen && 'min-h-[50vh]',
      centered && 'mx-auto',
      className
    )}>
      {showIcon && (
        <LoadingSpinner
          variant={variant as 'spinner' | 'crown' | 'dots' | 'bars' | 'pulse' | 'wave'}
          size={size}
          color={color}
          className="mb-4"
        />
      )}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-text-primary animate-pulse">
          {message}
        </p>
        {progress !== undefined && (
          <div className="w-48 mt-2">
            <div className="bg-background-tertiary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-accent-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {Math.round(progress)}% Complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get default messages based on context
function getDefaultMessage(context: keyof LoadingConfig['messages']): string {
  const messages = {
    default: 'Loading...',
    leaderboard: 'Summoning the Court...',
    profile: 'Consulting the Royal Archives...',
    history: 'Reviewing the Chronicles...',
    tiers: 'Ascending the Ranks...',
    referral: 'Building the Empire...',
    payment: 'Processing Tribute...',
    wallet: 'Connecting to the Treasury...',
    data: 'Gathering Intelligence...',
    blockchain: 'Communicating with the Blockchain...'
  };
  
  return messages[context] || messages.default;
}

// Convenience components for common loading patterns
export const LoadingLeaderboard: React.FC<{ isLoading: boolean; error?: string; onRetry?: () => void }> = ({ 
  isLoading, 
  error, 
  onRetry
}) => (
  <LoadingDisplay
    isLoading={isLoading}
    context="leaderboard"
    variant="skeleton-table"
    skeletonCount={5}
    error={error}
    onRetry={onRetry}
  />
);

export const LoadingProfile: React.FC<{ isLoading: boolean; error?: string; onRetry?: () => void }> = ({ 
  isLoading, 
  error, 
  onRetry 
}) => (
  <LoadingDisplay
    isLoading={isLoading}
    context="profile"
    variant="skeleton-card"
    skeletonCount={3}
    error={error}
    onRetry={onRetry}
  />
);

export const LoadingHistory: React.FC<{ isLoading: boolean; error?: string; onRetry?: () => void }> = ({ 
  isLoading, 
  error, 
  onRetry 
}) => (
  <LoadingDisplay
    isLoading={isLoading}
    context="history"
    variant="skeleton"
    skeletonCount={4}
    skeletonHeight="3rem"
    error={error}
    onRetry={onRetry}
  />
);

export const LoadingPayment: React.FC<{ isLoading: boolean; progress?: number }> = ({ 
  isLoading, 
  progress 
}) => (
  <LoadingDisplay
    isLoading={isLoading}
    context="payment"
    variant="overlay"
    progress={progress}
    fullScreen={true}
  />
);

export const LoadingWallet: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <LoadingDisplay
    isLoading={isLoading}
    context="wallet"
    variant="crown"
    size="xl"
    centered={true}
  />
);