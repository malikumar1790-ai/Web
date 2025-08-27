// Test script for dual email functionality (admin + auto-reply)
// Run with: node test-dual-email.js

import nodemailer from 'nodemailer';

async function testDualEmail() {
  console.log('🧪 Testing Nexariza AI Dual Email System...\n');

  try {
    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: 'contact@nexariza.com',
        pass: 'Nexariza@Ahmad1122'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Testing dual email system...\n');

    // Simulate form data
    const testData = {
      name: 'Test User',
      email: 'contact@nexariza.com', // Using same email for testing
      company: 'Test Company',
      service: 'Custom AI/ML Development',
      message: 'This is a test message to verify the dual email system works correctly.'
    };

    // Email 1: Admin notification
    const adminEmail = {
      from: 'contact@nexariza.com',
      to: 'contact@nexariza.com',
      subject: `New Contact Form Submission from ${testData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; text-align: center; margin: 0; font-size: 28px;">Nexariza AI</h1>
            <p style="color: #e5e7eb; text-align: center; margin: 10px 0 0 0;">New Contact Form Submission - TEST</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e3a8a;">📋 Contact Details</h2>
            <p><strong>Name:</strong> ${testData.name}</p>
            <p><strong>Email:</strong> ${testData.email}</p>
            <p><strong>Company:</strong> ${testData.company}</p>
            <p><strong>Service:</strong> ${testData.service}</p>
            <p><strong>Message:</strong> ${testData.message}</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    // Email 2: Auto-reply
    const autoReplyEmail = {
      from: 'contact@nexariza.com',
      to: testData.email,
      subject: '✅ Thank You for Contacting Nexariza AI - We\'ll Be in Touch Soon! (TEST)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; text-align: center; margin: 0; font-size: 28px;">🚀 Nexariza AI</h1>
            <p style="color: #e5e7eb; text-align: center; margin: 10px 0 0 0;">Thank You for Your Interest! (TEST EMAIL)</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${testData.name}! 👋</h2>
            <p style="color: #374151;">This is a test of the auto-reply system. In production, users will receive a professional confirmation email.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #1e3a8a; margin-top: 0;">📋 Your Test Submission</h3>
              <p><strong>Service Interest:</strong> ${testData.service}</p>
              <p><strong>Company:</strong> ${testData.company}</p>
              <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #374151; margin-top: 20px;">✅ <strong>Dual Email System Working!</strong></p>
          </div>
        </div>
      `
    };

    // Send both emails
    console.log('📤 Sending admin notification email...');
    const adminResult = await transporter.sendMail(adminEmail);
    console.log('✅ Admin email sent! Message ID:', adminResult.messageId);

    console.log('📤 Sending auto-reply email...');
    const replyResult = await transporter.sendMail(autoReplyEmail);
    console.log('✅ Auto-reply email sent! Message ID:', replyResult.messageId);

    console.log('\n🎉 DUAL EMAIL SYSTEM TEST SUCCESSFUL!');
    console.log('📧 Both emails delivered to contact@nexariza.com');
    console.log('✅ Admin notification: Working');
    console.log('✅ User auto-reply: Working');
    console.log('🚀 Your contact form will now send both emails!');

  } catch (error) {
    console.error('❌ Dual email test failed:', error.message);
    console.log('\n🔧 Check your email configuration and try again.');
  }
}

// Run the test
testDualEmail();
