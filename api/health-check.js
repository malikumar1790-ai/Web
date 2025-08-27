// Health check endpoint for monitoring system status
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Use GET.' 
    });
  }

  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {},
    version: '1.0.0',
    uptime: process.uptime ? process.uptime() : 0
  };

  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1);

    healthCheck.services.database = {
      status: dbError ? 'unhealthy' : 'healthy',
      error: dbError?.message || null,
      responseTime: Date.now()
    };

    // Test email service
    console.log('🔍 Testing email service...');
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransporter({
        host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'contact@nexariza.com',
          pass: process.env.SMTP_PASS || 'Nexariza@Ahmad1122'
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.verify();
      healthCheck.services.email = {
        status: 'healthy',
        error: null,
        responseTime: Date.now()
      };
    } catch (emailError) {
      healthCheck.services.email = {
        status: 'unhealthy',
        error: emailError.message,
        responseTime: Date.now()
      };
    }

    // Test file storage
    console.log('🔍 Testing file storage...');
    try {
      const { data: storageTest, error: storageError } = await supabase.storage
        .from('resumes')
        .list('', { limit: 1 });

      healthCheck.services.storage = {
        status: storageError ? 'unhealthy' : 'healthy',
        error: storageError?.message || null,
        responseTime: Date.now()
      };
    } catch (storageError) {
      healthCheck.services.storage = {
        status: 'unhealthy',
        error: storageError.message,
        responseTime: Date.now()
      };
    }

    // Determine overall health
    const allServicesHealthy = Object.values(healthCheck.services)
      .every(service => service.status === 'healthy');
    
    if (!allServicesHealthy) {
      healthCheck.status = 'degraded';
    }

    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    
    return res.status(statusCode).json({
      success: healthCheck.status === 'healthy',
      data: healthCheck,
      message: `System is ${healthCheck.status}`
    });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return res.status(503).json({
      success: false,
      data: {
        ...healthCheck,
        status: 'unhealthy',
        error: error.message
      },
      message: 'System health check failed'
    });
  }
}