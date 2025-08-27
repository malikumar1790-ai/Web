import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle, Globe, Users, Award, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useDatabase } from '../hooks/useDatabase';
import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedFormValidation, { ValidationRules } from '../components/EnhancedFormValidation';
import SecurityManager from '../utils/security';
import { contactService, type ContactSubmission } from '../lib/supabase';
import { testDatabaseConnection, handleDatabaseError } from '../lib/supabase';
import SEO, { seoConfigs } from '../components/SEO';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const { isConnected: dbConnected, error: dbError } = useDatabase();
  const { isSubmitting, isSuccess, error: submitError, submit, reset } = useFormSubmission({
    onSuccess: () => {
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        service: ''
      });
    },
    resetDelay: 8000
  });

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });

  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Rate limiting check
    const userIP = 'user-' + Date.now(); // In production, get real IP
    if (!SecurityManager.rateLimiter.isAllowed(userIP, 5, 60000)) {
      const remainingTime = SecurityManager.rateLimiter.getRemainingTime(userIP, 60000);
      alert(`Too many attempts. Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again.`);
      return;
    }

    await submit(async () => {
      // Sanitize form data
      const sanitizedData = SecurityManager.sanitizeFormData(formData);
      
      // Check if we're in development or production
      const isDevelopment = import.meta.env.DEV || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        console.log('📧 DEVELOPMENT MODE - Form submitted:', sanitizedData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { message: 'Development mode: Form submitted successfully!' };
      }
      
      // Store in database if connected
      if (dbConnected) {
        try {
          const submissionData: ContactSubmission = {
            name: sanitizedData.name,
            email: sanitizedData.email,
            company: sanitizedData.company,
            service: sanitizedData.service,
            message: sanitizedData.message
          };
          
          await contactService.submitContactForm(submissionData);
        } catch (dbError) {
          console.warn('⚠️ Database storage failed, continuing with email:', dbError);
        }
      }
      
      // Send emails via API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      return result;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const services = [
    'Custom AI/ML Development',
    'Neural Networks & LLMs',
    'Computer Vision Solutions',
    'Natural Language Processing',
    'Full-Stack AI Integration',
    'Enterprise AI Consulting',
    'Business Process Automation',
    'AI Strategy & Planning',
    'Data Science & Analytics',
    'Cloud AI Deployment',
    'AI Training & Support',
    'Custom AI Solution'
  ];

  const contactInfo = {
    domain: 'www.nexariza.com',
    email: 'contact@nexariza.com',
    phone: 'Available upon request',
    consultation: 'Request a Free Consultation',
    discovery: 'Schedule a Discovery Call'
  };

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Direct collaboration with Ahmad Yasin and world-class AI specialists'
    },
    {
      icon: Award,
      title: 'Custom Solutions',
      description: 'Tailored AI systems built from scratch for your specific business needs'
    },
    {
      icon: Globe,
      title: 'Lifetime Partnership',
      description: 'Ongoing support, maintenance, and system evolution with guaranteed SLA'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO {...seoConfigs.contact} />
      
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
              backgroundImage: 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Get Your Free AI Consultation</h2>
              <p className="text-gray-300 mb-8">
                Fill out the form below and our AI experts will get back to you within 24 hours with a custom solution proposal and project timeline. 
                <span className="text-blue-300 font-semibold"> You'll also receive an instant confirmation email with next steps.</span>
              </p>

              {/* Success Message */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    className="mb-6 p-6 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/50 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-green-300 font-semibold mb-2">Message Sent Successfully! 🎉</h3>
                        <p className="text-green-200 text-sm leading-relaxed">
                          Thank you for contacting Nexariza AI! We've received your message and will respond within 24 hours. Please check your email for a detailed confirmation with next steps.
                        </p>
                        <div className="mt-3 p-3 bg-green-800/20 rounded-lg">
                          <p className="text-green-300 text-xs">
                            📧 Emails sent to: contact@nexariza.com (admin) and {formData.email || 'your email'} (confirmation)
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
                    className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start space-x-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-300 font-semibold mb-1">Submission Error</h4>
                      <p className="text-red-300 text-sm mb-2">{submitError}</p>
                      <p className="text-red-400 text-xs mt-1">
                        Alternative: Contact us directly at contact@nexariza.com or try submitting again.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      aria-describedby="name-validation"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                    />
                    <div id="name-validation">
                      <EnhancedFormValidation
                        value={formData.name}
                        rules={[
                          ValidationRules.required('Name is required'),
                          ValidationRules.minLength(2, 'Name must be at least 2 characters'),
                          ValidationRules.maxLength(100, 'Name must be less than 100 characters'),
                          ValidationRules.noSpecialChars('Name cannot contain special characters')
                        ]}
                        showValidation={showValidation}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-describedby="email-validation"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="john@company.com"
                    />
                    <div id="email-validation">
                      <EnhancedFormValidation
                        value={formData.email}
                        rules={[
                          ValidationRules.required('Email is required'),
                          ValidationRules.email('Please enter a valid email address'),
                          ValidationRules.maxLength(254, 'Email is too long')
                        ]}
                        showValidation={showValidation}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.service')}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    aria-required="true"
                    aria-describedby="message-validation message-counter"
                    minLength={10}
                    maxLength={2000}
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your project, goals, and how we can help transform your business with AI..."
                  />
                  <div id="message-counter" className="mt-1 text-right">
                    <span className={`text-xs ${formData.message.length > 1800 ? 'text-red-400' : 'text-gray-400'}`}>
                      {formData.message.length}/2000 characters
                    </span>
                  </div>
                  <div id="message-validation">
                    <EnhancedFormValidation
                      value={formData.message}
                      rules={[
                        ValidationRules.required('Message is required'),
                        ValidationRules.minLength(10, 'Please provide a more detailed message (minimum 10 characters)'),
                        ValidationRules.maxLength(2000, 'Message is too long (maximum 2000 characters)')
                      ]}
                      showValidation={showValidation}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message || formData.message.length < 10}
                  aria-describedby="submit-status"
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" text="Sending emails..." type="dots" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{t('contact.form.send')}</span>
                    </>
                  )}
                </button>

                <div id="submit-status" className="sr-only" aria-live="polite">
                  {isSubmitting && "Form is being submitted"}
                  {isSuccess && "Form submitted successfully"}
                  {submitError && `Error: ${submitError}`}
                </div>

                <p className="text-center text-gray-400 text-sm">
                  By submitting this form, you agree to receive communications from Nexariza AI. 
                  We respect your privacy and will never share your information. You'll receive an instant confirmation email.
                </p>

                {/* Database Status Indicator */}
                {!dbConnected && (
                  <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <p className="text-yellow-300 text-sm">
                        Database temporarily unavailable. Your message will still be sent via email.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Business Hours</h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700/30">
                    <p className="text-blue-300 text-sm">
                      <strong>24/7 Emergency Support</strong> available for enterprise clients with active projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Mail className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Contact Information</h3>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="font-semibold text-white mb-3">🌐 Website</h4>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <a 
                        href="https://www.nexariza.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        {contactInfo.domain}
                      </a>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="font-semibold text-white mb-3">📧 Email</h4>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">📞 Quick Actions</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.location.href = `mailto:${contactInfo.email}?subject=Free AI Consultation Request&body=Hello Nexariza AI team,%0D%0A%0D%0AI'm interested in learning more about your AI solutions and would like to schedule a free consultation.%0D%0A%0D%0APlease let me know your availability.%0D%0A%0D%0AThank you!`}
                        className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Phone className="h-4 w-4" />
                        <span>📞 Request Free Consultation →</span>
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = `mailto:${contactInfo.email}?subject=Discovery Call Request&body=Hello Nexariza AI team,%0D%0A%0D%0AI would like to schedule a discovery call to discuss my AI project requirements.%0D%0A%0D%0AProject details:%0D%0A- Industry: [Your Industry]%0D%0A- Goal: [Your Goal]%0D%0A- Timeline: [Your Timeline]%0D%0A%0D%0APlease let me know your availability.%0D%0A%0D%0AThank you!`}
                        className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Clock className="h-4 w-4" />
                        <span>📅 Schedule Discovery Call →</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time Guarantee */}
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-2xl border border-green-700/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                  Response Time Guarantee
                </h3>
                <div className="space-y-3 text-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Initial response within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Detailed proposal within 48 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Free consultation call within 72 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Nexariza Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Why Choose Nexariza AI?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join hundreds of companies that trust us to deliver world-class AI solutions with measurable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                className="group text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 mx-auto group-hover:bg-blue-500 transition-colors duration-300">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2024</div>
              <div className="text-gray-300">Founded by Ahmad Yasin</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">AI Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Premium Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Vision into Reality?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Get your free consultation with Ahmad Yasin and discover how Nexariza AI can build custom solutions that deliver real business value with lifetime support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = `mailto:${contactInfo.email}?subject=Free AI Consultation Request`}
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Get Free Consultation
            </button>
            <button 
              onClick={() => window.location.href = '/portfolio'}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              View Our Work
            </button>
          </div>
        </div>
      </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;