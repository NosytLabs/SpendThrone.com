import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  formatString: string = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date string or Date object to a time format
 * @param date - The date to format
 * @param formatString - The format string (default: 'h:mm a')
 * @returns Formatted time string
 */
export function formatTime(
  date: string | Date,
  formatString: string = 'h:mm a'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid time';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date string or Date object to a date and time format
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMM d, yyyy h:mm a')
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: string | Date,
  formatString: string = 'MMM d, yyyy h:mm a'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date/time';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date as relative time from now (e.g., "2 hours ago")
 * @param date - The date to format
 * @param addSuffix - Whether to add suffix (default: true)
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: string | Date,
  addSuffix: boolean = true
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return formatDistanceToNow(dateObj, { addSuffix });
}

/**
 * Format a date as ISO string
 * @param date - The date to format
 * @returns ISO string
 */
export function formatISODate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return dateObj.toISOString();
}

/**
 * Format a date as YYYY-MM-DD
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Format a date as MM/DD/YYYY
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateUS(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, 'MM/dd/yyyy');
}

/**
 * Format a date as DD/MM/YYYY
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateInternational(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, 'dd/MM/yyyy');
}

/**
 * Format a date with day of week
 * @param date - The date to format
 * @param formatString - The format string (default: 'EEEE, MMM d, yyyy')
 * @returns Formatted date string with day of week
 */
export function formatDateWithDayOfWeek(
  date: string | Date,
  formatString: string = 'EEEE, MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date with short month name
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMM d, yyyy')
 * @returns Formatted date string with short month
 */
export function formatDateWithShortMonth(
  date: string | Date,
  formatString: string = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date with long month name
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMMM d, yyyy')
 * @returns Formatted date string with long month
 */
export function formatDateWithLongMonth(
  date: string | Date,
  formatString: string = 'MMMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date as a month and year
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMMM yyyy')
 * @returns Formatted month and year string
 */
export function formatMonthYear(
  date: string | Date,
  formatString: string = 'MMMM yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date as a year
 * @param date - The date to format
 * @returns Formatted year string
 */
export function formatYear(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, 'yyyy');
}

/**
 * Format a date as a short date (no year)
 * @param date - The date to format
 * @param formatString - The format string (default: 'MMM d')
 * @returns Formatted short date string
 */
export function formatShortDate(
  date: string | Date,
  formatString: string = 'MMM d'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date as a very short date (numeric)
 * @param date - The date to format
 * @param formatString - The format string (default: 'M/d')
 * @returns Formatted very short date string
 */
export function formatVeryShortDate(
  date: string | Date,
  formatString: string = 'M/d'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  return format(dateObj, formatString);
}

/**
 * Format a date as a time ago string (e.g., "5 minutes ago")
 * @param date - The date to format
 * @returns Time ago string
 */
export function formatTimeAgo(date: string | Date): string {
  return formatRelativeTime(date, true);
}

/**
 * Format a date as a time from now string (e.g., "in 5 minutes")
 * @param date - The date to format
 * @returns Time from now string
 */
export function formatTimeFromNow(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  
  if (diffMs < 0) {
    return formatRelativeTime(date, true);
  }
  
  return formatRelativeTime(date, false).replace(/ ago$/, '');
}

/**
 * Format a date range
 * @param startDate - The start date
 * @param endDate - The end date
 * @param formatString - The format string (default: 'MMM d')
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date,
  formatString: string = 'MMM d'
): string {
  const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(startDateObj) || !isValid(endDateObj)) {
    return 'Invalid date range';
  }
  
  const startFormatted = format(startDateObj, formatString);
  const endFormatted = format(endDateObj, formatString);
  
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Format a date range with years
 * @param startDate - The start date
 * @param endDate - The end date
 * @param formatString - The format string (default: 'MMM d, yyyy')
 * @returns Formatted date range string with years
 */
export function formatDateRangeWithYears(
  startDate: string | Date,
  endDate: string | Date,
  formatString: string = 'MMM d, yyyy'
): string {
  const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(startDateObj) || !isValid(endDateObj)) {
    return 'Invalid date range';
  }
  
  const startFormatted = format(startDateObj, formatString);
  const endFormatted = format(endDateObj, formatString);
  
  return `${startFormatted} - ${endFormatted}`;
}