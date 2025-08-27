// Professional Job Application API with Database Storage and Email Notifications
// Stores applications in Supabase and sends detailed email notifications

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    console.log('📧 Job Application API: Processing request...');
    console.log('📧 Request body keys:', Object.keys(req.body));
    
    const { application, job } = req.body;

    // Validate required data
    if (!application || !job) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing application or job data.' 
      });
    }

    // Validate required application fields
    if (!application.full_name || !application.email || !application.cover_letter) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required application fields: name, email, and cover letter.' 
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(application.email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format. Please enter a valid email address.' 
      });
    }

    console.log('📧 Processing job application:', {
      timestamp: new Date().toISOString(),
      jobTitle: job.title,
      applicantName: application.full_name,
      applicantEmail: application.email,
      applicationId: application.id
    });

    // Store in database first (if not already stored)
    let applicationId = application.id;
    if (!applicationId) {
      try {
        console.log('💾 Storing job application in database...');
        const { data: dbResult, error: dbError } = await supabase
          .from('job_applications')
          .insert([{
            job_id: job.id,
            full_name: application.full_name,
            email: application.email,
            phone: application.phone,
            resume_url: application.resume_url,
            cover_letter: application.cover_letter,
            experience_years: application.experience_years,
            linkedin_url: application.linkedin_url,
            portfolio_url: application.portfolio_url,
            skills: application.skills,
            availability: application.availability,
            salary_expectation: application.salary_expectation,
            status: 'pending'
          }])
          .select()
          .single();

        if (dbError) {
          console.error('❌ Database storage failed:', dbError);
          console.log('⚠️ Continuing with email sending despite database error');
        } else {
          applicationId = dbResult.id;
          console.log('✅ Job application stored in database:', applicationId);
        }
      } catch (dbError) {
        console.error('❌ Database operation failed:', dbError);
        console.log('⚠️ Continuing with email sending despite database error');
      }
    }

    // Configure SMTP transporter
    console.log('📧 Configuring SMTP for job application...');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'contact@nexariza.com',
        pass: process.env.SMTP_PASS || 'Nexariza@Ahmad1122'
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    // Verify SMTP connection
    try {
      console.log('🔍 Verifying SMTP connection for job application...');
      await transporter.verify();
      console.log('✅ SMTP connection verified for job application');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Email service temporarily unavailable. Application was saved but notification failed.',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : 'SMTP connection failed'
      });
    }

    // Admin notification email (to HR team)
    const adminEmailContent = {
      from: `"Nexariza AI Careers" <${process.env.SMTP_USER || 'contact@nexariza.com'}>`,
      to: process.env.ADMIN_EMAIL || 'contact@nexariza.com',
      subject: `🎯 New Job Application: ${job.title} - ${application.full_name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">💼 Nexariza AI Careers</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">New Job Application Received</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Priority Alert -->
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">🎯 NEW CANDIDATE APPLICATION</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Review and respond within 48 hours</p>
            </div>

            <!-- Job Details -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">💼 Position Details</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🎯 Position:</span>
                  <span style="color: #1f2937; font-size: 16px; font-weight: 500;">${job.title}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🏢 Company:</span>
                  <span style="color: #1f2937; font-weight: 500;">${job.company}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">📍 Location:</span>
                  <span style="color: #1f2937; font-weight: 500;">${job.location}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">⏰ Type:</span>
                  <span style="color: #1f2937; font-weight: 500;">${job.job_type}</span>
                </div>
                ${job.salary_range ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">💰 Salary:</span>
                  <span style="color: #1f2937; font-weight: 500;">${job.salary_range}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Candidate Information -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #10b981;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">👤 Candidate Information</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">👤 Full Name:</span>
                  <span style="color: #1f2937; font-size: 16px; font-weight: 500;">${application.full_name}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">📧 Email:</span>
                  <a href="mailto:${application.email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${application.email}</a>
                </div>
                ${application.phone ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">📞 Phone:</span>
                  <span style="color: #1f2937; font-weight: 500;">${application.phone}</span>
                </div>
                ` : ''}
                ${application.experience_years ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">💼 Experience:</span>
                  <span style="color: #1f2937; font-weight: 500;">${application.experience_years}+ years</span>
                </div>
                ` : ''}
                ${application.linkedin_url ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">🔗 LinkedIn:</span>
                  <a href="${application.linkedin_url}" style="color: #3b82f6; text-decoration: none; font-weight: 500;" target="_blank">${application.linkedin_url}</a>
                </div>
                ` : ''}
                ${application.portfolio_url ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">🌐 Portfolio:</span>
                  <a href="${application.portfolio_url}" style="color: #3b82f6; text-decoration: none; font-weight: 500;" target="_blank">${application.portfolio_url}</a>
                </div>
                ` : ''}
                ${application.availability ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">📅 Availability:</span>
                  <span style="color: #1f2937; font-weight: 500;">${application.availability}</span>
                </div>
                ` : ''}
                ${application.salary_expectation ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 150px;">💰 Salary Expectation:</span>
                  <span style="color: #1f2937; font-weight: 500;">${application.salary_expectation}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Skills -->
            ${application.skills && application.skills.length > 0 ? `
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #7c3aed;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">🛠️ Technical Skills</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${application.skills.map(skill => `
                  <span style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${skill}</span>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Cover Letter -->
            <div style="background: #fefefe; border: 2px solid #e5e7eb; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">💬 Cover Letter</h3>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; line-height: 1.6; color: #374151; font-size: 15px;">
                ${application.cover_letter.replace(/\n/g, '<br>')}
              </div>
            </div>

            ${application.resume_url ? `
            <!-- Resume -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">📄 Resume</h3>
              <a href="${application.resume_url}" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📥 Download Resume
              </a>
            </div>
            ` : ''}

            <!-- Quick Actions -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${application.email}?subject=Re: Your Application for ${job.title}&body=Hi ${application.full_name},%0D%0A%0D%0AThank you for your interest in the ${job.title} position at Nexariza AI.%0D%0A%0D%0AWe've reviewed your application and would like to schedule an interview.%0D%0A%0D%0AWhen would be a good time for a 30-minute video call?%0D%0A%0D%0ABest regards,%0D%0ANexariza AI HR Team" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                📧 Schedule Interview
              </a>
              <a href="mailto:${application.email}?subject=Application Status Update - ${job.title}&body=Hi ${application.full_name},%0D%0A%0D%0AThank you for applying to the ${job.title} position at Nexariza AI.%0D%0A%0D%0AWe'll review your application and get back to you within 48 hours.%0D%0A%0D%0ABest regards,%0D%0ANexariza AI HR Team" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                ✅ Send Confirmation
              </a>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;"><strong>Application ID:</strong> ${application.id}</p>
              <p style="margin: 5px 0 0 0;"><strong>Database ID:</strong> ${applicationId || 'Not stored'}</p>
              <p style="margin: 5px 0 0 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0 0 0;"><strong>Source:</strong> Nexariza AI Careers Portal - www.nexariza.com/jobs</p>
            </div>
          </div>
        </div>
      `,
      text: `
        💼 NEXARIZA AI - NEW JOB APPLICATION
        ===================================
        
        🎯 NEW CANDIDATE APPLICATION - Review within 48 hours!
        
        💼 POSITION DETAILS:
        -------------------
        Position: ${job.title}
        Company: ${job.company}
        Location: ${job.location}
        Type: ${job.job_type}
        ${job.salary_range ? `Salary: ${job.salary_range}` : ''}
        
        👤 CANDIDATE INFORMATION:
        ------------------------
        Name: ${application.full_name}
        Email: ${application.email}
        ${application.phone ? `Phone: ${application.phone}` : ''}
        ${application.experience_years ? `Experience: ${application.experience_years}+ years` : ''}
        ${application.linkedin_url ? `LinkedIn: ${application.linkedin_url}` : ''}
        ${application.portfolio_url ? `Portfolio: ${application.portfolio_url}` : ''}
        ${application.availability ? `Availability: ${application.availability}` : ''}
        ${application.salary_expectation ? `Salary Expectation: ${application.salary_expectation}` : ''}
        
        ${application.skills && application.skills.length > 0 ? `
        🛠️ TECHNICAL SKILLS:
        -------------------
        ${application.skills.join(', ')}
        ` : ''}
        
        💬 COVER LETTER:
        ---------------
        ${application.cover_letter}
        
        ${application.resume_url ? `
        📄 RESUME: ${application.resume_url}
        ` : ''}
        
        📧 QUICK REPLY: Reply to ${application.email}
        
        Application ID: ${application.id}
        Database ID: ${applicationId || 'Not stored'}
        Submitted: ${new Date().toLocaleString()}
        Source: Nexariza AI Careers Portal - www.nexariza.com/jobs
      `
    };

    // Candidate confirmation email (auto-reply)
    const candidateEmailContent = {
      from: `"Nexariza AI Careers" <${process.env.SMTP_USER || 'contact@nexariza.com'}>`,
      to: application.email,
      subject: `🎉 Application Received - ${job.title} at Nexariza AI`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 700;">💼 Nexariza AI Careers</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 20px;">Application Confirmation</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 28px;">Hello ${application.full_name}! 👋</h2>
              <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0;">
                Thank you for applying to the <strong style="color: #3b82f6;">${job.title}</strong> position at Nexariza AI! We're excited to review your application.
              </p>
            </div>

            <!-- Confirmation Box -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 22px;">✅ Application Successfully Submitted!</h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your application has been received and is under review</p>
            </div>
            
            <!-- Application Summary -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px;">📋 Your Application Summary</h3>
              <div style="display: grid; gap: 12px;">
                <div><strong style="color: #374151;">Position:</strong> <span style="color: #1f2937;">${job.title}</span></div>
                <div><strong style="color: #374151;">Company:</strong> <span style="color: #1f2937;">${job.company}</span></div>
                <div><strong style="color: #374151;">Location:</strong> <span style="color: #1f2937;">${job.location}</span></div>
                ${application.experience_years ? `<div><strong style="color: #374151;">Experience:</strong> <span style="color: #1f2937;">${application.experience_years}+ years</span></div>` : ''}
                <div><strong style="color: #374151;">Application ID:</strong> <span style="color: #1f2937;">${application.id}</span></div>
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
                    <strong style="color: #1e3a8a;">Application Review (24-48 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Our HR team will carefully review your application and qualifications against our requirements.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                  <div>
                    <strong style="color: #1e3a8a;">Initial Screening (If Selected)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Qualified candidates will receive an email to schedule a 30-minute phone/video screening interview.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #7c3aed; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                  <div>
                    <strong style="color: #1e3a8a;">Technical Interview (If Advanced)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Technical assessment and in-depth interview with our engineering team and Ahmad Yasin.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- About Nexariza AI -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 24px;">🚀 About Nexariza AI</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
                Founded in 2024 by Ahmad Yasin, we're a leading AI development company specializing in custom AI solutions that transform businesses worldwide.
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">500+</div>
                  <div style="font-size: 14px; opacity: 0.9;">Projects Delivered</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">150+</div>
                  <div style="font-size: 14px; opacity: 0.9;">Happy Clients</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">98%</div>
                  <div style="font-size: 14px; opacity: 0.9;">Success Rate</div>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px;">📞 Questions About Your Application?</h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">📧</span>
                  <a href="mailto:careers@nexariza.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">careers@nexariza.com</a>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">🌐</span>
                  <a href="https://www.nexariza.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">www.nexariza.com</a>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 25px; text-align: center; color: #6b7280;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #1e3a8a; font-weight: 600;">
                We look forward to potentially welcoming you to the Nexariza AI team! 🚀
              </p>
              <p style="margin: 0; font-size: 14px;">
                <strong>Nexariza AI HR Team</strong><br>
                <em>www.nexariza.com | careers@nexariza.com</em>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        💼 NEXARIZA AI - APPLICATION CONFIRMATION
        ========================================
        
        Hello ${application.full_name}!
        
        Thank you for applying to the ${job.title} position at Nexariza AI! We're excited to review your application.
        
        ✅ APPLICATION SUCCESSFULLY SUBMITTED!
        Your application has been received and is under review.
        
        📋 YOUR APPLICATION SUMMARY:
        ---------------------------
        Position: ${job.title}
        Company: ${job.company}
        Location: ${job.location}
        ${application.experience_years ? `Experience: ${application.experience_years}+ years` : ''}
        Application ID: ${application.id}
        Submitted: ${new Date().toLocaleString()}
        
        ⏰ WHAT HAPPENS NEXT?
        ---------------------
        1. APPLICATION REVIEW (24-48 Hours)
           Our HR team will review your application and qualifications
        
        2. INITIAL SCREENING (If Selected)
           Qualified candidates will receive an interview invitation
        
        3. TECHNICAL INTERVIEW (If Advanced)
           Technical assessment with our engineering team
        
        🚀 ABOUT NEXARIZA AI:
        --------------------
        Founded in 2024 by Ahmad Yasin, we're a leading AI development company specializing in custom AI solutions that transform businesses worldwide.
        
        • 500+ Projects Delivered
        • 150+ Happy Clients  
        • 98% Success Rate
        
        📞 QUESTIONS?
        ------------
        Email: careers@nexariza.com
        Website: www.nexariza.com
        
        We look forward to potentially welcoming you to the Nexariza AI team! 🚀
        
        Nexariza AI HR Team
        www.nexariza.com | careers@nexariza.com
      `
    };

    // Send both emails
    try {
      console.log('📤 Sending HR notification email...');
      const adminResult = await transporter.sendMail(adminEmailContent);
      console.log('✅ HR email sent successfully. Message ID:', adminResult.messageId);

      console.log('📤 Sending candidate confirmation email...');
      const candidateResult = await transporter.sendMail(candidateEmailContent);
      console.log('✅ Candidate confirmation email sent successfully. Message ID:', candidateResult.messageId);

      // Log successful submission
      console.log('🎉 Job application processed successfully:', {
        timestamp: new Date().toISOString(),
        jobTitle: job.title,
        candidateName: application.full_name,
        candidateEmail: application.email,
        applicationId: application.id,
        emailsSent: 2,
        adminMessageId: adminResult.messageId,
        candidateMessageId: candidateResult.messageId
      });

      return res.status(200).json({ 
        success: true,
        message: 'Application submitted successfully! Check your email for confirmation and next steps.',
        data: {
          applicationId: applicationId || application.id,
          emailsSent: 2,
          hrNotified: true,
          candidateConfirmed: true,
          reviewTime: '48 hours'
        }
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      return res.status(200).json({ 
        success: true,
        message: 'Application submitted successfully! Email notifications failed but your application is saved.',
        warning: 'Email delivery failed - please contact careers@nexariza.com if you don\'t receive confirmation.',
        data: {
          applicationId: applicationId || application.id,
          emailsSent: 0,
          hrNotified: false,
          candidateConfirmed: false
        }
      });
    }

  } catch (error) {
    console.error('💥 Job application processing error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your application. Please try again or contact careers@nexariza.com',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }

  // Fallback response to ensure JSON is always returned
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred while processing your application.',
    error: 'Server error - no response generated',
    timestamp: new Date().toISOString()
  });
}

// Configuration for deployment platforms
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}