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
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export function formatWithCommas(num: number): string {
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('en-US');
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
  }
  
  if (bestNumerator === 0) return '0';
  
  const wholePart = Math.floor(bestNumerator / bestDenominator);
  const remainder = bestNumerator % bestDenominator;
  
  if (remainder === 0) {
    return `${sign}${wholePart}`;
  } else {
    if (wholePart > 0) {
      return `${sign}${wholePart} ${remainder}/${bestDenominator}`;
    } else {
      return `${sign}${remainder}/${bestDenominator}`;
    }
  }
}

/**
 * Pad a number with leading zeros
 * @param num - The number to pad
 * @param length - The desired length (default: 2)
 * @returns Padded number string
 */
export function padWithZeros(num: number, length: number = 2): string {
  if (isNaN(num)) return '0'.repeat(length);
  
  return num.toString().padStart(length, '0');
}

/**
 * Clamp a number between a min and max value
 * @param num - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  if (isNaN(num)) return min;
  
  return Math.max(min, Math.min(num, max));
}



/**
 * Calculate the average of an array of numbers
 * @param nums - The array of numbers
 * @returns The average of the numbers
 */
export function average(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;
  
  const sum = nums.reduce((acc, val) => acc + val, 0);
  return sum / nums.length;
}

/**
 * Calculate the sum of an array of numbers
 * @param nums - The array of numbers
 * @returns The sum of the numbers
 */
export function sum(nums: number[]): number {
  if (!nums) return 0;
  
  return nums.reduce((acc, val) => acc + val, 0);
}

/**
 * Generate a random number within a specified range
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random number within the range
 */
export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer within a specified range
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer within the range
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round a number to a specified number of decimal places
 * @param num - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns Rounded number
 */
export function round(num: number, decimals: number = 0): number {
  if (isNaN(num)) return 0;
  
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Truncate a number to a specified number of decimal places
 * @param num - The number to truncate
 * @param decimals - Number of decimal places (default: 0)
 * @returns Truncated number
 */
export function truncate(num: number, decimals: number = 0): number {
  if (isNaN(num)) return 0;
  
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

/**
 * Map a number from one range to another
 * @param num - The number to map
 * @param inMin - The minimum of the input range
 * @param inMax - The maximum of the input range
 * @param outMin - The minimum of the output range
 * @param outMax - The maximum of the output range
 * @returns The mapped number
 */
export function mapRange(
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (isNaN(num)) return outMin;
  
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate the greatest common divisor of two numbers
 * @param a - The first number
 * @param b - The second number
 * @returns The greatest common divisor
 */
export function gcd(a: number, b: number): number {
  if (isNaN(a) || isNaN(b)) return 0;
  
  a = Math.abs(a);
  b = Math.abs(b);
  
  while (b) {
    [a, b] = [b, a % b];
  }
  
  return a;
}

/**
 * Calculate the least common multiple of two numbers
 * @param a - The first number
 * @param b - The second number
 * @returns The least common multiple
 */
export function lcm(a: number, b: number): number {
  if (isNaN(a) || isNaN(b)) return 0;
  
  return Math.abs(a * b) / gcd(a, b);
}





/**
 * Calculate the percentage of a total
 * @param part - The part of the total
 * @param total - The total value
 * @returns The percentage as a number (0-100)
 */
export function getPercentageOf(part: number, total: number): number {
  if (isNaN(part) || isNaN(total) || total === 0) return 0;
  
  return (part / total) * 100;
}

/**
 * Calculate the value of a percentage of a total
 * @param percentage - The percentage (0-100)
 * @param total - The total value
 * @returns The value of the percentage
 */
export function getValueFromPercentage(percentage: number, total: number): number {
  if (isNaN(percentage) || isNaN(total)) return 0;
  
  return (percentage / 100) * total;
}

/**
 * Calculate the percentage change between two numbers
 * @param oldNum - The old number
 * @param newNum - The new number
 * @returns The percentage change as a number (0-100)
 */
export function getPercentageChange(oldNum: number, newNum: number): number {
  if (isNaN(oldNum) || isNaN(newNum) || oldNum === 0) return 0;
  
  return ((newNum - oldNum) / oldNum) * 100;
}

/**
 * Calculate the distance between two points
 * @param x1 - The x-coordinate of the first point
 * @param y1 - The y-coordinate of the first point
 * @param x2 - The x-coordinate of the second point
 * @param y2 - The y-coordinate of the second point
 * @returns The distance between the two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in degrees
 * @param x1 - The x-coordinate of the first point
 * @param y1 - The y-coordinate of the first point
 * @param x2 - The x-coordinate of the second point
 * @param y2 - The y-coordinate of the second point
 * @returns The angle in degrees
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  const dy = y2 - y1;
  const dx = x2 - x1;
  
  const theta = Math.atan2(dy, dx);
  const degrees = (theta * 180) / Math.PI;
  
  return degrees < 0 ? 360 + degrees : degrees;
}

/**
 * Convert degrees to radians
 * @param degrees - The angle in degrees
 * @returns The angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param radians - The angle in radians
 * @returns The angle in degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Check if a number is within a specified range (inclusive)
 * @param num - The number to check
 * @param min - The minimum value of the range
 * @param max - The maximum value of the range
 * @returns True if the number is within the range, false otherwise
 */
export function isInRange(num: number, min: number, max: number): boolean {
  if (isNaN(num) || isNaN(min) || isNaN(max)) return false;
  
  return num >= min && num <= max;
}

/**
 * Calculate the median of an array of numbers
 * @param nums - The array of numbers
 * @returns The median of the numbers
 */
export function median(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;
  
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate the mode of an array of numbers
 * @param nums - The array of numbers
 * @returns An array of the most frequent numbers
 */
export function mode(nums: number[]): number[] {
  if (!nums || nums.length === 0) return [];
  
  const counts: { [key: number]: number } = {};
  let maxCount = 0;
  
  for (const num of nums) {
    counts[num] = (counts[num] || 0) + 1;
    if (counts[num] > maxCount) {
      maxCount = counts[num];
    }
  }
  
  return Object.keys(counts)
    .map(Number)
    .filter((num) => counts[num] === maxCount);
}

/**
 * Calculate the standard deviation of an array of numbers
 * @param nums - The array of numbers
 * @returns The standard deviation of the numbers
 */
export function standardDeviation(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;
  
  const avg = average(nums);
  const squareDiffs = nums.map((num) => Math.pow(num - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate the variance of an array of numbers
 * @param nums - The array of numbers
 * @returns The variance of the numbers
 */
export function variance(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;
  
  const avg = average(nums);
  const squareDiffs = nums.map((num) => Math.pow(num - avg, 2));
  
  return average(squareDiffs);
}
