// Enhanced contact form handler with comprehensive error handling and fallback mechanisms
import { contactService, testDatabaseConnection, type ContactSubmission } from '../lib/supabase';
import { FormValidator } from './formValidation';
import SecurityManager from './security';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  data?: {
    submissionId?: string;
    emailsSent?: number;
    databaseSaved?: boolean;
    fallbackUsed?: boolean;
  };
  error?: string;
}

export class ContactFormHandler {
  private static async validateFormData(data: ContactFormData): Promise<{ isValid: boolean; errors: string[] }> {
    const validation = FormValidator.validateContactForm(data);
    
    // Additional security validation
    const securityErrors: string[] = [];
    
    // Check for suspicious content
    const allFields = [data.name, data.email, data.company, data.phone, data.message, data.service].filter(Boolean);
    const hasSecurityIssue = allFields.some(field => !SecurityManager.validateInput(field));
    
    if (hasSecurityIssue) {
      securityErrors.push('Invalid characters detected in form data');
    }

    // Email validation
    const emailValidation = SecurityManager.validateEmail(data.email);
    if (!emailValidation.isValid) {
      securityErrors.push(emailValidation.reason || 'Invalid email address');
    }

    return {
      isValid: validation.isValid && securityErrors.length === 0,
      errors: [...validation.errors, ...securityErrors]
    };
  }

  private static sanitizeFormData(data: ContactFormData): ContactFormData {
    return SecurityManager.sanitizeFormData(data) as ContactFormData;
  }

  private static async saveToDatabase(data: ContactFormData): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    try {
      console.log('💾 Attempting to save contact form to database...');
      
      // Test connection first
      const isConnected = await testDatabaseConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      const submissionData: ContactSubmission = {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        service: data.service,
        message: data.message
      };

      const result = await contactService.submitContactForm(submissionData);
      console.log('✅ Contact form saved to database:', result.id);
      
      return {
        success: true,
        submissionId: result.id
      };
    } catch (error) {
      console.error('❌ Database save failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database save failed'
      };
    }
  }

  private static async sendEmails(data: ContactFormData): Promise<{ success: boolean; emailsSent?: number; error?: string }> {
    try {
      console.log('📧 Sending contact form emails...');
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Contact form emails sent successfully');
        return {
          success: true,
          emailsSent: result.data?.emailsSent || 2
        };
      } else {
        throw new Error(result.message || 'Email sending failed');
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed'
      };
    }
  }

  private static async fallbackEmailOnly(data: ContactFormData): Promise<SubmissionResult> {
    console.log('⚠️ Using fallback email-only submission...');
    
    const emailResult = await this.sendEmails(data);
    
    if (emailResult.success) {
      return {
        success: true,
        message: 'Message sent successfully via email! Your submission has been received and we\'ll get back to you within 24 hours. Note: Data was not saved to database due to connectivity issues.',
        data: {
          emailsSent: emailResult.emailsSent,
          databaseSaved: false,
          fallbackUsed: true
        }
      };
    } else {
      return {
        success: false,
        message: 'Failed to send message. Please try again or contact us directly at contact@nexariza.com',
        error: emailResult.error
      };
    }
  }

  public static async submitContactForm(data: ContactFormData): Promise<SubmissionResult> {
    try {
      console.log('📝 Processing contact form submission...');
      
      // 1. Validate form data
      const validation = await this.validateFormData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Please correct the following errors: ' + validation.errors.join(', '),
          error: validation.errors.join(', ')
        };
      }

      // 2. Sanitize input data
      const sanitizedData = this.sanitizeFormData(data);
      console.log('✅ Form data validated and sanitized');

      // 3. Check if we're in development mode
      const isDevelopment = import.meta.env.DEV || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';

      if (isDevelopment) {
        console.log('📧 DEVELOPMENT MODE - Contact form submitted:', sanitizedData);
        console.log('✅ In production, this will be saved to database and emails sent');
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          success: true,
          message: 'Development mode: Form submitted successfully! In production, it will be saved to database and emails sent to both admin and user.',
          data: {
            submissionId: `dev-${Date.now()}`,
            emailsSent: 2,
            databaseSaved: true,
            fallbackUsed: false
          }
        };
      }

      // 4. Attempt to save to database first
      const dbResult = await this.saveToDatabase(sanitizedData);
      
      // 5. Send emails
      const emailResult = await this.sendEmails(sanitizedData);

      // 6. Determine final result
      if (dbResult.success && emailResult.success) {
        // Perfect case: both database and email worked
        return {
          success: true,
          message: 'Message sent successfully! Your submission has been saved and we\'ll get back to you within 24 hours. Please check your email for confirmation.',
          data: {
            submissionId: dbResult.submissionId,
            emailsSent: emailResult.emailsSent,
            databaseSaved: true,
            fallbackUsed: false
          }
        };
      } else if (!dbResult.success && emailResult.success) {
        // Database failed but email worked
        console.warn('⚠️ Database save failed but emails sent successfully');
        return {
          success: true,
          message: 'Message sent successfully! Your submission was received via email and we\'ll get back to you within 24 hours. Note: Data backup to database failed but your message is safe.',
          data: {
            emailsSent: emailResult.emailsSent,
            databaseSaved: false,
            fallbackUsed: true
          }
        };
      } else if (dbResult.success && !emailResult.success) {
        // Database worked but email failed
        console.warn('⚠️ Emails failed but data saved to database');
        return {
          success: true,
          message: 'Your submission has been saved successfully! However, email notifications failed. We have your message and will respond within 24 hours.',
          data: {
            submissionId: dbResult.submissionId,
            emailsSent: 0,
            databaseSaved: true,
            fallbackUsed: true
          }
        };
      } else {
        // Both failed - try fallback
        console.error('❌ Both database and email failed, attempting fallback...');
        return await this.fallbackEmailOnly(sanitizedData);
      }

    } catch (error) {
      console.error('💥 Contact form submission error:', error);
      
      // Last resort fallback
      try {
        return await this.fallbackEmailOnly(data);
      } catch (fallbackError) {
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again or contact us directly at contact@nexariza.com',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }

  // Utility method to check system status
  public static async checkSystemStatus(): Promise<{
    database: boolean;
    email: boolean;
    overall: 'healthy' | 'degraded' | 'down';
  }> {
    try {
      const [dbStatus, emailStatus] = await Promise.allSettled([
        testDatabaseConnection(),
        fetch('/api/health-check').then(r => r.ok)
      ]);

      const database = dbStatus.status === 'fulfilled' && dbStatus.value;
      const email = emailStatus.status === 'fulfilled' && emailStatus.value;

      let overall: 'healthy' | 'degraded' | 'down';
      if (database && email) {
        overall = 'healthy';
      } else if (database || email) {
        overall = 'degraded';
      } else {
        overall = 'down';
      }

      return { database, email, overall };
    } catch (error) {
      console.error('System status check failed:', error);
      return { database: false, email: false, overall: 'down' };
    }
  }
}

export default ContactFormHandler;