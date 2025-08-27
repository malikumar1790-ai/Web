// Advanced Performance Optimization Utilities
// This file contains utilities to boost website speed and Core Web Vitals

// 1. Image Lazy Loading with Intersection Observer
export class LazyImageLoader {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    }
  }

  observe(img: HTMLImageElement) {
    this.observer.observe(img);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

// 2. Resource Preloading Manager
export class ResourcePreloader {
  private preloadedResources = new Set<string>();

  preloadImage(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  preloadFont(fontUrl: string) {
    if (this.preloadedResources.has(fontUrl)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = fontUrl;
    document.head.appendChild(link);
    
    this.preloadedResources.add(fontUrl);
  }

  preloadCSS(cssUrl: string) {
    if (this.preloadedResources.has(cssUrl)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = cssUrl;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
    
    this.preloadedResources.add(cssUrl);
  }
}

// 3. Critical CSS Injector
export class CriticalCSSManager {
  private criticalCSS = `
    /* Critical above-the-fold styles */
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .critical-header { position: fixed; top: 0; width: 100%; z-index: 1000; background: rgba(0,0,0,0.95); }
    .critical-hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .critical-loading { opacity: 0; animation: fadeIn 0.3s ease-in-out forwards; }
    @keyframes fadeIn { to { opacity: 1; } }
  `;

  injectCriticalCSS() {
    if (document.querySelector('#critical-css')) return;

    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = this.criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  removeCriticalCSS() {
    const critical = document.querySelector('#critical-css');
    if (critical) {
      critical.remove();
    }
  }
}

// 4. Web Vitals Optimizer
export class WebVitalsOptimizer {
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.initPerformanceMonitoring();
  }

  private initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.handlePerformanceEntry(entry);
        });
      });

      try {
        this.performanceObserver.observe({ 
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not fully supported');
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.optimizeLCP(entry);
        break;
      case 'first-input':
        this.optimizeFID(entry as PerformanceEventTiming);
        break;
      case 'layout-shift':
        this.optimizeCLS(entry as any);
        break;
    }
  }

  private optimizeLCP(entry: PerformanceEntry) {
    if (entry.startTime > 2500) {
      console.warn('LCP is slow, optimizing...');
      this.preloadCriticalResources();
    }
  }

  private optimizeFID(entry: PerformanceEventTiming) {
    if (entry.processingStart - entry.startTime > 100) {
      console.warn('FID is slow, optimizing...');
      this.deferNonCriticalScripts();
    }
  }

  private optimizeCLS(entry: any) {
    if (entry.value > 0.1) {
      console.warn('CLS detected, optimizing...');
      this.stabilizeLayout();
    }
  }

  private preloadCriticalResources() {
    // Preload hero image
    const heroImg = document.querySelector('[data-critical-img]') as HTMLImageElement;
    if (heroImg && heroImg.dataset.src) {
      heroImg.src = heroImg.dataset.src;
    }

    // Preload critical fonts
  this.preloadFont('/assets/fonts/Inter-Regular.woff2');
  }

  private deferNonCriticalScripts() {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('src') || '';
      newScript.defer = true;
      script.replaceWith(newScript);
    });
  }

  private stabilizeLayout() {
    // Add dimension attributes to images without them
    const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
      const image = img as HTMLImageElement;
      if (image.naturalWidth && image.naturalHeight) {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
      }
    });

    // Reserve space for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
  dynamicElements.forEach(el => {
      const element = el as HTMLElement;
      if (!element.style.minHeight) {
        element.style.minHeight = '200px';
      }
    });
  }

  private preloadFont(url: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  }

  disconnect() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// 5. Bundle Splitting and Code Splitting Helper
export class CodeSplittingManager {
  private loadedChunks = new Set<string>();

  async loadComponent(componentName: string) {
    if (this.loadedChunks.has(componentName)) {
      return;
    }

    try {
      switch (componentName) {
        case 'Portfolio':
          await import('../pages/Portfolio');
          break;
        case 'Services':
          await import('../pages/Services');
          break;
        case 'Contact':
          await import('../pages/Contact');
          break;
        case 'About':
          await import('../pages/About');
          break;
        default:
          console.warn(`Unknown component: ${componentName}`);
      }
      this.loadedChunks.add(componentName);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }

  preloadRoute(routeName: string) {
    // Preload components for faster navigation
    requestIdleCallback(() => {
      this.loadComponent(routeName);
    });
  }
}

// 6. Service Worker Manager for Caching
export class ServiceWorkerManager {
  async register() {
    // Skip service worker registration in development or when explicitly disabled
    const isDev = import.meta.env.DEV;
    const isDisabled = import.meta.env.VITE_DISABLE_SERVICE_WORKER === 'true';
    
    if ('serviceWorker' in navigator && !isDev && !isDisabled) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registered:', registration);
        
        registration.addEventListener('updatefound', () => {
          console.log('New Service Worker version available');
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.log('Service Worker registration skipped (development mode or disabled)');
    }
  }

  async checkForUpdates() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  }
}

// 7. Performance Monitoring
export class PerformanceMonitor {
  private metrics: Record<string, number> = {};

  startTiming(name: string) {
    this.metrics[`${name}_start`] = performance.now();
  }

  endTiming(name: string) {
    const start = this.metrics[`${name}_start`];
    if (start) {
      const duration = performance.now() - start;
      this.metrics[name] = duration;
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
      
      // Send to analytics if available
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', 'timing_complete', {
  //     name: name,
  //     value: Math.round(duration)
  //   });
  // }
    }
  }

  getMetrics() {
    return this.metrics;
  }

  logNavigationTiming() {
    if ('performance' in window) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) {
        console.log('📊 Navigation Timing:', {
          'DNS Lookup': nav.domainLookupEnd - nav.domainLookupStart,
          'TCP Connection': nav.connectEnd - nav.connectStart,
          'Server Response': nav.responseEnd - nav.requestStart,
          'DOM Processing': nav.domContentLoadedEventEnd - nav.responseEnd,
          'Total Load Time': nav.loadEventEnd - nav.startTime
        });
      }
    }
  }
}

// 8. Initialize All Performance Optimizations
export class PerformanceOptimizer {
  private lazyLoader: LazyImageLoader;
  private preloader: ResourcePreloader;
  private cssManager: CriticalCSSManager;
  private vitalsOptimizer: WebVitalsOptimizer;
  private codeSplitting: CodeSplittingManager;
  private serviceWorker: ServiceWorkerManager;
  private monitor: PerformanceMonitor;

  constructor() {
    this.lazyLoader = new LazyImageLoader();
    this.preloader = new ResourcePreloader();
    this.cssManager = new CriticalCSSManager();
    this.vitalsOptimizer = new WebVitalsOptimizer();
    this.codeSplitting = new CodeSplittingManager();
    this.serviceWorker = new ServiceWorkerManager();
    this.monitor = new PerformanceMonitor();
  }

  init() {
    this.monitor.startTiming('performance_init');
    
    // Inject critical CSS immediately
    this.cssManager.injectCriticalCSS();
    
    // Setup lazy loading
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalAssets();
    
    // Register service worker
    this.serviceWorker.register();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    this.monitor.endTiming('performance_init');
    
    console.log('🚀 Performance optimizations initialized!');
  }

  private setupLazyLoading() {
    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => {
      this.lazyLoader.observe(img as HTMLImageElement);
    });
  }

  private preloadCriticalAssets() {
    // Preload logo
    this.preloader.preloadImage('/assets/logos/nexariza-logo.svg');
    
    // Preload critical fonts
  this.preloader.preloadFont('/assets/fonts/Inter-Regular.woff2');
    
    // Preload critical pages
    this.codeSplitting.preloadRoute('Services');
    this.codeSplitting.preloadRoute('Contact');
  }

  private setupPerformanceMonitoring() {
    // Monitor navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.monitor.logNavigationTiming();
      }, 1000);
    });

    // Monitor route changes
    window.addEventListener('popstate', () => {
      this.monitor.startTiming('route_change');
      setTimeout(() => {
        this.monitor.endTiming('route_change');
      }, 100);
    });
  }

  getMonitor() {
    return this.monitor;
  }

  cleanup() {
    this.lazyLoader.disconnect();
    this.vitalsOptimizer.disconnect();
  }
}

// Initialize performance optimizer when the script loads
export const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceOptimizer.init();
    });
  } else {
    performanceOptimizer.init();
  }
}
