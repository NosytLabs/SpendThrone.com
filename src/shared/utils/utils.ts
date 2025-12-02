/**
 * Utility Functions
 * Common utility functions used across the application
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { logError } from './logger';
import { formatCurrency as formatCurrencyCanonical } from '@/shared/utils/formatting/currency';
import { formatCompactNumber, formatPercentage as formatPercentageCanonical } from '@/shared/utils/formatting/number';


/**
 * Class name utility function
 * Merges class names with conditional logic
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values
 */
export const formatCurrency = formatCurrencyCanonical;

/**
 * Format large numbers with abbreviations
 */
export const formatNumber = formatCompactNumber;

/**
 * Format percentage values
 */
export const formatPercentage = formatPercentageCanonical;

/**
 * Format Solana addresses
 */
export function formatSolAddress(address: string, startLength: number = 4, endLength: number = 4): string {
  if (!address || address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        (cloned as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape special characters in a string for use in a regular expression
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions() {
  if (!isBrowser()) {
    return { width: 0, height: 0 };
  }
  
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  
  return window.innerWidth < 768;
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logError('LocalStorage get error:', error);
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logError('LocalStorage set error:', error);
    }
  },
  
  remove: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logError('LocalStorage remove error:', error);
    }
  },
  
  clear: (): void => {
    if (!isBrowser()) return;
    try {
      localStorage.clear();
    } catch (error) {
      logError('LocalStorage clear error:', error);
    }
  }
};

/**
 * Session storage utilities with error handling
 */
export const sessionStorage = {
  get: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      logError('SessionStorage get error:', error);
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      logError('SessionStorage set error:', error);
    }
  },
  
  remove: (key: string): void => {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      logError('SessionStorage remove error:', error);
    }
  }
};