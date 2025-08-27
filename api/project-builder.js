// Professional Project Builder API with Database Storage and Email Notifications
// Stores project submissions in Supabase and sends detailed email notifications

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
    console.log('📧 Project Builder API: Processing request...');
    console.log('📧 Request body keys:', Object.keys(req.body));
    
    const { projectData } = req.body;

    // Comprehensive validation
    if (!projectData || !projectData.contactInfo) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing project data or contact information.',
        missingFields: {
          projectData: !projectData,
          contactInfo: !projectData?.contactInfo
        }
      });
    }

    const { contactInfo, projectType, industry, budget, timeline, features, description } = projectData;

    if (!contactInfo.name || !contactInfo.email || !projectType || !industry || !budget || !timeline) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Please provide all project details and contact information.',
        missingFields: {
          name: !contactInfo.name,
          email: !contactInfo.email,
          projectType: !projectType,
          industry: !industry,
          budget: !budget,
          timeline: !timeline
        }
      });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(contactInfo.email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format. Please enter a valid email address.' 
      });
    }

    // Calculate estimated project cost
    const getEstimatedCost = (projectType, budget, features) => {
      const baseCosts = {
        'chatbot': 15000,
        'computer-vision': 25000,
        'nlp': 20000,
        'predictive': 30000,
        'automation': 18000,
        'custom': 35000
      };
      
      const baseCost = baseCosts[projectType] || 25000;
      const featureMultiplier = 1 + (features.length * 0.1);
      return Math.round(baseCost * featureMultiplier);
    };

    const estimatedCost = getEstimatedCost(projectType, budget, features || []);
    
    // Input sanitization
    const sanitizedData = {
      projectType: projectType.trim().substring(0, 100),
      industry: industry.trim().substring(0, 100),
      budget: budget.trim().substring(0, 100),
      timeline: timeline.trim().substring(0, 100),
      features: Array.isArray(features) ? features.map(f => f.trim().substring(0, 100)) : [],
      description: description ? description.trim().substring(0, 2000) : '',
      contactInfo: {
        name: contactInfo.name.trim().substring(0, 100),
        email: contactInfo.email.trim().toLowerCase().substring(0, 100),
        company: contactInfo.company ? contactInfo.company.trim().substring(0, 100) : ''
      }
    };

    console.log('📧 Processing project builder submission:', {
      timestamp: new Date().toISOString(),
      projectType: sanitizedData.projectType,
      industry: sanitizedData.industry,
      budget: sanitizedData.budget,
      contactName: sanitizedData.contactInfo.name,
      contactEmail: sanitizedData.contactInfo.email
    });

    // Store in database first
    let submissionId = null;
    try {
      console.log('💾 Attempting to store project in database...');
      const { data: dbResult, error: dbError } = await supabase
        .from('project_submissions')
        .insert([{
          project_type: sanitizedData.projectType,
          industry: sanitizedData.industry,
          budget: sanitizedData.budget,
          timeline: sanitizedData.timeline,
          features: sanitizedData.features,
          description: sanitizedData.description,
          contact_name: sanitizedData.contactInfo.name,
          contact_email: sanitizedData.contactInfo.email,
          contact_company: sanitizedData.contactInfo.company,
          status: 'new',
          estimated_cost: `$${estimatedCost.toLocaleString()}`,
          priority_level: estimatedCost > 50000 ? 'high' : estimatedCost > 25000 ? 'medium' : 'low',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
          user_agent: req.headers['user-agent'] || 'unknown'
        }])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database storage failed:', dbError);
        console.log('⚠️ Continuing with email sending despite database error');
      } else {
        submissionId = dbResult.id;
        console.log('✅ Project submission stored in database:', submissionId);
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError);
      console.log('⚠️ Continuing with email sending despite database error');
    }

    // Configure SMTP transporter
    console.log('📧 Configuring SMTP for project builder...');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
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
      console.log('🔍 Verifying SMTP connection for project builder...');
      await transporter.verify();
      console.log('✅ SMTP connection verified for project builder');
    } catch (verifyError) {
      console.error('❌ SMTP verification failed:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Email service temporarily unavailable. Your project was saved but notification failed.',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : 'SMTP connection failed'
      });
    }

    // Admin notification email (to Nexariza AI team)
    const adminEmailContent = {
      from: `"Nexariza AI Project Builder" <${process.env.SMTP_USER || 'contact@nexariza.com'}>`,
      to: process.env.ADMIN_EMAIL || 'contact@nexariza.com',
      subject: `🚀 New AI Project Request: ${sanitizedData.projectType.toUpperCase()} - ${sanitizedData.contactInfo.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🚀 Nexariza AI</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">New AI Project Request via Project Builder</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Priority Alert -->
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">🎯 HIGH-VALUE PROJECT LEAD</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Estimated Value: $${estimatedCost.toLocaleString()} • Priority: HIGH</p>
            </div>

            <!-- Project Details -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #7c3aed;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">🎯 Project Specifications</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 140px;">🤖 Project Type:</span>
                  <span style="color: #1f2937; font-size: 16px; font-weight: 500; text-transform: capitalize;">${sanitizedData.projectType.replace('-', ' ')}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 140px;">🏢 Industry:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.industry}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 140px;">💰 Budget Range:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.budget}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 140px;">⏰ Timeline:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.timeline}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 140px;">💡 Est. Cost:</span>
                  <span style="color: #059669; font-weight: 600; font-size: 18px;">$${estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <!-- Client Information -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">👤 Client Information</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">👤 Name:</span>
                  <span style="color: #1f2937; font-size: 16px; font-weight: 500;">${sanitizedData.contactInfo.name}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">📧 Email:</span>
                  <a href="mailto:${sanitizedData.contactInfo.email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${sanitizedData.contactInfo.email}</a>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🏢 Company:</span>
                  <span style="color: #1f2937; font-weight: 500;">${sanitizedData.contactInfo.company || 'Individual Project'}</span>
                </div>
                ${submissionId ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-weight: 600; color: #374151; min-width: 120px;">🆔 Submission ID:</span>
                  <span style="color: #1f2937; font-weight: 500; font-family: monospace;">${submissionId}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Selected Features -->
            ${sanitizedData.features.length > 0 ? `
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #10b981;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">🛠️ Selected Features</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${sanitizedData.features.map(feature => `
                  <span style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${feature}</span>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Project Description -->
            ${sanitizedData.description ? `
            <div style="background: #fefefe; border: 2px solid #e5e7eb; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">💬 Project Description</h3>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; line-height: 1.6; color: #374151; font-size: 15px;">
                ${sanitizedData.description.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}

            <!-- Quick Actions -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${sanitizedData.contactInfo.email}?subject=Re: Your AI Project Request - ${sanitizedData.projectType}&body=Hi ${sanitizedData.contactInfo.name},%0D%0A%0D%0AThank you for your interest in our ${sanitizedData.projectType} solution for the ${sanitizedData.industry} industry.%0D%0A%0D%0ABased on your requirements, I'd love to schedule a discovery call to discuss your project in detail.%0D%0A%0D%0AEstimated project value: $${estimatedCost.toLocaleString()}%0D%0ATimeline: ${sanitizedData.timeline}%0D%0A%0D%0AWhen would be a good time for a 45-minute consultation call?%0D%0A%0D%0ABest regards,%0D%0AAhmad Yasin%0D%0AFounder & CEO, Nexariza AI" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                📞 Schedule Discovery Call
              </a>
              <a href="mailto:${sanitizedData.contactInfo.email}?subject=Project Proposal - ${sanitizedData.projectType} Solution&body=Hi ${sanitizedData.contactInfo.name},%0D%0A%0D%0AAttached is our detailed proposal for your ${sanitizedData.projectType} project.%0D%0A%0D%0AProject Summary:%0D%0A- Type: ${sanitizedData.projectType}%0D%0A- Industry: ${sanitizedData.industry}%0D%0A- Timeline: ${sanitizedData.timeline}%0D%0A- Estimated Investment: $${estimatedCost.toLocaleString()}%0D%0A%0D%0ANext steps:%0D%0A1. Review the attached proposal%0D%0A2. Schedule a technical discussion%0D%0A3. Finalize project scope and timeline%0D%0A%0D%0ALooking forward to transforming your vision into reality!%0D%0A%0D%0ABest regards,%0D%0AAhmad Yasin & Nexariza AI Team" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                📄 Send Proposal
              </a>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;"><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0 0 0;"><strong>Source:</strong> Nexariza AI Project Builder - www.nexariza.com/project-builder</p>
              ${submissionId ? `<p style="margin: 5px 0 0 0;"><strong>Reference ID:</strong> ${submissionId}</p>` : ''}
            </div>
          </div>
        </div>
      `,
      text: `
        🚀 NEXARIZA AI - NEW PROJECT REQUEST
        ===================================
        
        🎯 HIGH-VALUE PROJECT LEAD
        Estimated Value: $${estimatedCost.toLocaleString()}
        
        🎯 PROJECT SPECIFICATIONS:
        -------------------------
        Project Type: ${sanitizedData.projectType.replace('-', ' ')}
        Industry: ${sanitizedData.industry}
        Budget Range: ${sanitizedData.budget}
        Timeline: ${sanitizedData.timeline}
        Estimated Cost: $${estimatedCost.toLocaleString()}
        
        👤 CLIENT INFORMATION:
        ---------------------
        Name: ${sanitizedData.contactInfo.name}
        Email: ${sanitizedData.contactInfo.email}
        Company: ${sanitizedData.contactInfo.company || 'Individual Project'}
        ${submissionId ? `Submission ID: ${submissionId}` : ''}
        
        🛠️ SELECTED FEATURES:
        --------------------
        ${sanitizedData.features.length > 0 ? sanitizedData.features.join(', ') : 'No specific features selected'}
        
        💬 PROJECT DESCRIPTION:
        ----------------------
        ${sanitizedData.description || 'No additional description provided'}
        
        📧 QUICK REPLY: Reply to ${sanitizedData.contactInfo.email}
        
        Submission Time: ${new Date().toLocaleString()}
        Source: Nexariza AI Project Builder - www.nexariza.com/project-builder
      `
    };

    // Client confirmation email (auto-reply)
    const clientEmailContent = {
      from: `"Nexariza AI Project Builder" <${process.env.SMTP_USER || 'contact@nexariza.com'}>`,
      to: sanitizedData.contactInfo.email,
      subject: `🎉 Project Request Received - ${sanitizedData.projectType.replace('-', ' ')} Solution | Nexariza AI`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 700;">🚀 Nexariza AI</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 20px;">Your AI Project Request is Confirmed!</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 28px;">Hello ${sanitizedData.contactInfo.name}! 👋</h2>
              <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0;">
                Thank you for using our <strong style="color: #7c3aed;">AI Project Builder</strong>! We're excited to transform your ${sanitizedData.projectType.replace('-', ' ')} vision into reality.
              </p>
            </div>

            <!-- Confirmation Box -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 22px;">✅ Project Request Successfully Received!</h3>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your specifications have been delivered to our expert AI team</p>
            </div>
            
            <!-- Project Summary -->
            <div style="background: #f1f5f9; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #7c3aed;">
              <h3 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px;">📋 Your Project Summary</h3>
              <div style="display: grid; gap: 12px;">
                <div><strong style="color: #374151;">Project Type:</strong> <span style="color: #1f2937; text-transform: capitalize;">${sanitizedData.projectType.replace('-', ' ')}</span></div>
                <div><strong style="color: #374151;">Industry:</strong> <span style="color: #1f2937;">${sanitizedData.industry}</span></div>
                <div><strong style="color: #374151;">Budget Range:</strong> <span style="color: #1f2937;">${sanitizedData.budget}</span></div>
                <div><strong style="color: #374151;">Timeline:</strong> <span style="color: #1f2937;">${sanitizedData.timeline}</span></div>
                <div><strong style="color: #374151;">Features:</strong> <span style="color: #1f2937;">${sanitizedData.features.length > 0 ? sanitizedData.features.join(', ') : 'Standard features'}</span></div>
                <div><strong style="color: #374151;">Estimated Investment:</strong> <span style="color: #059669; font-weight: 600;">$${estimatedCost.toLocaleString()}</span></div>
                ${submissionId ? `<div><strong style="color: #374151;">Reference ID:</strong> <span style="color: #1f2937; font-family: monospace;">${submissionId}</span></div>` : ''}
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
                    <strong style="color: #1e3a8a;">Technical Review (Next 4 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Ahmad Yasin and our technical team will analyze your requirements and create a detailed project proposal.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                  <div>
                    <strong style="color: #1e3a8a;">Detailed Proposal (Within 24 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">You'll receive a comprehensive proposal with technical specifications, timeline, and investment details.</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: #7c3aed; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                  <div>
                    <strong style="color: #1e3a8a;">Discovery Call (Within 48 Hours)</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280; line-height: 1.5;">Free 45-minute technical consultation to refine requirements and discuss implementation strategy.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Investment Breakdown -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; font-size: 24px;">💰 Investment Estimate</h3>
              <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">$${estimatedCost.toLocaleString()}</div>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
                This estimate includes development, testing, deployment, and 6 months of premium support. Final pricing will be customized based on your specific requirements.
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 25px;">
                <div style="text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">✅</div>
                  <div style="font-size: 14px; opacity: 0.9;">Custom Development</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">🚀</div>
                  <div style="font-size: 14px; opacity: 0.9;">Full Deployment</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">🤝</div>
                  <div style="font-size: 14px; opacity: 0.9;">6 Months Support</div>
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
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">📞</span>
                  <span style="color: #374151;">Schedule a call via email</span>
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
        🚀 NEXARIZA AI - PROJECT REQUEST CONFIRMATION
        ============================================
        
        Hello ${sanitizedData.contactInfo.name}!
        
        Thank you for using our AI Project Builder! We're excited to transform your ${sanitizedData.projectType.replace('-', ' ')} vision into reality.
        
        ✅ PROJECT REQUEST SUCCESSFULLY RECEIVED!
        Your specifications have been delivered to our expert AI team.
        
        📋 YOUR PROJECT SUMMARY:
        ------------------------
        Project Type: ${sanitizedData.projectType.replace('-', ' ')}
        Industry: ${sanitizedData.industry}
        Budget Range: ${sanitizedData.budget}
        Timeline: ${sanitizedData.timeline}
        Features: ${sanitizedData.features.length > 0 ? sanitizedData.features.join(', ') : 'Standard features'}
        Estimated Investment: $${estimatedCost.toLocaleString()}
        ${submissionId ? `Reference ID: ${submissionId}` : ''}
        Submitted: ${new Date().toLocaleString()}
        
        ⏰ WHAT HAPPENS NEXT?
        ---------------------
        1. TECHNICAL REVIEW (Next 4 Hours)
           Ahmad Yasin and our team will analyze your requirements
        
        2. DETAILED PROPOSAL (Within 24 Hours)
           Comprehensive proposal with technical specs and timeline
        
        3. DISCOVERY CALL (Within 48 Hours)
           Free 45-minute technical consultation
        
        💰 INVESTMENT ESTIMATE: $${estimatedCost.toLocaleString()}
        This includes development, testing, deployment, and 6 months premium support.
        
        🌐 STAY CONNECTED:
        ------------------
        Website: https://www.nexariza.com
        Email: contact@nexariza.com
        
        Thank you for choosing Nexariza AI to transform your vision into reality! 🚀
        
        Ahmad Yasin & The Nexariza AI Team
        www.nexariza.com | contact@nexariza.com
      `
    };

    // Send both emails
    try {
      console.log('📤 Sending admin notification email...');
      const adminResult = await transporter.sendMail(adminEmailContent);
      console.log('✅ Admin email sent successfully. Message ID:', adminResult.messageId);

      console.log('📤 Sending client confirmation email...');
      const clientResult = await transporter.sendMail(clientEmailContent);
      console.log('✅ Client confirmation email sent successfully. Message ID:', clientResult.messageId);

      // Log successful submission
      console.log('🎉 Project builder submission processed successfully:', {
        timestamp: new Date().toISOString(),
        submissionId: submissionId,
        projectType: sanitizedData.projectType,
        industry: sanitizedData.industry,
        budget: sanitizedData.budget,
        contactName: sanitizedData.contactInfo.name,
        contactEmail: sanitizedData.contactInfo.email,
        estimatedCost: estimatedCost,
        emailsSent: 2,
        adminMessageId: adminResult.messageId,
        clientMessageId: clientResult.messageId
      });

      return res.status(200).json({ 
        success: true,
        message: 'Project request submitted successfully! Check your email for detailed confirmation and next steps.',
        data: {
          submissionId: submissionId,
          estimatedCost: estimatedCost,
          emailsSent: 2,
          adminNotified: true,
          clientConfirmed: true,
          reviewTime: '24 hours',
          proposalTime: '24 hours'
        }
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      return res.status(200).json({ 
        success: true,
        message: 'Project request submitted and saved successfully! Email notifications failed but your submission is recorded.',
        warning: 'Email delivery failed - please contact contact@nexariza.com if you don\'t receive confirmation.',
        data: {
          submissionId: submissionId,
          estimatedCost: estimatedCost,
          emailsSent: 0,
          adminNotified: false,
          clientConfirmed: false,
          submissionSaved: true
        }
      });
    }

  } catch (error) {
    console.error('💥 Project builder processing error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your project request. Please try again or contact us directly at contact@nexariza.com',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error',
      timestamp: new Date().toISOString()
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