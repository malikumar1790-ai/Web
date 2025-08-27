import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rnjhmlboabsbrihoquzh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuamhtbGJvYWJzYnJpaG9xdXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjAzMjcsImV4cCI6MjA2OTY5NjMyN30.VpKXXNj4ICwJBrBuOpa7RI3TnyY9mco7nTss-vOx7bY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'nexariza-ai-website'
    }
  }
});

// Connection pool management
class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connectionPool: Map<string, any> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  startHealthCheck() {
    if (this.healthCheckInterval) return;
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        await testDatabaseConnection();
        console.log('🔍 Database health check: OK');
      } catch (error) {
        console.error('❌ Database health check failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Initialize connection manager
const dbManager = DatabaseConnectionManager.getInstance();
dbManager.startHealthCheck();
// Database types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_range?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id?: string;
  job_id: string;
  full_name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  cover_letter?: string;
  experience_years?: number;
  linkedin_url?: string;
  portfolio_url?: string;
  skills: string[];
  availability?: string;
  salary_expectation?: string;
  status?: string;
  created_at?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  status?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectSubmission {
  id?: string;
  project_type: string;
  industry: string;
  budget: string;
  timeline: string;
  features: string[];
  description?: string;
  contact_name: string;
  contact_email: string;
  contact_company?: string;
  status?: string;
  estimated_cost?: string;
  priority_level?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  updated_at?: string;
}

// Job operations
export const jobService = {
  async getAllJobs(): Promise<Job[]> {
    try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
      if (error) {
        handleDatabaseError(error, 'jobs retrieval');
      }
      
    return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch jobs:', error);
      return [];
    }
  },

  async getJobById(id: string): Promise<Job | null> {
    try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Job not found
        }
        handleDatabaseError(error, 'job retrieval');
      }
      
    return data;
    } catch (error) {
      console.error('❌ Failed to fetch job:', error);
      return null;
    }
  },

  async submitApplication(application: JobApplication): Promise<JobApplication> {
    try {
      console.log('💾 Submitting job application to database:', application);
    const { data, error } = await supabase
      .from('job_applications')
      .insert([application])
      .select()
      .single();
    
      if (error) {
        handleDatabaseError(error, 'job application submission');
      }
      
      console.log('✅ Job application saved successfully:', data?.id);
    return data;
    } catch (error) {
      console.error('❌ Job application submission failed:', error);
      throw error;
    }
  },

  async getAllApplications(): Promise<JobApplication[]> {
    try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs:job_id (
          title,
          company
        )
      `)
      .order('created_at', { ascending: false });
    
      if (error) {
        handleDatabaseError(error, 'job applications retrieval');
      }
      
    return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch job applications:', error);
      return [];
    }
  },
  
  async uploadResume(file: File): Promise<string> {
    try {
      console.log('📄 Uploading resume file:', file.name, file.size);
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, DOC, or DOCX files only.');
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File too large. Please upload files smaller than 5MB.');
      }
      
    const fileExt = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file);
    
      if (error) {
        console.error('❌ Resume upload failed:', error);
        throw new Error(`Resume upload failed: ${error.message}`);
      }
      
      console.log('✅ Resume uploaded successfully:', fileName);
    
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
    
      console.log('✅ Resume public URL generated:', publicUrl);
    return publicUrl;
    } catch (error) {
      console.error('❌ Resume upload process failed:', error);
      throw error;
    }
  }
};

// Contact form operations
export const contactService = {
  async submitContactForm(submission: ContactSubmission): Promise<ContactSubmission> {
    try {
      console.log('💾 Submitting contact form to database:', submission);
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        ...submission,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      }])
      .select()
      .single();
    
      if (error) {
        handleDatabaseError(error, 'contact form submission');
      }
      
      console.log('✅ Contact form saved successfully:', data?.id);
    return data;
    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      throw error;
    }
  },

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
      if (error) {
        handleDatabaseError(error, 'contact submissions retrieval');
      }
      
    return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch contact submissions:', error);
      return [];
    }
  }
};

// Project builder operations
export const projectService = {
  async submitProject(submission: ProjectSubmission): Promise<ProjectSubmission> {
    try {
      console.log('💾 Submitting project to database:', submission);
    const { data, error } = await supabase
      .from('project_submissions')
      .insert([{
        ...submission,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      }])
      .select()
      .single();
    
      if (error) {
        handleDatabaseError(error, 'project submission');
      }
      
      console.log('✅ Project saved successfully:', data?.id);
    return data;
    } catch (error) {
      console.error('❌ Project submission failed:', error);
      throw error;
    }
  },

  async getAllProjectSubmissions(): Promise<ProjectSubmission[]> {
    try {
    const { data, error } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
      if (error) {
        handleDatabaseError(error, 'project submissions retrieval');
      }
      
    return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch project submissions:', error);
      return [];
    }
  }
};

// Utility function to get client IP
async function getClientIP(): Promise<string> {
  try {
    // Use a more reliable IP service with fallback
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      // Fallback to alternative service
      const response = await fetch('https://httpbin.org/ip');
      const data = await response.json();
      return data.origin;
    }
  } catch (error) {
    console.warn('Could not fetch IP address:', error);
    return 'unknown';
  }
}

// Enhanced error handling for database operations
export const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database ${operation} failed:`, error);
  
  if (error.code === 'PGRST116') {
    throw new Error('Database connection failed. Please try again.');
  }
  
  if (error.code === '23505') {
    throw new Error('This submission already exists. Please check your previous submissions.');
  }
  
  if (error.message?.includes('JWT')) {
    throw new Error('Authentication error. Please refresh the page and try again.');
  }
  
  throw new Error(`${operation} failed: ${error.message || 'Unknown database error'}`);
};

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};