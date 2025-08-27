// Email testing endpoint for debugging
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing email configuration...');

    // Configure SMTP transporter
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
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 30000
    });

    // Test SMTP connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    // Send test email
    const testEmail = {
      from: process.env.SMTP_USER || 'contact@nexariza.com',
      to: process.env.ADMIN_EMAIL || 'contact@nexariza.com',
      subject: '🧪 Nexariza AI - Email System Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e3a8a;">✅ Email System Test Successful</h2>
          <p>This is a test email to verify that the Nexariza AI email system is working correctly.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Test Results:</h3>
            <ul>
              <li>✅ SMTP Connection: Working</li>
              <li>✅ Authentication: Successful</li>
              <li>✅ Email Delivery: Functional</li>
              <li>✅ HTML Formatting: Proper</li>
            </ul>
          </div>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p><em>Nexariza AI Email System - www.nexariza.com</em></p>
        </div>
      `,
      text: `
        Email System Test Successful
        
        This is a test email to verify that the Nexariza AI email system is working correctly.
        
        Test Results:
        - SMTP Connection: Working
        - Authentication: Successful
        - Email Delivery: Functional
        - HTML Formatting: Proper
        
        Test Time: ${new Date().toLocaleString()}
        Nexariza AI Email System - www.nexariza.com
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully. Message ID:', result.messageId);

    return res.status(200).json({
      success: true,
      message: 'Email system test successful',
      data: {
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
        smtpHost: process.env.SMTP_HOST || 'smtpout.secureserver.net',
        smtpPort: process.env.SMTP_PORT || '587'
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Email system test failed',
      error: {
        message: error.message,
        code: error.code,
        command: error.command
      },
      troubleshooting: {
        checkSMTPCredentials: 'Verify SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS',
        checkNetworkConnectivity: 'Ensure server can reach SMTP host',
        checkEmailAccount: 'Verify email account is active and credentials are correct'
      }
    });
  }
}