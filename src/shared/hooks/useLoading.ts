import { useState, useEffect, useCallback, useRef } from 'react';
import { LoadingConfig, getLoadingConfig } from '@/shared/config/loadingConfig';

export interface LoadingState {
  isLoading: boolean;
  message: string;
  progress?: number;
  error: string | null;
  retryCount: number;
  startTime: number | null;
  duration: number;
}

export interface UseLoadingOptions {
  context?: keyof LoadingConfig['messages'];
  customConfig?: Partial<LoadingConfig>;
  minDuration?: number;
  maxDuration?: number;
  debounceDelay?: number;
  onError?: (error: string) => void;
  onRetry?: () => void;
  onComplete?: () => void;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const {
    context = 'default',
    customConfig,
    minDuration,
    maxDuration,
    debounceDelay,
    onError,
    onRetry,
    onComplete
  } = options;

  const config = getLoadingConfig(context, customConfig);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: config.messages[context],
    error: null,
    retryCount: 0,
    startTime: null,
    duration: 0
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start loading with optional custom message
  const startLoading = useCallback((customMessage?: string, progress?: number) => {
    // Clear any existing timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current);
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
    }

    const startTime = Date.now();
    const message = customMessage || config.messages[context];

    // Handle debounce
    if (debounceDelay !== undefined ? debounceDelay : config.timing.debounceDelay > 0) {
      debounceTimerRef.current = setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          isLoading: true,
          message,
          progress,
          error: null,
          startTime,
          duration: 0
        }));
      }, debounceDelay !== undefined ? debounceDelay : config.timing.debounceDelay);
    } else {
      setLoadingState(prev => ({
        ...prev,
        isLoading: true,
        message,
        progress,
        error: null,
        startTime,
        duration: 0
      }));
    }

    // Set up max duration timer
    const maxDur = maxDuration !== undefined ? maxDuration : config.timing.maxDuration;
    if (maxDur > 0) {
      maxDurationTimerRef.current = setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Loading timeout exceeded',
          startTime: null
        }));
        onError?.('Loading timeout exceeded');
      }, maxDur);
    }
  }, [context, config, debounceDelay, maxDuration, onError]);

  // Update loading message or progress
  const updateLoading = useCallback((message?: string, progress?: number) => {
    setLoadingState(prev => ({
      ...prev,
      message: message || prev.message,
      progress: progress !== undefined ? progress : prev.progress
    }));
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    // Clear timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    const endTime = Date.now();
    const actualDuration = loadingState.startTime ? endTime - loadingState.startTime : 0;
    const minDur = minDuration !== undefined ? minDuration : config.timing.minDuration;

    // Ensure minimum duration
    if (actualDuration < minDur && loadingState.startTime) {
      const remainingTime = minDur - actualDuration;
      durationTimerRef.current = setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          startTime: null,
          duration: endTime - (prev.startTime || endTime)
        }));
        onComplete?.();
      }, remainingTime);
    } else {
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        startTime: null,
        duration: actualDuration
      }));
      onComplete?.();
    }
  }, [loadingState.startTime, minDuration, config.timing.minDuration, onComplete]);

  // Handle error
  const setError = useCallback((error: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      error,
      startTime: null
    }));
    onError?.(error);
  }, [onError]);

  // Retry loading
  const retry = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1
    }));
    onRetry?.();
  }, [onRetry]);

  // Reset loading state
  const reset = useCallback(() => {
    // Clear all timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    setLoadingState({
      isLoading: false,
      message: config.messages[context],
      error: null,
      retryCount: 0,
      startTime: null,
      duration: 0
    });
  }, [context, config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (durationTimerRef.current) {
        clearTimeout(durationTimerRef.current);
      }
      if (maxDurationTimerRef.current) {
        clearTimeout(maxDurationTimerRef.current);
      }
    };
  }, []);

  return {
    loadingState,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    message: loadingState.message,
    progress: loadingState.progress,
    retryCount: loadingState.retryCount,
    duration: loadingState.duration,
    startLoading,
    updateLoading,
    stopLoading,
    setError,
    retry,
    reset
  };
};

// Convenience hook for simple loading states
export const useSimpleLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    startLoading: start,
    stopLoading: stop
  };
};