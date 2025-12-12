// Minimal debug logger gated by VITE_DEBUG
// Use debugLog for verbose logs; use logError for error reporting

// Safe check for import.meta.env
const getEnv = () => {
  try {
    return (import.meta.env || {}) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
};

const metaEnv = getEnv();
const isDebug = Boolean(metaEnv.VITE_DEBUG) || process.env.NODE_ENV === 'development';

// Simple Sentry-like interface
interface ErrorReporter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  captureException(error: unknown, context?: Record<string, any>): void;
}

// Mock implementation (would be replaced by Sentry in production)
const errorReporter: ErrorReporter = {
  captureException: (error, context) => {
    // In a real app, this sends to Sentry/LogRocket
    if (isDebug) {
      // eslint-disable-next-line no-console
      console.error('[ErrorReporting]:', error, context);
    }
    // Store in local history for debugging if needed
    try {
      const history = JSON.parse(localStorage.getItem('error_history') || '[]');
      history.push({ timestamp: Date.now(), error: String(error), context });
      if (history.length > 50) history.shift();
      localStorage.setItem('error_history', JSON.stringify(history));
    } catch {
      // ignore storage errors
    }
  }
};

export const debugLog = (...args: Parameters<typeof console.log>) => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.log('[SpendThrone Debug]:', ...args);
  }
};

export const debugWarn = (...args: Parameters<typeof console.warn>) => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.warn('[SpendThrone Warn]:', ...args);
  }
};

// Always log errors; encapsulate console usage to satisfy lint rules
export const logError = (messageOrError: unknown, ...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.error('[SpendThrone Error]:', messageOrError, ...args);
  
  const context = args.length > 0 ? (args.length === 1 ? args[0] : { args }) : undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextObj = typeof context === 'string' ? { message: context } : (context as Record<string, any>);
  
  errorReporter.captureException(messageOrError, contextObj);
};

// Grouped logs helpers
export const logGroup = (...args: Parameters<typeof console.group>) => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.group(...args);
  }
};

export const logGroupEnd = () => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};

export const ErrorService = {
  report: errorReporter.captureException
};

export default { debugLog, debugWarn, logError, logGroup, logGroupEnd, ErrorService };
