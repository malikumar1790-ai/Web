import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, AlertCircle, ArrowLeft, User, Mail, Phone, FileText, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService, type Job, type JobApplication } from '../lib/supabase';
import { testDatabaseConnection, handleDatabaseError } from '../lib/supabase';
import SEO from '../components/SEO';

const JobApplicationPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume_file: null as File | null,
    cover_letter: '',
    experience_years: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: [] as string[],
    availability: '',
    salary_expectation: ''
  });

  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'FastAPI',
    'Machine Learning', 'AI/ML', 'Neural Networks', 'Computer Vision', 'NLP',
    'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
    'Git', 'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Testing', 'API Development'
  ];

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      setLoading(true);
      if (!jobId) {
        navigate('/jobs');
        return;
      }
      
      const jobData = await jobService.getJobById(jobId);
      if (jobData) {
        setJob(jobData);
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setSubmitError('Please upload a PDF, DOC, or DOCX file.');
        return;
      }

      if (file.size > maxSize) {
        setSubmitError('File size must be less than 5MB.');
        return;
      }

      setSubmitError('');
    }
    
    setFormData(prev => ({
      ...prev,
      resume_file: file
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      console.log('📝 Starting job application submission...');
      
      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.cover_letter) {
        throw new Error('Please fill in all required fields: Name, Email, and Cover Letter.');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Validate cover letter length
      if (formData.cover_letter.length < 50) {
        throw new Error('Please provide a more detailed cover letter (minimum 50 characters).');
      }

      if (!job) {
        throw new Error('Job information not found. Please try again.');
      }

      console.log('✅ Job application validation passed');
      
      // Test database connection first
      console.log('🔍 Testing database connection...');
      const dbConnected = await testDatabaseConnection();
      if (!dbConnected) {
        console.warn('⚠️ Database connection failed, proceeding with email only');
      }
      
      let resumeUrl = '';
      
      // Upload resume if provided
      if (formData.resume_file) {
        try {
          console.log('📄 Uploading resume file...');
          resumeUrl = await jobService.uploadResume(formData.resume_file);
          console.log('✅ Resume uploaded successfully:', resumeUrl);
        } catch (uploadError) {
          console.error('Resume upload failed:', uploadError);
          console.warn('⚠️ Resume upload failed, continuing without resume');
          // Don't fail the entire submission if resume upload fails
        }
      }

      // Prepare application data
      const applicationData: JobApplication = {
        job_id: job.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        resume_url: resumeUrl || undefined,
        cover_letter: formData.cover_letter,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        linkedin_url: formData.linkedin_url || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        skills: formData.skills,
        availability: formData.availability || undefined,
        salary_expectation: formData.salary_expectation || undefined,
        status: 'pending'
      };

      // Submit application to database
      let savedApplication = applicationData;
      if (dbConnected) {
        try {
          savedApplication = await jobService.submitApplication(applicationData);
          console.log('✅ Application saved to database:', savedApplication.id);
        } catch (dbError) {
          handleDatabaseError(dbError, 'job application storage');
          console.warn('⚠️ Database storage failed, continuing with email');
          // Add a temporary ID for email purposes
          savedApplication = { ...applicationData, id: `temp-${Date.now()}` };
        }
      } else {
        console.log('⚠️ Skipping database storage due to connection issues');
        savedApplication = { ...applicationData, id: `temp-${Date.now()}` };
      }

      // Send email notifications
      console.log('📧 Sending job application emails...');
      const response = await fetch('/api/job-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application: savedApplication,
          job: job
        }),
      });

      console.log('📧 Job application API Response status:', response.status);
      const result = await response.json();
      console.log('📧 Email API Response:', result);

      if (response.ok) {
        const successMessage = result.message || 'Application submitted successfully! Check your email for confirmation and next steps.';
        setSubmitSuccess(successMessage);
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          resume_file: null,
          cover_letter: '',
          experience_years: '',
          linkedin_url: '',
          portfolio_url: '',
          skills: [],
          availability: '',
          salary_expectation: ''
        });

        // Redirect to jobs page after 5 seconds
        setTimeout(() => {
          navigate('/jobs');
        }, 5000);
      } else {
        const errorMessage = result.message || result.error || 'Failed to send email notifications.';
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('JSON')) {
        errorMessage = 'Server communication error. Your application may have been saved. Please check with our team or try again.';
      }
      
      setSubmitError(errorMessage);
      
      // Clear error after 10 seconds
      setTimeout(() => {
        setSubmitError('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <SEO 
        title={`Apply for ${job.title} - Nexariza AI Careers`}
        description={`Apply for the ${job.title} position at Nexariza AI. Join our world-class AI team and help shape the future of artificial intelligence.`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs</span>
        </button>

        {/* Job Info Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <p className="text-blue-400 font-medium text-lg">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
                <span>📍 {job.location}</span>
                <span>⏰ {job.job_type.replace('-', ' ')}</span>
                {job.salary_range && <span>💰 {job.salary_range}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              className="mb-8 p-6 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/50 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-300 font-semibold mb-2">Application Submitted Successfully! 🎉</h3>
                  <p className="text-green-200 text-sm leading-relaxed mb-3">{submitSuccess}</p>
                  <div className="bg-green-800/20 p-3 rounded-lg">
                    <p className="text-green-300 text-xs">
                      📧 Notifications sent to HR team and confirmation email sent to {formData.email}
                    </p>
                    <p className="text-green-300 text-xs mt-1">
                      🔄 Redirecting to jobs page in 5 seconds...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              className="mb-8 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-300 font-semibold mb-1">Application Error</h4>
                <p className="text-red-300 text-sm">{submitError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Form */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Apply for this Position</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="experience_years" className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience
                </label>
                <select
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select experience</option>
                  <option value="0">0-1 years</option>
                  <option value="2">2-3 years</option>
                  <option value="4">4-5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume_file" className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Resume/CV
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume_file"
                  name="resume_file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Upload PDF, DOC, or DOCX (max 5MB)
              </p>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div>
                <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolio_url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Technical Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                      formData.skills.includes(skill)
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2-weeks">2 weeks notice</option>
                  <option value="1-month">1 month notice</option>
                  <option value="2-months">2+ months</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="salary_expectation" className="block text-sm font-medium text-gray-300 mb-2">
                  Salary Expectation
                </label>
                <input
                  type="text"
                  id="salary_expectation"
                  name="salary_expectation"
                  value={formData.salary_expectation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="$120,000 - $150,000"
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-300 mb-2">
                Cover Letter *
              </label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                required
                minLength={50}
                maxLength={2000}
                rows={8}
                value={formData.cover_letter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell us why you're interested in this position and what makes you a great fit for our team..."
              />
              <div className="mt-1 text-right">
                <span className={`text-xs ${formData.cover_letter.length > 1800 ? 'text-red-400' : 'text-gray-400'}`}>
                  {formData.cover_letter.length}/2000 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.full_name || !formData.email || !formData.cover_letter || formData.cover_letter.length < 50}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-400 text-sm mt-4">
                By submitting this application, you agree to our privacy policy and terms of service. 
                You'll receive email confirmations and updates about your application status.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;