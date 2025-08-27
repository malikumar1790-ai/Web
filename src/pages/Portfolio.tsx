import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO, { seoConfigs } from '../components/SEO';

const Portfolio: React.FC = () => {
  const { t, language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);

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

  const projects = [
    {
      id: 1,
      title: 'AI-Powered Customer Service Bot',
      description: 'Intelligent chatbot that handles 95% of customer inquiries with human-like responses and seamless escalation',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['Natural Language Processing', 'Machine Learning', 'Real-time Analytics'],
      metrics: {
        satisfaction: '98%',
        reduction: '85%',
        response: '< 2s'
      },
      category: 'Conversational AI',
      status: 'Live',
      github: '#',
      demo: '#'
    },
    {
      id: 2,
      title: 'Real-Time Object Detection System',
      description: 'Advanced computer vision system for manufacturing quality control with 99.5% accuracy in defect detection',
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['Computer Vision', 'Deep Learning', 'Edge Computing'],
      metrics: {
        accuracy: '99.5%',
        speed: '60 FPS',
        defects: '0.01%'
      },
      category: 'Computer Vision',
      status: 'Live',
      github: '#',
      demo: '#'
    },
    {
      id: 3,
      title: 'E-Commerce Recommendation Engine',
      description: 'Personalized product recommendation system that increased sales by 240% through advanced collaborative filtering',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['Collaborative Filtering', 'Deep Neural Networks', 'Real-time Processing'],
      metrics: {
        sales: '+240%',
        engagement: '+180%',
        conversion: '+65%'
      },
      category: 'Recommendation Systems',
      status: 'Live',
      github: '#',
      demo: '#'
    },
    {
      id: 4,
      title: 'Smart Document Processing',
      description: 'Automated document analysis and data extraction system processing 10,000+ documents daily with high accuracy',
      image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['OCR Technology', 'NLP', 'Document Classification'],
      metrics: {
        accuracy: '97%',
        processing: '10K/day',
        time_saved: '89%'
      },
      category: 'Document AI',
      status: 'Live',
      github: '#',
      demo: '#'
    },
    {
      id: 5,
      title: 'Healthcare Diagnostic Assistant',
      description: 'AI-powered medical imaging analysis system assisting radiologists in early disease detection',
      image: 'https://images.pexels.com/photos/3825592/pexels-photo-3825592.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['Medical Imaging AI', 'CNN', 'HIPAA Compliance'],
      metrics: {
        accuracy: '94%',
        early_detection: '+45%',
        processing_time: '2min'
      },
      category: 'Healthcare AI',
      status: 'Beta',
      github: '#',
      demo: '#'
    },
    {
      id: 6,
      title: 'Voice-Controlled IoT Platform',
      description: 'Multi-language voice control system for smart homes and industrial IoT devices with 99% accuracy',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      tech: ['Speech Recognition', 'IoT Integration', 'Edge AI'],
      metrics: {
        accuracy: '99%',
        languages: '12',
        devices: '500+'
      },
      category: 'Voice AI',
      status: 'Live',
      github: '#',
      demo: '#'
    }
  ];

  const categories = ['All', 'Conversational AI', 'Computer Vision', 'Recommendation Systems', 'Document AI', 'Healthcare AI', 'Voice AI'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen pt-16">
      <SEO {...seoConfigs.portfolio} />
      
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
              backgroundImage: 'url(https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {t('portfolio.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('portfolio.hero.subtitle')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-900/30 to-blue-800/30 px-4 py-2 rounded-full border border-blue-700/30">
              <Zap className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300">500+ Projects Delivered</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-900/30 to-green-800/30 px-4 py-2 rounded-full border border-green-700/30">
              <Users className="h-5 w-5 text-green-400" />
              <span className="text-green-300">150+ Happy Clients</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-900/30 to-purple-800/30 px-4 py-2 rounded-full border border-purple-700/30">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span className="text-purple-300">$50M+ Value Created</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Live' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Technology Stack */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Technology Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Metrics:</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-blue-400">{value}</div>
                          <div className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <a
                      href={project.demo}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">View Demo</span>
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors duration-300"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Next AI Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Let's discuss how we can create custom AI solutions that deliver measurable results for your business.
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

export default Portfolio;