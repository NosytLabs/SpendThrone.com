/**
 * Format a number with specified decimal places
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format a number as currency
 * @param num - The number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  num: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  if (isNaN(num)) return `$0.00`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format a number as currency without the currency symbol
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string without symbol
 */
export function formatCurrencyNoSymbol(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0.00';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format a number as a percentage
 * @param num - The number to format (as decimal, e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0%';
  
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as a compact number (e.g., 1K, 1M, 1B)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted compact number string
 */
export function formatCompactNumber(num: number, decimals: number = 1): string {
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format a number as a compact currency (e.g., $1K, $1M, $1B)
 * @param num - The number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted compact currency string
 */
export function formatCompactCurrency(
  num: number,
  currency: string = 'USD',
  decimals: number = 1
): string {
  if (isNaN(num)) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export function formatWithCommas(num: number): string {
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US');
}

/**
 * Format a number with abbreviations (K, M, B, T)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string with abbreviations
 */
export function formatWithAbbreviation(num: number, decimals: number = 1): string {
  if (isNaN(num)) return '0';
  
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(decimals)}T`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  } else {
    return num.toString();
  }
}

/**
 * Format a number as an ordinal (1st, 2nd, 3rd, etc.)
 * @param num - The number to format
 * @returns Formatted ordinal string
 */
export function formatOrdinal(num: number): string {
  if (isNaN(num)) return '0';
  
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return `${num}st`;
  } else if (j === 2 && k !== 12) {
    return `${num}nd`;
  } else if (j === 3 && k !== 13) {
    return `${num}rd`;
  } else {
    return `${num}th`;
  }
}

/**
 * Format a number with a specified number of significant digits
 * @param num - The number to format
 * @param digits - Number of significant digits (default: 3)
 * @returns Formatted number string
 */
export function formatSignificantDigits(num: number, digits: number = 3): string {
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US', {
    minimumSignificantDigits: digits,
    maximumSignificantDigits: digits
  });
}

/**
 * Format a number as a fraction
 * @param num - The number to format
 * @param maxDenominator - Maximum denominator (default: 100)
 * @returns Formatted fraction string
 */
export function formatFraction(num: number, maxDenominator: number = 100): string {
  if (isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum === 0) return '0';
  
  let bestNumerator = 0;
  let bestDenominator = 1;
  let bestDiff = absNum;
  
  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(absNum * denominator);
    const diff = Math.abs(absNum - numerator / denominator);
    
    if (diff < bestDiff) {
      bestDiff = diff;
      bestNumerator = numerator;
      bestDenominator = denominator;
    }
    
    if (diff === 0) break;
  }
  
  if (bestDenominator === 1) {
    return `${sign}${bestNumerator}`;
  } else {
    return `${sign}${bestNumerator}/${bestDenominator}`;
  }
}

/**
 * Format a number as a ratio
 * @param num1 - The first number
 * @param num2 - The second number
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted ratio string
 */
export function formatRatio(num1: number, num2: number, decimals: number = 2): string {
  if (isNaN(num1) || isNaN(num2) || num2 === 0) return '0:0';
  
  const ratio = num1 / num2;
  return `${formatNumber(ratio, decimals)}:1`;
}

/**
 * Format a number with a unit
 * @param num - The number to format
 * @param unit - The unit to append
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with unit
 */
export function formatWithUnit(
  num: number,
  unit: string,
  decimals: number = 2
): string {
  if (isNaN(num)) return `0 ${unit}`;
  
  return `${formatNumber(num, decimals)} ${unit}`;
}

/**
 * Format a number as a file size
 * @param bytes - The number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (isNaN(bytes) || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format a number as a duration
 * @param seconds - The number of seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Format a number as a phone number
 * @param num - The number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(num: string | number): string {
  const phoneNumber = typeof num === 'string' ? num.replace(/\D/g, '') : num.toString();
  
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else if (phoneNumber.length === 11 && phoneNumber[0] === '1') {
    return `+${phoneNumber[0]} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
  } else {
    return phoneNumber;
  }
}

/**
 * Format a number as a credit card number
 * @param num - The number to format
 * @returns Formatted credit card number string
 */
export function formatCreditCard(num: string | number): string {
  const cardNumber = typeof num === 'string' ? num.replace(/\D/g, '') : num.toString();
  
  if (cardNumber.length <= 16) {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  } else {
    return cardNumber;
  }
}

/**
 * Format a number as a social security number
 * @param num - The number to format
 * @returns Formatted SSN string
 */
export function formatSSN(num: string | number): string {
  const ssn = typeof num === 'string' ? num.replace(/\D/g, '') : num.toString();
  
  if (ssn.length === 9) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
  } else {
    return ssn;
  }
}

/**
 * Format a number as a zip code
 * @param num - The number to format
 * @returns Formatted zip code string
 */
export function formatZipCode(num: string | number): string {
  const zip = typeof num === 'string' ? num.replace(/\D/g, '') : num.toString();
  
  if (zip.length === 9) {
    return `${zip.slice(0, 5)}-${zip.slice(5)}`;
  } else {
    return zip;
  }
}

/**
 * Format a number with a prefix
 * @param num - The number to format
 * @param prefix - The prefix to add
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with prefix
 */
export function formatWithPrefix(
  num: number,
  prefix: string,
  decimals: number = 2
): string {
  if (isNaN(num)) return `${prefix}0`;
  
  return `${prefix}${formatNumber(num, decimals)}`;
}

/**
 * Format a number with a suffix
 * @param num - The number to format
 * @param suffix - The suffix to add
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with suffix
 */
export function formatWithSuffix(
  num: number,
  suffix: string,
  decimals: number = 2
): string {
  if (isNaN(num)) return `0${suffix}`;
  
  return `${formatNumber(num, decimals)}${suffix}`;
}

/**
 * Format a number with a sign
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with sign
 */
export function formatWithSign(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  
  const sign = num >= 0 ? '+' : '-';
  return `${sign}${formatNumber(Math.abs(num), decimals)}`;
}

/**
 * Format a number with a sign and parentheses for negative values
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string with sign and parentheses
 */
export function formatWithSignAndParentheses(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  
  if (num >= 0) {
    return `+${formatNumber(num, decimals)}`;
  } else {
    return `(${formatNumber(Math.abs(num), decimals)})`;
  }
}

/**
 * Format a number with a sign and color class
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Object with formatted number and color class
 */
export function formatWithSignAndColor(num: number, decimals: number = 2): {
  formatted: string;
  colorClass: string;
} {
  if (isNaN(num)) {
    return { formatted: '0', colorClass: 'text-gray-500' };
  }
  
  if (num > 0) {
    return {
      formatted: `+${formatNumber(num, decimals)}`,
      colorClass: 'text-green-600'
    };
  } else if (num < 0) {
    return {
      formatted: `-${formatNumber(Math.abs(num), decimals)}`,
      colorClass: 'text-red-600'
    };
  } else {
    return {
      formatted: '0',
      colorClass: 'text-gray-500'
    };
  }
}

/**
 * Format a number with a sign and color class for currency
 * @param num - The number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Object with formatted currency and color class
 */
export function formatCurrencyWithSignAndColor(
  num: number,
  currency: string = 'USD',
  decimals: number = 2
): {
  formatted: string;
  colorClass: string;
} {
  if (isNaN(num)) {
    return { formatted: '$0.00', colorClass: 'text-gray-500' };
  }
  
  if (num > 0) {
    return {
      formatted: `+${formatCurrency(num, currency, decimals)}`,
      colorClass: 'text-green-600'
    };
  } else if (num < 0) {
    return {
      formatted: `-${formatCurrency(Math.abs(num), currency, decimals)}`,
      colorClass: 'text-red-600'
    };
  } else {
    return {
      formatted: formatCurrency(0, currency, decimals),
      colorClass: 'text-gray-500'
    };
  }
}

/**
 * Format a number with a sign and color class for percentage
 * @param num - The number to format (as decimal, e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Object with formatted percentage and color class
 */
export function formatPercentageWithSignAndColor(
  num: number,
  decimals: number = 2
): {
  formatted: string;
  colorClass: string;
} {
  if (isNaN(num)) {
    return { formatted: '0%', colorClass: 'text-gray-500' };
  }
  
  if (num > 0) {
    return {
      formatted: `+${formatPercentage(num, decimals)}`,
      colorClass: 'text-green-600'
    };
  } else if (num < 0) {
    return {
      formatted: `-${formatPercentage(Math.abs(num), decimals)}`,
      colorClass: 'text-red-600'
    };
  } else {
    return {
      formatted: '0%',
      colorClass: 'text-gray-500'
    };
  }
}