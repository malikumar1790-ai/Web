import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code, Database, Cloud, Shield, Users, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO, { seoConfigs } from '../components/SEO';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);

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

  const services = [
    {
      id: 1,
      icon: Brain,
      title: 'Custom AI/ML Development',
      description: 'Build AI models from scratch with Neural Networks, LLMs, NLP, and advanced machine learning systems',
      features: ['Neural Network Architecture', 'Deep Learning Models', 'Custom Algorithms', 'Model Optimization'],
      pricing: 'Starting at $15,000',
      timeline: '4-8 weeks',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    },
    {
      id: 2,
      icon: Code,
      title: 'Full-Stack AI Integration',
      description: 'Seamless AI integration into websites and applications using modern frameworks and technologies',
      features: ['React/Next.js Integration', 'API Development', 'Real-time Processing', 'Scalable Architecture'],
      pricing: 'Starting at $8,000',
      timeline: '2-4 weeks',
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    },
    {
      id: 3,
      icon: Database,
      title: 'Data Science & Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics and predictive modeling',
      features: ['Data Pipeline Design', 'Predictive Analytics', 'Business Intelligence', 'Custom Dashboards'],
      pricing: 'Starting at $12,000',
      timeline: '3-6 weeks',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    },
    {
      id: 4,
      icon: Cloud,
      title: 'Enterprise AI Consulting',
      description: 'Strategic AI implementation guidance for enterprise digital transformation and growth',
      features: ['AI Strategy Planning', 'Technology Assessment', 'Implementation Roadmap', 'Team Training'],
      pricing: 'Starting at $25,000',
      timeline: '6-12 weeks',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    },
    {
      id: 5,
      icon: Shield,
      title: 'AI Security & Compliance',
      description: 'Ensure your AI systems meet security standards and regulatory compliance requirements',
      features: ['Security Audits', 'Compliance Assessment', 'Risk Management', 'Data Protection'],
      pricing: 'Starting at $10,000',
      timeline: '2-4 weeks',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    },
    {
      id: 6,
      icon: Users,
      title: 'Lifetime Partnership Support',
      description: 'Premium partnership with ongoing maintenance, updates, monitoring, and dedicated support',
      features: ['24/7 Monitoring', 'Regular Updates', 'Performance Optimization', 'Dedicated Support'],
      pricing: 'Included with all projects',
      timeline: 'Ongoing',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop'
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Discovery & Planning',
      description: 'We analyze your requirements and create a detailed project roadmap',
      duration: '1-2 weeks'
    },
    {
      step: 2,
      title: 'Development & Testing',
      description: 'Our experts build and rigorously test your custom AI solution',
      duration: '2-6 weeks'
    },
    {
      step: 3,
      title: 'Deployment & Integration',
      description: 'Seamless deployment with full integration into your existing systems',
      duration: '1-2 weeks'
    },
    {
      step: 4,
      title: 'Ongoing Support',
      description: 'Lifetime partnership with continuous monitoring and optimization',
      duration: 'Ongoing'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO {...seoConfigs.services} />
      
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
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                  {t('services.hero.title')}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  {t('services.hero.subtitle')}
                </p>
              </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Service Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <service.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-blue-400 font-semibold">{service.pricing}</div>
                            <div className="text-gray-400 text-sm">{service.timeline}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>

                        {/* Expandable Features */}
                        <AnimatePresence>
                          {selectedService === service.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-700 pt-4 mt-4"
                            >
                              <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                              <div className="space-y-2">
                                {service.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                              <Link
                                to="/contact"
                                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300 space-x-2"
                              >
                                <span>Get Started</span>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Our Development Process
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    A proven methodology that ensures successful AI implementation from concept to deployment
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      className="text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                        {index < processSteps.length - 1 && (
                          <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-300 mb-2">{step.description}</p>
                      <div className="text-blue-400 font-semibold text-sm">{step.duration}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Let's discuss your AI project and create a custom solution that delivers real business value
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/project-builder"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 space-x-2"
                  >
                    <span>Start Your Project</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
                  >
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;