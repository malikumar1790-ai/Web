import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Zap, Brain, Code, Eye, FileText, TrendingUp, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { projectService, type ProjectSubmission } from '../lib/supabase';
import { testDatabaseConnection, handleDatabaseError } from '../lib/supabase';
import SEO from '../components/SEO';

const ProjectBuilder: React.FC = () => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    projectType: '',
    industry: '',
    budget: '',
    timeline: '',
    features: [] as string[],
    description: '',
    contactInfo: {
      name: '',
      email: '',
      company: ''
    }
  });
  const [contentVisible, setContentVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setContentVisible(false);
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, [language]);

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const projectTypes = [
    { id: 'chatbot', name: 'AI Chatbot', icon: Brain, description: 'Intelligent conversational AI' },
    { id: 'computer-vision', name: 'Computer Vision', icon: Eye, description: 'Visual AI recognition systems' },
    { id: 'nlp', name: 'NLP System', icon: FileText, description: 'Natural language processing' },
    { id: 'predictive', name: 'Predictive Analytics', icon: TrendingUp, description: 'Data-driven forecasting' },
    { id: 'automation', name: 'Process Automation', icon: Zap, description: 'Workflow optimization' },
    { id: 'custom', name: 'Custom Solution', icon: Code, description: 'Tailored AI development' }
  ];

  const industries = [
    'Healthcare', 'Finance', 'E-commerce', 'Manufacturing', 'Education', 
    'Real Estate', 'Transportation', 'Entertainment', 'Agriculture', 'Other'
  ];

  const budgetRanges = [
    '$5,000 - $15,000', '$15,000 - $50,000', '$50,000 - $100,000', 
    '$100,000 - $250,000', '$250,000+', 'Let\'s discuss'
  ];

  const timelineOptions = [
    '2-4 weeks', '1-2 months', '2-4 months', '4-6 months', '6+ months'
  ];

  const availableFeatures = [
    'Real-time Processing', 'Multi-language Support', 'Cloud Integration',
    'Mobile App', 'API Development', 'Dashboard Analytics',
    'User Authentication', 'Data Visualization', 'Machine Learning',
    'Voice Recognition', 'Image Processing', 'Automated Reporting'
  ];

  const handleFeatureToggle = (feature: string) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      console.log('📝 Starting project builder submission...');
      
      // Validate required fields
      if (!projectData.contactInfo.name || !projectData.contactInfo.email || 
          !projectData.projectType || !projectData.industry || 
          !projectData.budget || !projectData.timeline) {
        throw new Error('Please complete all required fields before submitting.');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(projectData.contactInfo.email)) {
        throw new Error('Please enter a valid email address.');
      }

      console.log('✅ Project builder validation passed');
      console.log('📤 Submitting project request:', projectData);
      
      // Check if we're in development or production
      const isDevelopment = import.meta.env.DEV || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        // Development mode: Simulate successful submission
        console.log('📧 DEVELOPMENT MODE - Project submitted:', projectData);
        console.log('✅ In production, project will be saved to database and emails sent');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSubmitSuccess('Development mode: Project submitted successfully! In production, it will be saved to database and emails sent to both admin and client.');
        setIsSubmitted(true);
        
        // Reset form
        setProjectData({
          projectType: '',
          industry: '',
          budget: '',
          timeline: '',
          features: [],
          description: '',
          contactInfo: { name: '', email: '', company: '' }
        });
        setCurrentStep(1);
        
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitSuccess('');
        }, 8000);
        return;
      }
      
      // Test database connection first
      console.log('🔍 Testing database connection...');
      const dbConnected = await testDatabaseConnection();
      if (!dbConnected) {
        console.warn('⚠️ Database connection failed, proceeding with email only');
      }
      
      // Production mode: Store in database and send emails
      if (dbConnected) {
        try {
        const submissionData: ProjectSubmission = {
          project_type: projectData.projectType,
          industry: projectData.industry,
          budget: projectData.budget,
          timeline: projectData.timeline,
          features: projectData.features,
          description: projectData.description,
          contact_name: projectData.contactInfo.name,
          contact_email: projectData.contactInfo.email,
          contact_company: projectData.contactInfo.company
        };
        
        const savedSubmission = await projectService.submitProject(submissionData);
        console.log('✅ Project submission saved to database:', savedSubmission.id);
        } catch (dbError) {
          handleDatabaseError(dbError, 'project submission storage');
        console.warn('⚠️ Database storage failed, continuing with email:', dbError);
        // Continue with email sending even if database fails
        }
      } else {
        console.log('⚠️ Skipping database storage due to connection issues');
      }
      
      // Send emails via API
      console.log('📧 Sending project emails via API...');
      const response = await fetch('/api/project-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectData }),
      });
      
      console.log('📧 Project API Response status:', response.status);
      const result = await response.json();
      console.log('📧 API Response:', result);
      
      if (response.ok) {
        setSubmitSuccess(result.message || 'Project submitted successfully! Check your email for detailed proposal and next steps.');
        setIsSubmitted(true);
        
        // Reset form
        setProjectData({
          projectType: '',
          industry: '',
          budget: '',
          timeline: '',
          features: [],
          description: '',
          contactInfo: { name: '', email: '', company: '' }
        });
        setCurrentStep(1);
        
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitSuccess('');
        }, 10000);
      } else {
        throw new Error(result.message || 'Failed to submit project. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      
      // Clear error after 10 seconds
      setTimeout(() => {
        setSubmitError('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <SEO 
        title="AI Project Builder - Custom AI Solutions | Nexariza AI"
        description="Build your custom AI project with our interactive project builder. Get instant quotes and timeline estimates for your AI solution."
      />
      
      <AnimatePresence mode="wait">
        {contentVisible && (
          <motion.div
            key={language}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative"
          >
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                  AI Project Builder
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Design your custom AI solution with our interactive builder and get instant estimates
                </p>
              </div>
            </section>

            {/* Project Builder */}
            <section className="py-20 bg-black">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                <div className="mb-12">
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
                            <h3 className="text-green-300 font-semibold mb-2">Project Submitted Successfully! 🎉</h3>
                            <p className="text-green-200 text-sm leading-relaxed">{submitSuccess}</p>
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
                          <h4 className="text-red-300 font-semibold mb-1">Submission Error</h4>
                          <p className="text-red-300 text-sm">{submitError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step <= currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {step < currentStep ? <CheckCircle className="h-6 w-6" /> : step}
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">What type of AI solution do you need?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setProjectData(prev => ({ ...prev, projectType: type.id }))}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                              projectData.projectType === type.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <type.icon className="h-12 w-12 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">{type.name}</h3>
                            <p className="text-gray-300">{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">What's your industry?</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {industries.map((industry) => (
                          <button
                            key={industry}
                            onClick={() => setProjectData(prev => ({ ...prev, industry }))}
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                              projectData.industry === industry
                                ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                : 'border-gray-600 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Budget & Timeline</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Budget Range</h3>
                          <div className="space-y-3">
                            {budgetRanges.map((budget) => (
                              <button
                                key={budget}
                                onClick={() => setProjectData(prev => ({ ...prev, budget }))}
                                className={`w-full p-3 rounded-lg border text-left transition-all duration-300 ${
                                  projectData.budget === budget
                                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                }`}
                              >
                                {budget}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Timeline</h3>
                          <div className="space-y-3">
                            {timelineOptions.map((timeline) => (
                              <button
                                key={timeline}
                                onClick={() => setProjectData(prev => ({ ...prev, timeline }))}
                                className={`w-full p-3 rounded-lg border text-left transition-all duration-300 ${
                                  projectData.timeline === timeline
                                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                }`}
                              >
                                {timeline}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Select Features</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {availableFeatures.map((feature) => (
                          <button
                            key={feature}
                            onClick={() => handleFeatureToggle(feature)}
                            className={`p-4 rounded-xl border transition-all duration-300 text-center ${
                              projectData.features.includes(feature)
                                ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                : 'border-gray-600 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {feature}
                          </button>
                        ))}
                      </div>
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Project Description</h3>
                        <textarea
                          value={projectData.description}
                          onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your project requirements, goals, and any specific needs..."
                          className="w-full h-32 p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-white font-medium mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={projectData.contactInfo.name}
                            onChange={(e) => setProjectData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, name: e.target.value }
                            }))}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Email *</label>
                          <input
                            type="email"
                            value={projectData.contactInfo.email}
                            onChange={(e) => setProjectData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, email: e.target.value }
                            }))}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="john@company.com"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-white font-medium mb-2">Company</label>
                          <input
                            type="text"
                            value={projectData.contactInfo.company}
                            onChange={(e) => setProjectData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, company: e.target.value }
                            }))}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Your Company"
                          />
                        </div>
                      </div>

                      {/* Project Summary */}
                      <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                        <h3 className="text-xl font-semibold text-white mb-4">Project Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white ml-2">{projectTypes.find(t => t.id === projectData.projectType)?.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Industry:</span>
                            <span className="text-white ml-2">{projectData.industry}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Budget:</span>
                            <span className="text-white ml-2">{projectData.budget}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Timeline:</span>
                            <span className="text-white ml-2">{projectData.timeline}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-gray-400">Features:</span>
                            <span className="text-white ml-2">{projectData.features.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {currentStep < 5 ? (
                      <button
                        onClick={nextStep}
                        disabled={
                          (currentStep === 1 && !projectData.projectType) ||
                          (currentStep === 2 && !projectData.industry) ||
                          (currentStep === 3 && (!projectData.budget || !projectData.timeline))
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !projectData.contactInfo.name || !projectData.contactInfo.email}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Submit Project</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectBuilder;