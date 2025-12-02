import type {
  MetricName,
  LayoutShiftEntry,
  NavigationTimingEntry,
  FirstInputEntry
} from './types';
import { debugLog, debugWarn, logError } from '@/shared/utils/logger';

/**
 * Unified Performance Monitoring Types
 * Canonical types re-exported for use across the app.
 */
export interface ApiPerformanceInsight {
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  callCount: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface CoreWebVitalsAssessment {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

export interface UnifiedPerformanceSnapshot {
  metrics: Record<string, number>;
  apiInsights: Record<string, ApiPerformanceInsight>;
  coreWebVitals: CoreWebVitalsAssessment;
}

/**
 * Performance Observer types for monitoring different metrics
 */
export interface PerformanceObserverConfig {
  /**
   * Types of metrics to observe
   */
  entryTypes: string[];
  /**
   * Callback function when metrics are recorded
   */
  onMetric?: (metric: PerformanceEntry) => void;
  /**
   * Callback function when observer reports buffered entries
   */
  onBuffered?: (entries: PerformanceEntry[]) => void;
}

/**
 * Web Vitals measurement configuration
 */
export interface WebVitalsConfig {
  /**
   * ID to group related metrics
   */
  id?: string;
  /**
   * Report all changes (not just improvements)
   */
  reportAllChanges?: boolean;
  /**
   * Enable analytics tracking
   */
  analytics?: boolean;
}

/**
 * Performance metrics store
 */
export class PerformanceMetricsStore {
  private metrics: Map<string, number> = new Map();
  private thresholds: Map<string, number> = new Map();

  // Extended maps for API and render/component metrics to unify previous utilities
  private apiResponseTimes: Map<string, number[]> = new Map();
  private renderTimes: Map<string, number> = new Map();

  /**
   * Set a performance metric value
   */
  setMetric(name: MetricName, value: number): void {
    this.metrics.set(name, value);
  }

  /**
   * Get a performance metric value
   */
  getMetric(name: MetricName): number | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all current scalar metrics
   */
  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, startTime: number, endTime: number): void {
    const duration = endTime - startTime;
    if (!this.apiResponseTimes.has(endpoint)) {
      this.apiResponseTimes.set(endpoint, []);
    }
    this.apiResponseTimes.get(endpoint)!.push(duration);
  }

  /**
   * Track component render time (latest render duration)
   */
  trackRenderTime(componentName: string, renderTime: number): void {
    this.renderTimes.set(componentName, renderTime);
  }

  /**
   * Get API performance insights (compatible with legacy performanceMonitor)
   */
  getApiPerformanceInsights(): Record<string, ApiPerformanceInsight> {
    const insights: Record<string, ApiPerformanceInsight> = {};
    this.apiResponseTimes.forEach((times, endpoint) => {
      if (!times.length) return;
      const averageResponseTime = times.reduce((sum, t) => sum + t, 0) / times.length;
      const maxResponseTime = Math.max(...times);
      const minResponseTime = Math.min(...times);
      const rating: ApiPerformanceInsight['rating'] =
        averageResponseTime <= 500
          ? 'good'
          : averageResponseTime <= 1000
          ? 'needs-improvement'
          : 'poor';

      insights[endpoint] = {
        averageResponseTime,
        maxResponseTime,
        minResponseTime,
        callCount: times.length,
        rating,
      };
    });
    return insights;
  }

  /**
   * Get component render times
   */
  getRenderTimes(): Record<string, number> {
    return Object.fromEntries(this.renderTimes);
  }

  /**
   * Set performance threshold for a metric
   */
  setThreshold(name: MetricName, threshold: number): void {
    this.thresholds.set(name, threshold);
  }

  /**
   * Check if metric meets threshold
   */
  meetsThreshold(name: MetricName): boolean {
    const value = this.getMetric(name);
    const threshold = this.thresholds.get(name);
    
    if (value === undefined || threshold === undefined) {
      return false;
    }

    // Lower is better for most performance metrics
    return value <= threshold;
  }

  /**
   * Get all threshold violations
   */
  getThresholdViolations(): Record<string, { value: number; threshold: number }> {
    const violations: Record<string, { value: number; threshold: number }> = {};
    
    for (const [name, threshold] of this.thresholds) {
      const value = this.metrics.get(name);
      if (value !== undefined && value > threshold) {
        violations[name] = { value, threshold };
      }
    }
    
    return violations;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.thresholds.clear();
    this.apiResponseTimes.clear();
    this.renderTimes.clear();
  }

  /**
   * Build a unified snapshot of key metrics and insights.
   */
  getUnifiedSnapshot(): UnifiedPerformanceSnapshot {
    return {
      metrics: this.getAllMetrics(),
      apiInsights: this.getApiPerformanceInsights(),
      coreWebVitals: getPerformanceGrade(this).details
        ? {
            lcp: {
              value: this.getMetric('LCP') ?? 0,
              rating: (getPerformanceGrade(this).details.LCP ??
                'needs-improvement') as CoreWebVitalsAssessment['lcp']['rating'],
            },
            fid: {
              value: this.getMetric('FID') ?? 0,
              rating: (getPerformanceGrade(this).details.FID ??
                'needs-improvement') as CoreWebVitalsAssessment['fid']['rating'],
            },
            cls: {
              value: this.getMetric('CLS') ?? 0,
              rating: (getPerformanceGrade(this).details.CLS ??
                'needs-improvement') as CoreWebVitalsAssessment['cls']['rating'],
            },
          }
        : {
            lcp: { value: 0, rating: 'needs-improvement' },
            fid: { value: 0, rating: 'needs-improvement' },
            cls: { value: 0, rating: 'needs-improvement' },
          },
    };
  }
}

/**
 * Performance Observer Manager
 */
export class PerformanceObserverManager {
  private observers: Map<string, PerformanceObserver> = new Map();
  private store: PerformanceMetricsStore;

  constructor(store: PerformanceMetricsStore) {
    this.store = store;
  }

  /**
   * Start observing performance metrics
   */
  startObserving(config: PerformanceObserverConfig): string {
    const observerId = `observer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        // Process each entry
        for (const entry of entries) {
          this.processEntry(entry);
          
          // Call custom metric handler if provided
          if (config.onMetric) {
            config.onMetric(entry);
          }
        }
        
        // Call buffered handler if provided
        if (config.onBuffered) {
          config.onBuffered(entries);
        }
      });
      
      // Start observing specified entry types
      for (const entryType of config.entryTypes) {
        try {
          observer.observe({ type: entryType, buffered: true });
        } catch (error) {
          debugWarn(`Failed to observe ${entryType}:`, error);
        }
      }
      
      this.observers.set(observerId, observer);
      return observerId;
      
    } catch (error) {
      logError('Failed to create performance observer:', error);
      throw error;
    }
  }

  /**
   * Stop observing with specific ID
   */
  stopObserving(observerId: string): void {
    const observer = this.observers.get(observerId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(observerId);
    }
  }

  /**
   * Stop all observers
   */
  stopAll(): void {
    for (const [, observer] of this.observers) {
      observer.disconnect();
    }
    this.observers.clear();
  }

  /**
   * Process a performance entry and update metrics store
   */
  private processEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.store.setMetric('LCP', entry.startTime);
        break;
      case 'first-input': {
        const fidEntry = entry as FirstInputEntry;
        this.store.setMetric('FID', fidEntry.processingStart - fidEntry.startTime);
        break;
      }
      case 'layout-shift': {
        const clsEntry = entry as LayoutShiftEntry;
        if (!clsEntry.hadRecentInput) {
          this.store.setMetric('CLS', (this.store.getMetric('CLS') || 0) + clsEntry.value);
        }
        break;
      }
      case 'navigation': {
        const navEntry = entry as NavigationTimingEntry;
        this.store.setMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
        break;
      }
    }
  }
}

/**
 * Web Vitals measurement utilities
 */
export class WebVitals {
  private store: PerformanceMetricsStore;

  constructor(store: PerformanceMetricsStore) {
    this.store = store;
  }

  /**
   * Measure Largest Contentful Paint (LCP)
   */
  measureLCP(config?: WebVitalsConfig): Promise<number> {
    return new Promise((resolve, reject) => {
      let lcpValue = 0;
      
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry) {
            lcpValue = lastEntry.startTime;
            this.store.setMetric('LCP', lcpValue);
            
            if (config?.analytics) {
              this.reportToAnalytics('LCP', lcpValue, config);
            }
            
            resolve(lcpValue);
            observer.disconnect();
          }
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          if (lcpValue === 0) {
            reject(new Error('LCP measurement timed out'));
          }
        }, 10000);
        
      } catch {
        reject(new Error('LCP measurement failed'));
      }
    });
  }

  /**
   * Measure First Input Delay (FID)
   */
  measureFID(config?: WebVitalsConfig): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const observer = new PerformanceObserver((list) => {
          const firstInput = list.getEntries()[0] as FirstInputEntry;
          
          if (firstInput) {
            const fid = firstInput.processingStart - firstInput.startTime;
            this.store.setMetric('FID', fid);
            
            if (config?.analytics) {
              this.reportToAnalytics('FID', fid, config);
            }
            
            resolve(fid);
            observer.disconnect();
          }
        });
        
        observer.observe({ type: 'first-input', buffered: true });
        
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          reject(new Error('FID measurement timed out'));
        }, 10000);
        
      } catch {
        reject(new Error('FID measurement failed'));
      }
    });
  }

  /**
   * Measure Cumulative Layout Shift (CLS)
   */
  measureCLS(config?: WebVitalsConfig): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as LayoutShiftEntry;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
            }
          }
          
          this.store.setMetric('CLS', clsValue);
          
          if (config?.analytics) {
            this.reportToAnalytics('CLS', clsValue, config);
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        // Report final CLS value
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 5000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Measure Time to First Byte (TTFB)
   */
  measureTTFB(): Promise<number> {
    return new Promise((resolve) => {
      try {
        const observer = new PerformanceObserver((list) => {
          const navigation = list.getEntries()[0] as NavigationTimingEntry;
          const ttfb = navigation.responseStart - navigation.requestStart;
          
          this.store.setMetric('TTFB', ttfb);
          resolve(ttfb);
          observer.disconnect();
        });
        
        observer.observe({ type: 'navigation', buffered: true });
        
      } catch (error) {
        resolve(0); // Fallback to 0 if measurement fails
      }
    });
  }

  /**
   * Report metric to analytics (placeholder for implementation)
   */
  private reportToAnalytics(
    name: string,
    value: number,
    config: WebVitalsConfig
  ): void {
    // Placeholder for analytics implementation
    // This would integrate with Google Analytics, Adobe Analytics, etc.
    debugLog(`Web Vital ${name}: ${value}`, { id: config.id });
  }
}

/**
 * Initialize default performance thresholds
 */
export function initializeDefaultThresholds(store: PerformanceMetricsStore): void {
  store.setThreshold('LCP', 2500); // Good: < 2.5s
  store.setThreshold('FID', 100);  // Good: < 100ms
  store.setThreshold('CLS', 0.1);  // Good: < 0.1
  store.setThreshold('TTFB', 600); // Good: < 600ms
}

/**
 * Get performance grade based on Core Web Vitals
 */
export function getPerformanceGrade(store: PerformanceMetricsStore): {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  details: Record<string, 'good' | 'needs-improvement' | 'poor'>;
} {
  const metrics = store.getAllMetrics();
  const details: Record<string, 'good' | 'needs-improvement' | 'poor'> = {};
  
  // Evaluate each metric
  if (metrics.LCP !== undefined) {
    if (metrics.LCP <= 2500) details.LCP = 'good';
    else if (metrics.LCP <= 4000) details.LCP = 'needs-improvement';
    else details.LCP = 'poor';
  }
  
  if (metrics.FID !== undefined) {
    if (metrics.FID <= 100) details.FID = 'good';
    else if (metrics.FID <= 300) details.FID = 'needs-improvement';
    else details.FID = 'poor';
  }
  
  if (metrics.CLS !== undefined) {
    if (metrics.CLS <= 0.1) details.CLS = 'good';
    else if (metrics.CLS <= 0.25) details.CLS = 'needs-improvement';
    else details.CLS = 'poor';
  }
  
  // Calculate overall grade
  const poorCount = Object.values(details).filter(status => status === 'poor').length;
  const needsImprovementCount = Object.values(details).filter(status => status === 'needs-improvement').length;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (poorCount === 0 && needsImprovementCount === 0) grade = 'A';
  else if (poorCount === 0 && needsImprovementCount <= 1) grade = 'B';
  else if (poorCount <= 1 && needsImprovementCount <= 2) grade = 'C';
  else if (poorCount <= 2) grade = 'D';
  else grade = 'F';
  
  return { grade, details };
}

