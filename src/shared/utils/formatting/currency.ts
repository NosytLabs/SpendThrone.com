import { logError } from '../logger';

/**
 * Formats a number as a currency string (e.g., $1,234.56).
 * 
 * This utility safely handles non-numeric inputs, logging an error and returning a 
 * fallback string to prevent UI crashes or the display of "NaN". It can be configured 
 * for different locales, currencies, and formatting options.
 *
 * @param value - The numeric value to format. Handles numbers, strings, null, and undefined.
 * @param fallback - The string to return if the input is invalid. Defaults to "$0.00".
 * @returns The formatted currency string or the fallback string.
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  fallback = '$0.00'
): string => {
  const numberValue = Number(value);

  if (isNaN(numberValue)) {
    logError(`Invalid value for formatCurrency: ${value}`);
    return fallback;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  } catch (error) {
    logError(`Error formatting currency for value: ${numberValue}`, error);
    return fallback;
  }
};

/**
 * Format a monetary value without currency symbol
 * @param amount - The monetary value to format
 * @param minimumFractionDigits - Minimum decimal places (default: 2)
 * @param maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatAmount(
  amount: number,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
}

/**
 * Parse a formatted currency string back to a number
 * @param formattedValue - The formatted currency string
 * @returns Parsed number value
 */
export function parseCurrency(formattedValue: string): number {
  // Remove currency symbols and commas, then parse as float
  const cleanedValue = formattedValue.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanedValue);
}

/**
 * Format a monetary value with abbreviated notation for large amounts
 * @param amount - The monetary value to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 1)
 * @returns Abbreviated currency string (e.g., $1.2K, $3.5M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD',
  decimals: number = 1
): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return formatter.format(amount);
}