/**
 * Format a monetary value with currency symbol and proper decimal places
 * @param amount - The monetary value to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

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
 * @returns Abbreviated currency string (e.g., $1.2K, $3.5M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD'
): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    compactDisplay: 'short'
  });
  
  return formatter.format(amount);
}