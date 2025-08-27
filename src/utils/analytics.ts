// Google Analytics 4 and comprehensive tracking setup for rapid ranking
// This tracking setup helps with user signals that Google uses for ranking

// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics 4
export const initializeGA4 = () => {
  // Load Google Analytics 4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href,
      content_group1: 'AI Development',
      content_group2: 'Business Services',
      send_page_view: true,
      allow_google_signals: true,
      cookie_flags: 'SameSite=None;Secure',
      linker: {
        domains: ['nexariza.com', 'www.nexariza.com']
      }
    });
  `;
  document.head.appendChild(script2);
  
  console.log('📊 Google Analytics 4 initialized for rapid ranking');
};

// Enhanced event tracking for user engagement signals
export const trackUserEngagement = () => {
  // Track scroll depth for engagement signals
  let scrollDepths = [25, 50, 75, 90, 100];
  let trackedDepths = new Set();
  
  const trackScrollDepth = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: `${depth}%`,
            value: depth
          });
        }
      }
    });
  };
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
};

// Track page views with enhanced data
export const trackPageView = (url: string, title: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track events with proper typing
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track contact form submissions
export const trackContactForm = () => {
  trackEvent('contact_form_submit', 'engagement', 'contact_form', 1);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      event_category: 'contact',
      event_label: 'form_submission',
    });
  }
};

// Track language changes
export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', 'user_interaction', language);
};

// Track service inquiries
export const trackServiceInquiry = (service: string) => {
  trackEvent('service_inquiry', 'engagement', service);
};

// Custom event tracking for specific business actions
export const trackBusinessGoals = {
  viewServices: () => trackEvent('view_services', 'business', 'services_page', 50),
  viewPortfolio: () => trackEvent('view_portfolio', 'business', 'portfolio_engagement', 75),
  viewContact: () => trackEvent('view_contact', 'conversion', 'contact_page', 80),
  changeLanguage: (language: string) => trackLanguageChange(language)
};

// Initialize all tracking for rapid ranking
export const initializeRapidRankingTracking = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRapidRankingTracking);
    return;
  }
  
  try {
    initializeGA4();
    trackUserEngagement();
    console.log('🎯 Rapid ranking tracking initialized!');
  } catch (error) {
    console.error('Error initializing tracking:', error);
  }
};

// Auto-initialize tracking
if (typeof window !== 'undefined') {
  initializeRapidRankingTracking();
}
