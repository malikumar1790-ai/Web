// Comprehensive testing utilities for the website
export class TestRunner {
  private results: { [key: string]: { passed: boolean; message: string; duration: number } } = {};

  async runAllTests(): Promise<{ passed: number; failed: number; results: any }> {
    console.log('🧪 Starting comprehensive website tests...');
    
    const tests = [
      { name: 'Database Connection', test: this.testDatabaseConnection },
      { name: 'Email Service', test: this.testEmailService },
      { name: 'Contact Form', test: this.testContactForm },
      { name: 'Project Builder', test: this.testProjectBuilder },
      { name: 'Job Applications', test: this.testJobApplications },
      { name: 'File Upload', test: this.testFileUpload },
      { name: 'API Endpoints', test: this.testAPIEndpoints },
      { name: 'Performance', test: this.testPerformance },
      { name: 'Accessibility', test: this.testAccessibility },
      { name: 'Security', test: this.testSecurity }
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.test);
    }

    const passed = Object.values(this.results).filter(r => r.passed).length;
    const failed = Object.values(this.results).filter(r => !r.passed).length;

    console.log(`🧪 Tests completed: ${passed} passed, ${failed} failed`);
    
    return { passed, failed, results: this.results };
  }

  private async runTest(name: string, testFn: () => Promise<boolean>) {
    const startTime = performance.now();
    
    try {
      console.log(`🔍 Running test: ${name}`);
      const result = await testFn.call(this);
      const duration = performance.now() - startTime;
      
      this.results[name] = {
        passed: result,
        message: result ? 'Test passed' : 'Test failed',
        duration
      };
      
      console.log(`${result ? '✅' : '❌'} ${name}: ${result ? 'PASSED' : 'FAILED'} (${duration.toFixed(2)}ms)`);
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results[name] = {
        passed: false,
        message: error instanceof Error ? error.message : 'Test error',
        duration
      };
      
      console.error(`❌ ${name}: ERROR - ${error} (${duration.toFixed(2)}ms)`);
    }
  }

  private async testDatabaseConnection(): Promise<boolean> {
    try {
      const { testDatabaseConnection } = await import('../lib/supabase');
      return await testDatabaseConnection();
    } catch (error) {
      console.error('Database test failed:', error);
      return false;
    }
  }

  private async testEmailService(): Promise<boolean> {
    try {
      const response = await fetch('/api/health-check');
      const result = await response.json();
      return result.data?.services?.email?.status === 'healthy';
    } catch (error) {
      console.error('Email service test failed:', error);
      return false;
    }
  }

  private async testContactForm(): Promise<boolean> {
    try {
      // Test form validation
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message for validation'
      };

      const { FormValidator } = await import('./formValidation');
      const validation = FormValidator.validateContactForm(testData);
      
      return validation.isValid;
    } catch (error) {
      console.error('Contact form test failed:', error);
      return false;
    }
  }

  private async testProjectBuilder(): Promise<boolean> {
    try {
      const testData = {
        projectType: 'chatbot',
        industry: 'Healthcare',
        budget: '$15,000 - $50,000',
        timeline: '2-4 months',
        contactInfo: {
          name: 'Test User',
          email: 'test@example.com',
          company: 'Test Company'
        }
      };

      const { FormValidator } = await import('./formValidation');
      const validation = FormValidator.validateProjectForm(testData);
      
      return validation.isValid;
    } catch (error) {
      console.error('Project builder test failed:', error);
      return false;
    }
  }

  private async testJobApplications(): Promise<boolean> {
    try {
      const testData = {
        full_name: 'Test Candidate',
        email: 'candidate@example.com',
        cover_letter: 'This is a test cover letter with sufficient length to pass validation requirements.'
      };

      const { FormValidator } = await import('./formValidation');
      const validation = FormValidator.validateJobApplication(testData);
      
      return validation.isValid;
    } catch (error) {
      console.error('Job application test failed:', error);
      return false;
    }
  }

  private async testFileUpload(): Promise<boolean> {
    try {
      // Create a mock file for testing
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      const { FormValidator } = await import('./formValidation');
      const validation = FormValidator.validateFile(
        mockFile, 
        ['application/pdf'], 
        5
      );
      
      return validation.isValid;
    } catch (error) {
      console.error('File upload test failed:', error);
      return false;
    }
  }

  private async testAPIEndpoints(): Promise<boolean> {
    try {
      const endpoints = ['/api/health-check'];
      
      for (const endpoint of endpoints) {
        const response = await fetch(endpoint);
        if (!response.ok && response.status !== 405) { // 405 is acceptable for wrong method
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('API endpoints test failed:', error);
      return false;
    }
  }

  private async testPerformance(): Promise<boolean> {
    try {
      // Test if performance API is available
      if (!('performance' in window)) return false;
      
      // Check if page load time is reasonable
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        return loadTime < 5000; // Less than 5 seconds
      }
      
      return true;
    } catch (error) {
      console.error('Performance test failed:', error);
      return false;
    }
  }

  private async testAccessibility(): Promise<boolean> {
    try {
      // Check for basic accessibility features
      const hasSkipNav = !!document.querySelector('#skip-nav');
      const hasMainContent = !!document.querySelector('#main-content');
      const hasAriaLabels = document.querySelectorAll('[aria-label]').length > 0;
      const hasAltText = Array.from(document.querySelectorAll('img')).every(img => 
        img.hasAttribute('alt')
      );
      
      return hasSkipNav && hasMainContent && hasAriaLabels && hasAltText;
    } catch (error) {
      console.error('Accessibility test failed:', error);
      return false;
    }
  }

  private async testSecurity(): Promise<boolean> {
    try {
      // Check for security headers and measures
      const hasCSP = !!document.querySelector('meta[name="X-Content-Type-Options"]');
      const hasSecureHeaders = !!document.querySelector('meta[name="X-Frame-Options"]');
      
      // Test input sanitization
      const { SecurityManager } = await import('./security');
      const testInput = '<script>alert("test")</script>';
      const sanitized = SecurityManager.sanitizeHTML(testInput);
      const isSanitized = !sanitized.includes('<script>');
      
      return hasCSP && hasSecureHeaders && isSanitized;
    } catch (error) {
      console.error('Security test failed:', error);
      return false;
    }
  }

  generateReport(): string {
    const passed = Object.values(this.results).filter(r => r.passed).length;
    const total = Object.keys(this.results).length;
    const percentage = Math.round((passed / total) * 100);

    let report = `
# Website Test Report
Generated: ${new Date().toISOString()}

## Overall Score: ${passed}/${total} (${percentage}%)

## Test Results:
`;

    Object.entries(this.results).forEach(([name, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const duration = result.duration.toFixed(2);
      report += `- ${status} ${name} (${duration}ms): ${result.message}\n`;
    });

    report += `
## Recommendations:
${percentage >= 90 ? '🎉 Excellent! Your website is production-ready.' : ''}
${percentage >= 80 && percentage < 90 ? '✅ Good! Address remaining issues for optimal performance.' : ''}
${percentage >= 70 && percentage < 80 ? '⚠️ Fair! Several improvements needed before production.' : ''}
${percentage < 70 ? '❌ Poor! Critical issues must be resolved before deployment.' : ''}
`;

    return report;
  }
}

// Auto-run tests in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    setTimeout(async () => {
      const testRunner = new TestRunner();
      const results = await testRunner.runAllTests();
      console.log('📊 Test Report:', testRunner.generateReport());
    }, 2000);
  });
}

export default TestRunner;