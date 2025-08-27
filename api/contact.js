// Professional Contact Form API with Dual Email System
// Sends admin notification + user confirmation emails

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import rateLimit from './rate-limit.js';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Apply rate limiting
  const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
    message: 'Too many contact form submissions. Please wait before trying again.'
  });
  
  // Apply rate limiting
  await new Promise((resolve) => {
    rateLimitMiddleware(req, res, resolve);
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Please use POST.' 
    });
  }

  try {
    console.log('📧 Contact API: Processing request...');
    console.log('📧 Request body:', req.body);
    
    const { name, email, company, message, service } = req.body;

    // Comprehensive validation
    const validationErrors = [];
    
    if (!name || !email || !message) {
      if (!name) validationErrors.push('Name is required');
      if (!email) validationErrors.push('Email is required');
      if (!message) validationErrors.push('Message is required');
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (email && !emailRegex.test(email)) {
      validationErrors.push('Invalid email format');
    }

    // Message length validation
    if (message && (message.length < 10 || message.length > 2000)) {
      validationErrors.push('Message must be between 10 and 2000 characters');
    }

    // Security validation
    const securityPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /(SELECT|INSERT|UPDATE|DELETE|DROP)/i
    ];

    const allFields = [name, email, company, message, service].filter(Boolean);
    const hasSecurityIssue = allFields.some(field => 
      securityPatterns.some(pattern => pattern.test(field))
    );

    if (hasSecurityIssue) {
      validationErrors.push('Invalid characters detected in form data');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    // Input sanitization
    const sanitizedData = {
      name: name.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
      company: company ? company.trim().substring(0, 100) : '',
      message: message.trim().substring(0, 2000),
      service: service ? service.trim().substring(0, 100) : 'General Inquiry'
    };

    // Additional security sanitization
    Object.keys(sanitizedData).forEach(key => {
      if (typeof sanitizedData[key] === 'string') {
        sanitizedData[key] = sanitizedData[key]
          .replace(/[<>]/g, '') // Remove potential HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocols
          .replace(/on\w+=/gi, ''); // Remove event handlers
      }
    });

    console.log('📧 Processing contact form submission:', {
      timestamp: new Date().toISOString(),
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company,
      service: sanitizedData.service,
      messageLength: sanitizedData.message.length
    });

    // Store in database first
    try {
      console.log('💾 Attempting to store in database...');
      const { data: dbResult, error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company,
          service: sanitizedData.service,
          message: sanitizedData.message,
          status: 'new',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
          user_agent: req.headers['user-agent'] || 'unknown'
        }])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database storage failed:', dbError);
        console.log('⚠️ Continuing with email sending despite database error');
      } else {
        console.log('✅ Contact submission stored in database:', dbResult.id);
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError);
      console.log('⚠️ Continuing with email sending despite database error');
    }

    // Verify Resend API key
    try {
      console.log('🔍 Verifying Resend API key...');
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is not set');
      }
      console.log('✅ Resend API key configured');
    } catch (verifyError) {
      console.error('❌ Resend verification failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Email service temporarily unavailable. Please try again later or contact us directly.',
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'development' ? verifyError.message : 'Email service connection failed'
      });
    }

    // Admin notification email (to you)
    const adminEmailData = {
      from: 'Nexariza AI <contact@nexariza.com>',
      to: [process.env.ADMIN_EMAIL || 'contact@nexariza.com'],
      subject: `🚀 New AI Consultation Request from ${sanitizedData.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🚀 Nexariza AI</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">New AI Consultation Request</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Priority Alert -->
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">⚡ HIGH PRIORITY LEAD ⚡</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Respond within 24 hours for maximum conversion</p>
            </div>

            <!-- Client Details -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">👤 Client Information</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">👤 Name:</span>
                  <span style="color: #1f2937; font-size: 16px; font-weight: 500;">${sanitizedData.name}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">📧 Email:</span>
                  <a href="mailto:${sanitizedData.email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${sanitizedData.email}</a>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🏢 Company:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.company || 'Not provided'}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🎯 Service:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.service}</span>
                </div>
              </div>
            </div>
            
            <!-- Message -->
            <div style="background: #fefefe; border: 2px solid #e5e7eb; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">💬 Client Message:</h3>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; line-height: 1.6; color: #374151; font-size: 15px;">
                ${sanitizedData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <!-- Quick Actions -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${sanitizedData.email}?subject=Re: Your AI Consultation Request&body=Hi ${sanitizedData.name},%0D%0A%0D%0AThank you for your interest in Nexariza AI solutions. I'd love to discuss your project in detail.%0D%0A%0D%0AWhen would be a good time for a 30-minute discovery call?%0D%0A%0D%0ABest regards,%0D%0AAhmad Yasin%0D%0AFounder & CEO, Nexariza AI" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                📧 Reply to Client
              </a>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;"><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0 0 0;"><strong>Source:</strong> Nexariza AI Contact Form - www.nexariza.com</p>
            </div>
          </div>
        </div>
      `,
      text: `
        🚀 NEXARIZA AI - NEW AI CONSULTATION REQUEST
        ==========================================
        
        ⚡ HIGH PRIORITY LEAD - Respond within 24 hours!
        
        👤 CLIENT INFORMATION:
        ----------------------
        Name: ${sanitizedData.name}
        Email: ${sanitizedData.email}
        Company: ${sanitizedData.company || 'Not provided'}
        Service Interest: ${sanitizedData.service}
        
        💬 CLIENT MESSAGE:
        ------------------
        ${sanitizedData.message}
        
        📧 QUICK REPLY: Reply to ${sanitizedData.email}
        
        Submission Time: ${new Date().toLocaleString()}
        Source: Nexariza AI Contact Form - www.nexariza.com
      `
    };

    // User confirmation email (auto-reply)
    const userEmailData = {
      from: 'Nexariza AI <contact@nexariza.com>',
      to: [sanitizedData.email],
      subject: '🎉 Thank You for Contacting Nexariza AI - Your AI Journey Starts Here!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 700;">🚀 Nexariza AI</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 20px;">Your AI Transformation Starts Here!</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 28px;">Hello ${sanitizedData.name}! 👋</h2>
              <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0;">
                Thank you for reaching out to <strong style="color: #3b82f6;">Nexariza AI</strong>! We're excited to learn about your project and help transform your vision into reality.
              </p>
            </div>

            <!-- Confirmation Box -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 22px;">✅ Message Received Successfully!</h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your inquiry has been delivered to our expert team</p>
            </div>
            
            <!-- Submission Summary -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px;">📋 Your Submission Summary</h3>
              <div style="display: grid; gap: 12px;">
                <div><strong style="color: #374151;">Service Interest:</strong> <span style="color: #1f2937;">${sanitizedData.service}</span></div>
                <div><strong style="color: #374151;">Company:</strong> <span style="color: #1f2937;">${sanitizedData.company || 'Individual Inquiry'}</span></div>
                <div><strong style="color: #374151;">Submitted:</strong> <span style="color: #1f2937;">${new Date().toLocaleString()}</span></div>
              </div>
            </div>
            
            <!-- What Happens Next -->
            <div style="background: #fefefe; border: 2px solid #e5e7eb; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px;">⏰ What Happens Next?</h3>
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
                  <div>
                    <strong style="color: #1e3a8a;">Immediate Review (Next 2 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Ahmad Yasin or a senior team member will personally review your request and begin crafting a tailored response.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                  <div>
                    <strong style="color: #1e3a8a;">Personalized Response (Within 24 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">You'll receive a detailed email with initial insights, relevant case studies, and next steps tailored to your specific needs.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #7c3aed; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                  <div>
                    <strong style="color: #1e3a8a;">Discovery Call (Within 48 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">We'll schedule a free 30-minute consultation to dive deep into your requirements and explore how AI can transform your business.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- About Nexariza AI -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 24px;">🔥 Why Choose Nexariza AI?</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
                Founded in 2024 by Ahmad Yasin, we specialize in transforming innovative ideas into custom AI solutions that deliver real business value.
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">🤝</div>
                  <div style="font-size: 14px; opacity: 0.9;">Lifetime Partnership</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">🚀</div>
                  <div style="font-size: 14px; opacity: 0.9;">Custom AI Solutions</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">⚡</div>
                  <div style="font-size: 14px; opacity: 0.9;">Real Business Value</div>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px;">🌐 Stay Connected</h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">🌐</span>
                  <a href="https://www.nexariza.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Visit Our Website</a>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">📧</span>
                  <a href="mailto:contact@nexariza.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Direct Email</a>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 25px; text-align: center; color: #6b7280;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #1e3a8a; font-weight: 600;">
                Thank you for choosing Nexariza AI to transform your vision into reality! 🚀
              </p>
              <p style="margin: 0; font-size: 14px;">
                <strong>Ahmad Yasin & The Nexariza AI Team</strong><br>
                <em>www.nexariza.com | contact@nexariza.com</em>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        🚀 NEXARIZA AI - THANK YOU FOR YOUR INTEREST!
        ============================================
        
        Hello ${sanitizedData.name}!
        
        Thank you for reaching out to Nexariza AI! We're excited to learn about your project and help transform your vision into reality.
        
        ✅ MESSAGE RECEIVED SUCCESSFULLY!
        Your inquiry has been delivered to our expert team.
        
        📋 YOUR SUBMISSION SUMMARY:
        ---------------------------
        Service Interest: ${sanitizedData.service}
        Company: ${sanitizedData.company || 'Individual Inquiry'}
        Submitted: ${new Date().toLocaleString()}
        
        ⏰ WHAT HAPPENS NEXT?
        ---------------------
        1. IMMEDIATE REVIEW (Next 2 Hours)
           Ahmad Yasin or a senior team member will personally review your request
        
        2. PERSONALIZED RESPONSE (Within 24 Hours)
           You'll receive a detailed email with insights and next steps
        
        3. DISCOVERY CALL (Within 48 Hours)
           Free 30-minute consultation to explore your requirements
        
        🔥 WHY CHOOSE NEXARIZA AI?
        -------------------------
        Founded in 2024 by Ahmad Yasin, we specialize in transforming innovative ideas into custom AI solutions that deliver real business value.
        
        🤝 Lifetime Partnership • 🚀 Custom AI Solutions • ⚡ Real Business Value
        
        🌐 STAY CONNECTED:
        ------------------
        Website: https://www.nexariza.com
        Email: contact@nexariza.com
        
        Thank you for choosing Nexariza AI to transform your vision into reality! 🚀
        
        Ahmad Yasin & The Nexariza AI Team
        www.nexariza.com | contact@nexariza.com
      `
    };

    // Send both emails using Resend
    try {
      console.log('📤 Sending admin notification email...');
      const adminResult = await resend.emails.send(adminEmailData);
      console.log('✅ Admin email sent successfully. ID:', adminResult.data?.id);

      console.log('📤 Sending user confirmation email...');
      const userResult = await resend.emails.send(userEmailData);
      console.log('✅ User confirmation email sent successfully. ID:', userResult.data?.id);

      // Log successful submission
      console.log('🎉 Contact form submission processed successfully:', {
        timestamp: new Date().toISOString(),
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company,
        service: sanitizedData.service,
        messageLength: sanitizedData.message.length,
        emailsSent: 2,
        adminMessageId: adminResult.data?.id,
        userMessageId: userResult.data?.id
      });

      // Return success response
      return res.status(200).json({ 
        success: true,
        message: 'Message sent successfully! Your submission has been saved and we\'ll get back to you within 24 hours. Please check your email for a detailed confirmation with next steps.',
        timestamp: new Date().toISOString(),
        data: {
          submissionId: dbResult?.id || 'temp-' + Date.now(),
          emailsSent: 2,
          adminNotified: true,
          userConfirmed: true,
          responseTime: '24 hours',
          submissionSaved: !!dbResult?.id
        }
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // Detailed error logging
      const errorDetails = {
        timestamp: new Date().toISOString(),
        error: emailError.message || emailError,
        name: emailError.name,
        formData: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company,
          service: sanitizedData.service
        }
      };
      
      console.error('📧 Email error details:', errorDetails);

      return res.status(500).json({ 
        success: false,
        message: 'Failed to send confirmation emails. Your message was received but email delivery failed. Please contact us directly at contact@nexariza.com or try again later.',
        error: process.env.NODE_ENV === 'development' ? {
          message: emailError.message || emailError,
          name: emailError.name,
          details: errorDetails
        } : 'Email delivery service temporarily unavailable',
        fallback: {
          email: 'contact@nexariza.com',
          phone: 'Available upon request',
          message: 'Please contact us directly for immediate assistance'
        }
      });
    }

  } catch (error) {
    console.error('💥 Contact form processing error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'An unexpected error occurred while processing your request. Please try again or contact us directly at contact@nexariza.com',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error',
      requestId: 'req-' + Date.now()
    });
  }
}

// Configuration for deployment platforms
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}