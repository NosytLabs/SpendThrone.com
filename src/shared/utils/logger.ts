// Minimal debug logger gated by VITE_DEBUG
// Use debugLog for verbose logs; use logError for error reporting

const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env || {};
const isDebug = Boolean(metaEnv.VITE_DEBUG);

export const debugLog = (...args: Parameters<typeof console.log>) => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

export const debugWarn = (...args: Parameters<typeof console.warn>) => {
  if (isDebug) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

// Always log errors; encapsulate console usage to satisfy lint rules
export const logError = (...args: Parameters<typeof console.error>) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

// Grouped logs helpers
export const logGroup = (...args: Parameters<typeof console.group>) => {
  // eslint-disable-next-line no-console
  console.group(...args);
};

export const logGroupEnd = () => {
  // eslint-disable-next-line no-console
  console.groupEnd();
};

export default { debugLog, debugWarn, logError, logGroup, logGroupEnd };
