import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { logError } from './logger';

/**
 * Formats a Unix timestamp into a relative time string (e.g., "about 2 hours ago").
 * @param ts The Unix timestamp in seconds.
 * @returns A formatted relative time string.
 */
export const formatTimeAgo = (ts: number): string => {
  if (ts <= 0) {
    return 'Just now';
  }

  try {
    const date = fromUnixTime(ts);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    logError('Error formatting time ago:', error);
    return 'Invalid date';
  }
};

/**
 * Checks if a relative time string represents a time within the last 24 hours.
 * @param timeAgo The relative time string (e.g., "2 hours ago", "just now").
 * @returns True if the time is within the last 24 hours, false otherwise.
 */
export const isRecentTimeString = (timeAgo: string): boolean => {
  if (!timeAgo || typeof timeAgo !== 'string') return false;

  // Handle relative time strings like "2 hours ago", "just now", etc.
  const lowerTimeAgo = timeAgo.toLowerCase();

  // Check for very recent indicators
  if (lowerTimeAgo.includes('just now') ||
    lowerTimeAgo.includes('seconds') ||
    lowerTimeAgo.includes('minute') ||
    lowerTimeAgo.includes('hour') && !lowerTimeAgo.includes('24')) {
    return true;
  }

  // Check for "X hours ago" where X < 24
  const hoursMatch = lowerTimeAgo.match(/(\d+)\s*hours?\s*ago/);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10);
    return hours < 24;
  }

  return false;
};
