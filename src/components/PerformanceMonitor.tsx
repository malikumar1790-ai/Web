import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    const isDev = import.meta.env.DEV;
    setIsVisible(isDev);

    if (isDev) {
      measurePerformance();
    }
  }, []);

  const measurePerformance = () => {
    // Wait for page to load
    if (document.readyState === 'loading') {
      window.addEventListener('load', measurePerformance);
      return;
    }

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart
      }));
    }

    // Observe Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            firstContentfulPaint: fcp.startTime
          }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lcp.startTime
          }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: clsValue
          }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fid = entries[0] as PerformanceEventTiming;
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: fid.processingStart - fid.startTime
          }));
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }
  };

  const getScoreColor = (metric: string, value: number): string => {
    const thresholds = {
      firstContentfulPaint: { good: 1800, poor: 3000 },
      largestContentfulPaint: { good: 2500, poor: 4000 },
      firstInputDelay: { good: 100, poor: 300 },
      cumulativeLayoutShift: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-400';

    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatMetric = (value: number, unit: string): string => {
    if (unit === 'ms') {
      return `${Math.round(value)}ms`;
    }
    if (unit === 's') {
      return `${(value / 1000).toFixed(2)}s`;
    }
    return value.toFixed(3);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 max-w-xs">
      <div className="flex items-center space-x-2 mb-3">
        <Activity className="h-4 w-4 text-blue-400" />
        <h3 className="text-white font-semibold text-sm">Performance</h3>
      </div>

      <div className="space-y-2">
        {metrics.firstContentfulPaint && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">FCP</span>
            <span className={`text-xs font-mono ${getScoreColor('firstContentfulPaint', metrics.firstContentfulPaint)}`}>
              {formatMetric(metrics.firstContentfulPaint, 'ms')}
            </span>
          </div>
        )}

        {metrics.largestContentfulPaint && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">LCP</span>
            <span className={`text-xs font-mono ${getScoreColor('largestContentfulPaint', metrics.largestContentfulPaint)}`}>
              {formatMetric(metrics.largestContentfulPaint, 'ms')}
            </span>
          </div>
        )}

        {metrics.firstInputDelay && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">FID</span>
            <span className={`text-xs font-mono ${getScoreColor('firstInputDelay', metrics.firstInputDelay)}`}>
              {formatMetric(metrics.firstInputDelay, 'ms')}
            </span>
          </div>
        )}

        {metrics.cumulativeLayoutShift !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">CLS</span>
            <span className={`text-xs font-mono ${getScoreColor('cumulativeLayoutShift', metrics.cumulativeLayoutShift)}`}>
              {formatMetric(metrics.cumulativeLayoutShift, '')}
            </span>
          </div>
        )}

        {metrics.pageLoadTime && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">Load</span>
            <span className="text-xs font-mono text-blue-400">
              {formatMetric(metrics.pageLoadTime, 'ms')}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">Monitoring active</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;