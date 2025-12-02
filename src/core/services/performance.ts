
import {
  PerformanceMetricsStore,
  PerformanceObserverManager,
  WebVitals,
  initializeDefaultThresholds,
  getPerformanceGrade,
} from '@/core/performance/core';
import { debugLog, logGroup, logGroupEnd } from '@/shared/utils/logger';

class PerformanceService {
  private store: PerformanceMetricsStore;
  private observerManager: PerformanceObserverManager;
  private webVitals: WebVitals;
  private observerId: string | null = null;

  constructor() {
    this.store = new PerformanceMetricsStore();
    this.observerManager = new PerformanceObserverManager(this.store);
    this.webVitals = new WebVitals(this.store);

    initializeDefaultThresholds(this.store);
  }

  init() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observerId = this.observerManager.startObserving({
        entryTypes: [
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
          'navigation',
        ],
      });

      // Kick off key Web Vitals measurements (non-blocking)
      void this.webVitals.measureLCP().catch(() => {});
      void this.webVitals.measureFID().catch(() => {});
      void this.webVitals.measureCLS().catch(() => {});
      void this.webVitals.measureTTFB().catch(() => {});
    }
  }

  trackApiCall(endpoint: string, startTime: number, endTime: number): void {
    this.store.trackApiCall(endpoint, startTime, endTime);
  }

  trackRenderTime(componentName: string, renderTime: number): void {
    this.store.trackRenderTime(componentName, renderTime);
  }

  getMetrics() {
    return this.store.getUnifiedSnapshot();
  }

  logPerformanceReport() {
    const snapshot = this.getMetrics();
    const coreWebVitals = getPerformanceGrade(this.store);

    logGroup('🚀 SpendThrone Unified Performance Report');
    debugLog('📊 Core Web Vitals:', coreWebVitals);
    debugLog('⏱️ Page & Paint Metrics:', {
      LCP: snapshot.metrics.LCP,
      FID: snapshot.metrics.FID,
      CLS: snapshot.metrics.CLS,
      TTFB: snapshot.metrics.TTFB,
    });
    debugLog('🔗 API Performance:', snapshot.apiInsights);
    debugLog('🎨 Render Times:', this.store.getRenderTimes());
    logGroupEnd();
  }

  disconnect() {
    if (this.observerId) {
      this.observerManager.stopObserving(this.observerId);
      this.observerId = null;
    }
    this.store.clear();
  }
}

export const performanceService = new PerformanceService();

