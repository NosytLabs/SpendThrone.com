/**
 * Utility Functions
 * Common utility functions used across the application
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
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
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  
  return window.innerWidth < 768;
}
