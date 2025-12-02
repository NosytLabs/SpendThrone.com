import { logError, debugLog } from './logger';

export interface ErrorHandlerOptions {
  context?: string;
  fallbackMessage?: string;
  logError?: boolean;
  showToast?: boolean;
}

export interface ErrorHandlerResult {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
  withAsync?: <T>(
    operation: () => Promise<T>,
    options?: ErrorHandlerOptions & {
      onSuccess?: (result: T) => void;
      onFinally?: () => void;
    }
  ) => Promise<T | null>;
}

/**
 * Standardized error handler for consistent error processing across the application
 * Enhanced with async operation support
 * 
 * Usage examples:
 * 
 * // Basic usage with manual error handling
 * const errorHandler = createErrorHandler(setError, 'MyComponent');
 * 
 * try {
 *   const data = await fetchData();
 *   setData(data);
 * } catch (error) {
 *   errorHandler.handleError(error, {
 *     context: 'fetchData',
 *     fallbackMessage: 'Failed to load data'
 *   });
 * }
 * 
 * // Enhanced usage with async wrapper (recommended)
 * const errorHandler = createErrorHandler(setError, 'MyComponent');
 * 
 * const data = await errorHandler.withAsync(
 *   () => fetchData(),
 *   {
 *     context: 'fetchData',
 *     fallbackMessage: 'Failed to load data',
 *     onSuccess: (result) => setData(result),
 *     onFinally: () => setLoading(false)
 *   }
 * );
 */
export const createErrorHandler = (
  setErrorState: (error: string | null) => void,
  defaultContext = 'Operation'
): ErrorHandlerResult & {
  withAsync: <T>(
    operation: () => Promise<T>,
    options?: ErrorHandlerOptions & {
      onSuccess?: (result: T) => void;
      onFinally?: () => void;
    }
  ) => Promise<T | null>;
} => {
  const handleError = (error: unknown, options: ErrorHandlerOptions = {}) => {
    const {
      context = defaultContext,
      fallbackMessage = 'An unexpected error occurred',
      logError: shouldLog = true,
      showToast = false
    } = options;

    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else {
      errorMessage = fallbackMessage;
    }

    // Log error if requested
    if (shouldLog) {
      logError(`[${context}] ${errorMessage}`, error);
    }

    // Debug log for development
    debugLog(`Error in ${context}:`, error);

    // Set error state
    setErrorState(errorMessage);

    // Show toast notification if requested
    if (showToast) {
      // Dispatch custom event for ToastProvider to handle
      const event = new CustomEvent('spendthrone-toast', {
        detail: {
          type: 'error',
          title: context,
          description: errorMessage
        }
      });
      window.dispatchEvent(event);
    }
  };

  const clearError = () => {
    setErrorState(null);
  };

  // Enhanced async wrapper that integrates with the error handler's state management
  const withAsync = async <T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions & {
      onSuccess?: (result: T) => void;
      onFinally?: () => void;
    } = {}
  ): Promise<T | null> => {
    const {
      context = defaultContext,
      fallbackMessage = 'Operation failed',
      logError: shouldLog = true,
      onSuccess,
      onFinally
    } = options;

    try {
      clearError(); // Clear any previous errors before starting
      const result = await operation();
      onSuccess?.(result);
      return result;
    } catch (error) {
      handleError(error, { context, fallbackMessage, logError: shouldLog });
      return null;
    } finally {
      onFinally?.();
    }
  };

  return {
    error: null, // This will be managed by the component state
    setError: setErrorState,
    handleError,
    clearError,
    withAsync
  };
};

/**
 * Standard async operation wrapper with consistent error handling
 * @deprecated Use the withAsync method from createErrorHandler instead for better state integration
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  options: ErrorHandlerOptions & {
    onSuccess?: (result: T) => void;
    onError?: (error: string) => void;
    onFinally?: () => void;
  } = {}
): Promise<T | null> => {
  const {
    context = 'Async Operation',
    fallbackMessage = 'Operation failed',
    logError: shouldLog = true,
    onSuccess,
    onError,
    onFinally
  } = options;

  try {
    const result = await operation();
    onSuccess?.(result);
    return result;
  } catch (error) {
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = fallbackMessage;
    }

    if (shouldLog) {
      logError(`[${context}] ${errorMessage}`, error);
    }

    onError?.(errorMessage);
    return null;
  } finally {
    onFinally?.();
  }
};

/**
 * Common error messages for consistent user feedback
 */
export const ErrorMessages = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  WALLET_CONNECTION: 'Wallet connection error. Please try reconnecting your wallet.',
  API_ERROR: 'Service temporarily unavailable. Please try again later.',
  VALIDATION_ERROR: 'Invalid input data. Please check your entries.',
  UNAUTHORIZED: 'Access denied. Please ensure you have the necessary permissions.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.'
} as const;

/**
 * Type guard for error objects
 */
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

/**
 * Extract error message from unknown error
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = ErrorMessages.UNKNOWN
): string => {
  if (isError(error)) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallbackMessage;
};