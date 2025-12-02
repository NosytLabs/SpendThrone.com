/**
 * Performance monitoring type definitions
 */

/**
 * Supported performance metric names
 */
export type MetricName = 
  | 'FCP'    // First Contentful Paint
  | 'LCP'    // Largest Contentful Paint
  | 'FID'    // First Input Delay
  | 'CLS'    // Cumulative Layout Shift
  | 'TTFB'   // Time to First Byte
  | 'INP'    // Interaction to Next Paint
  | 'custom'; // Custom metrics

/**
 * Performance metric value type
 */
export type MetricValue = number;

/**
 * Extended PerformanceEntry interface for Web Vitals
 */
export interface WebVitalsEntry extends PerformanceEntry {
  processingStart?: number;
  hadRecentInput?: boolean;
  value?: number;
  responseStart?: number;
  requestStart?: number;
}

/**
 * Layout shift entry interface
 */
export interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Navigation timing entry interface
 */
export interface NavigationTimingEntry extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

/**
 * First input delay entry interface
 */
export interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}