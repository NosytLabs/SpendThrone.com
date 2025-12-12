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


