import React, { useEffect } from 'react';

interface AccessibilityEnhancerProps {
  children: React.ReactNode;
}

const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({ children }) => {
  useEffect(() => {
    // Add skip navigation link
    addSkipNavigation();
    
    // Enhance focus management
    enhanceFocusManagement();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Enhance ARIA labels
    enhanceARIALabels();
    
    // Add screen reader announcements
    addScreenReaderSupport();
  }, []);

  const addSkipNavigation = () => {
    if (document.querySelector('#skip-nav')) return;

    const skipNav = document.createElement('a');
    skipNav.id = 'skip-nav';
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg';
    
    document.body.insertBefore(skipNav, document.body.firstChild);
  };

  const enhanceFocusManagement = () => {
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
      .focus-enhanced:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
    `;
    document.head.appendChild(style);

    // Add focus-enhanced class to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    interactiveElements.forEach(element => {
      element.classList.add('focus-enhanced');
    });
  };

  const addKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('[data-modal="open"]');
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('[data-close]') as HTMLElement;
          closeButton?.click();
        });
      }

      // Tab navigation enhancement
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  };

  const enhanceARIALabels = () => {
    // Add ARIA labels to elements missing them
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach((button, index) => {
      const text = button.textContent?.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      } else {
        button.setAttribute('aria-label', `Button ${index + 1}`);
      }
    });

    // Add ARIA labels to form inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
        if (!label.id) {
          label.id = `label-${input.id}`;
        }
      } else {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
          input.setAttribute('aria-label', placeholder);
        }
      }
    });

    // Add ARIA roles to navigation
    const navs = document.querySelectorAll('nav:not([role])');
    navs.forEach(nav => {
      nav.setAttribute('role', 'navigation');
    });
  };

  const addScreenReaderSupport = () => {
    // Create live region for announcements
    if (!document.querySelector('#sr-announcements')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'sr-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Add form submission announcements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        announceToScreenReader('Form submitted. Please wait for confirmation.');
      });
    });
  };

  const announceToScreenReader = (message: string) => {
    const liveRegion = document.querySelector('#sr-announcements');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  return <>{children}</>;
};

export default AccessibilityEnhancer;