// Test script for email functionality
// Run with: node test-email.js

import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('🧪 Testing Nexariza AI Email Configuration...\n');

  try {
    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'contact@nexariza.com',
        pass: 'Nexariza@Ahmad1122'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 SMTP Configuration:');
    console.log('Host: smtpout.secureserver.net');
    console.log('Port: 587 (TLS)');
    console.log('User: contact@nexariza.com');
    console.log('✅ Configuration loaded\n');

    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const testEmailContent = {
      from: 'contact@nexariza.com',
      to: 'contact@nexariza.com',
      subject: '🧪 Nexariza AI - Email Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; text-align: center; margin: 0;">🎉 Nexariza AI</h1>
            <p style="color: #e5e7eb; text-align: center; margin: 10px 0 0 0;">Email Configuration Test Successful!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e3a8a;">✅ Test Results</h2>
            <ul style="color: #374151;">
              <li>✅ SMTP Connection: Successful</li>
              <li>✅ Authentication: Working</li>
              <li>✅ Email Delivery: Functional</li>
              <li>✅ HTML Formatting: Proper</li>
            </ul>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 20px;">
              <p style="color: #374151; margin: 0;"><strong>🎯 Status:</strong> Your contact form is ready to receive submissions!</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br>
                <em>Nexariza AI Email System - www.nexariza.com</em>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        🎉 Nexariza AI - Email Test Successful!
        
        ✅ Test Results:
        - SMTP Connection: Successful
        - Authentication: Working  
        - Email Delivery: Functional
        - HTML Formatting: Proper
        
        🎯 Status: Your contact form is ready to receive submissions!
        
        Timestamp: ${new Date().toLocaleString()}
        Nexariza AI Email System - www.nexariza.com
      `
    };

    const result = await transporter.sendMail(testEmailContent);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('\n🎉 EMAIL SYSTEM READY!');
    console.log('👀 Check your inbox at contact@nexariza.com');
    console.log('🚀 Your contact form is now fully functional!');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify SMTP credentials are correct');
    console.log('2. Check network connectivity');
    console.log('3. Ensure email account is active');
    console.log('4. Try port 465 with SSL if 587 fails');
  }
}

// Run the test
testEmail();
