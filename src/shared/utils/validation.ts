/**
 * Input validation and sanitization utilities
 * Implements security best practices for user input handling
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * XSS Prevention: Remove dangerous HTML/script tags
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<\s*\w[^>]*>/gi, '')
    .trim();
};

/**
 * Validate and sanitize display names
 */
export const validateDisplayName = (input: string): ValidationResult => {
  const sanitized = sanitizeHtml(input.trim());
  
  if (!sanitized || sanitized.length === 0) {
    return { isValid: false, error: 'Display name cannot be empty' };
  }
  
  if (sanitized.length > 20) {
    return { isValid: false, error: 'Display name must be 20 characters or less' };
  }
  
  if (/[^\w\s\-_]/g.test(sanitized)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validate and sanitize messages
 */
export const validateMessage = (input: string, maxLength: number = 64): ValidationResult => {
  const sanitized = sanitizeHtml(input.trim());
  
  if (sanitized.length > maxLength) {
    return { isValid: false, error: `Message must be ${maxLength} characters or less` };
  }
  
  // Check for excessive special characters that might indicate spam
  const specialCharRatio = (sanitized.match(/[^\w\s]/g) || []).length / sanitized.length;
  if (specialCharRatio > 0.5 && sanitized.length > 10) {
    return { isValid: false, error: 'Message contains too many special characters' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validate URLs with strict security checks
 */
export const validateUrl = (input: string): ValidationResult => {
  if (!input.trim()) {
    return { isValid: true, sanitized: '' }; // Optional field
  }
  
  try {
    const url = new URL(input.trim());
    
    // Whitelist allowed protocols
    const allowedProtocols = ['https:', 'http:'];
    if (!allowedProtocols.includes(url.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    
    // Block localhost and private IPs to prevent SSRF
    const hostname = url.hostname.toLowerCase();
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || 
        hostname.startsWith('192.168.') || 
        hostname.startsWith('10.') || 
        hostname.startsWith('172.') ||
        hostname.startsWith('169.254.') ||
        hostname.endsWith('.local')) {
      return { isValid: false, error: 'Private/local URLs are not allowed' };
    }
    
    // Block common dangerous domains
    const dangerousDomains = ['file://', 'ftp://', 'ssh://', 'telnet://'];
    if (dangerousDomains.some(domain => input.includes(domain))) {
      return { isValid: false, error: 'Dangerous URL protocols are not allowed' };
    }
    
    return { isValid: true, sanitized: url.toString() };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate payment amounts
 */
export const validatePaymentAmount = (input: string, maxAmount: number = 1000000): ValidationResult => {
  const sanitized = input.trim();
  
  if (!sanitized) {
    return { isValid: false, error: 'Amount cannot be empty' };
  }
  
  const amount = parseFloat(sanitized);
  
  if (isNaN(amount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }
  
  if (amount > maxAmount) {
    return { isValid: false, error: `Amount cannot exceed ${maxAmount}` };
  }
  
  // Check for excessive decimal places (prevent precision attacks)
  if (sanitized.includes('.') && sanitized.split('.')[1].length > 9) {
    return { isValid: false, error: 'Amount has too many decimal places' };
  }
  
  return { isValid: true, sanitized: amount.toString() };
};

