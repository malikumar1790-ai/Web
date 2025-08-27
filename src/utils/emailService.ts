// Email service utilities for form submissions
export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure?: boolean;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static getEmailConfig(): EmailConfig {
    return {
      host: import.meta.env.VITE_SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
      user: import.meta.env.VITE_SMTP_USER || 'contact@nexariza.com',
      pass: import.meta.env.VITE_SMTP_PASS || 'Nexariza@Ahmad1122',
      secure: false
    };
  }

  static async testEmailConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  static async sendFormEmails(
    formType: 'contact' | 'project' | 'job',
    data: any,
    apiEndpoint: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log(`📧 Sending ${formType} form emails...`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${formType} emails sent successfully:`, result);
        return {
          success: true,
          message: result.message || 'Emails sent successfully!',
          data: result.data
        };
      } else {
        console.error(`❌ ${formType} email sending failed:`, result);
        throw new Error(result.message || 'Email sending failed');
      }
    } catch (error) {
      console.error(`❌ ${formType} email service error:`, error);
      throw error;
    }
  }

  static generateContactEmailTemplates(data: any): { admin: EmailTemplate; user: EmailTemplate } {
    const adminTemplate: EmailTemplate = {
      subject: `🚀 New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Service:</strong> ${data.service || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${data.name}
        Email: ${data.email}
        Company: ${data.company || 'Not provided'}
        Service: ${data.service || 'General Inquiry'}
        
        Message:
        ${data.message}
        
        Submitted: ${new Date().toLocaleString()}
      `
    };

    const userTemplate: EmailTemplate = {
      subject: '✅ Thank You for Contacting Nexariza AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Thank You for Your Interest!</h2>
          <p>Hello ${data.name},</p>
          <p>Thank you for contacting Nexariza AI. We've received your message and will respond within 24 hours.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Submission Summary:</h3>
            <p><strong>Service Interest:</strong> ${data.service || 'General Inquiry'}</p>
            <p><strong>Company:</strong> ${data.company || 'Individual'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Best regards,<br>The Nexariza AI Team</p>
        </div>
      `,
      text: `
        Thank You for Your Interest!
        
        Hello ${data.name},
        
        Thank you for contacting Nexariza AI. We've received your message and will respond within 24 hours.
        
        Your Submission Summary:
        Service Interest: ${data.service || 'General Inquiry'}
        Company: ${data.company || 'Individual'}
        Submitted: ${new Date().toLocaleString()}
        
        Best regards,
        The Nexariza AI Team
      `
    };

    return { admin: adminTemplate, user: userTemplate };
  }
}

// Form debugging utilities
export class FormDebugger {
  static logFormSubmission(formType: string, data: any, step: string) {
    console.group(`📝 ${formType.toUpperCase()} FORM - ${step}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Form Data:', data);
    console.log('Environment:', {
      isDev: import.meta.env.DEV,
      hostname: window.location.hostname,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'
    });
    console.groupEnd();
  }

  static logError(formType: string, error: any, context: string) {
    console.group(`❌ ${formType.toUpperCase()} FORM ERROR - ${context}`);
    console.error('Error:', error);
    console.log('Error Type:', typeof error);
    console.log('Error Message:', error?.message);
    console.log('Error Code:', error?.code);
    console.log('Stack Trace:', error?.stack);
    console.groupEnd();
  }

  static logSuccess(formType: string, result: any) {
    console.group(`✅ ${formType.toUpperCase()} FORM SUCCESS`);
    console.log('Result:', result);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}