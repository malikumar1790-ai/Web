import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Star, Trophy, Target, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

const Milestones: React.FC = () => {
  const { language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);

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

  const milestones = {
    2024: [
      {
        id: 1,
        date: 'January 2024',
        title: 'Nexariza AI Founded',
        description: 'Ahmad Yasin establishes Nexariza AI with a vision to transform businesses through custom AI solutions.',
        icon: Star,
        status: 'completed',
        impact: 'Company Launch'
      },
      {
        id: 2,
        date: 'March 2024',
        title: 'First AI Chatbot Deployed',
        description: 'Successfully launched our first enterprise AI chatbot, achieving 95% customer satisfaction.',
        icon: CheckCircle,
        status: 'completed',
        impact: '95% Satisfaction Rate'
      },
      {
        id: 3,
        date: 'May 2024',
        title: '50+ Projects Milestone',
        description: 'Reached 50 successful AI project deployments across various industries.',
        icon: Trophy,
        status: 'completed',
        impact: '50+ Projects'
      },
      {
        id: 4,
        date: 'July 2024',
        title: 'Computer Vision Breakthrough',
        description: 'Achieved 99.5% accuracy in manufacturing quality control systems.',
        icon: Target,
        status: 'completed',
        impact: '99.5% Accuracy'
      },
      {
        id: 5,
        date: 'September 2024',
        title: '100+ Enterprise Clients',
        description: 'Expanded client base to over 100 enterprise customers worldwide.',
        icon: Users,
        status: 'completed',
        impact: '100+ Clients'
      },
      {
        id: 6,
        date: 'November 2024',
        title: 'AI Platform Launch',
        description: 'Launched comprehensive AI development platform with lifetime support.',
        icon: Zap,
        status: 'completed',
        impact: 'Platform Launch'
      },
      {
        id: 7,
        date: 'December 2024',
        title: '500+ Projects Delivered',
        description: 'Successfully delivered over 500 AI projects with 98% client satisfaction.',
        icon: Trophy,
        status: 'completed',
        impact: '500+ Projects'
      }
    ],
    2025: [
      {
        id: 8,
        date: 'Q1 2025',
        title: 'Global Expansion',
        description: 'Expanding operations to serve clients across 50+ countries with localized support.',
        icon: Target,
        status: 'in-progress',
        impact: '50+ Countries'
      },
      {
        id: 9,
        date: 'Q2 2025',
        title: 'AI Research Lab',
        description: 'Establishing dedicated AI research laboratory for cutting-edge innovation.',
        icon: Star,
        status: 'planned',
        impact: 'Research Lab'
      },
      {
        id: 10,
        date: 'Q3 2025',
        title: '1000+ Projects Goal',
        description: 'Targeting delivery of 1000+ successful AI projects with enhanced capabilities.',
        icon: Trophy,
        status: 'planned',
        impact: '1000+ Projects'
      },
      {
        id: 11,
        date: 'Q4 2025',
        title: 'AI Certification Program',
        description: 'Launching comprehensive AI certification program for developers and businesses.',
        icon: CheckCircle,
        status: 'planned',
        impact: 'Certification Program'
      }
    ]
  };

  const stats = [
    { number: '2024', label: 'Founded', icon: Calendar },
    { number: '500+', label: 'Projects Delivered', icon: Trophy },
    { number: '150+', label: 'Happy Clients', icon: Users },
    { number: '98%', label: 'Success Rate', icon: Star }
  ];

  const currentMilestones = milestones[selectedYear as keyof typeof milestones] || [];

  return (
    <div className="min-h-screen pt-16">
      <SEO 
        title="Company Milestones - Nexariza AI Journey | Ahmad Yasin"
        description="Explore Nexariza AI's journey from founding to becoming a leading AI development company. Key milestones, achievements, and future goals."
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
                    backgroundImage: 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                  Our Journey
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  From startup to industry leader - discover the milestones that shaped Nexariza AI's success story
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-2xl border border-blue-700/30 p-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3 mx-auto">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Year Selector */}
            <section className="py-8 bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-4">
                  {[2024, 2025].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                        selectedYear === year
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-black">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400"></div>
                  
                  {/* Milestones */}
                  <div className="space-y-12">
                    {currentMilestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        className="relative flex items-start space-x-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        {/* Timeline Dot */}
                        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                          milestone.status === 'completed' 
                            ? 'bg-green-600 border-green-400' 
                            : milestone.status === 'in-progress'
                            ? 'bg-yellow-600 border-yellow-400'
                            : 'bg-gray-600 border-gray-400'
                        }`}>
                          <milestone.icon className="h-8 w-8 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 hover:border-blue-500 transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-blue-400 font-medium">{milestone.date}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  milestone.status === 'completed' 
                                    ? 'bg-green-600/20 text-green-300' 
                                    : milestone.status === 'in-progress'
                                    ? 'bg-yellow-600/20 text-yellow-300'
                                    : 'bg-gray-600/20 text-gray-300'
                                }`}>
                                  {milestone.status === 'completed' ? 'Completed' : 
                                   milestone.status === 'in-progress' ? 'In Progress' : 'Planned'}
                                </span>
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-3">{milestone.title}</h3>
                              <p className="text-gray-300 leading-relaxed mb-4">{milestone.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400 mb-1">Impact</div>
                              <div className="text-lg font-semibold text-blue-400">{milestone.impact}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Future Vision */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Vision 2025 & Beyond
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Our roadmap for the future of AI development and business transformation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-2xl border border-blue-700/30 p-8 text-center">
                    <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Global Leadership</h3>
                    <p className="text-gray-300">Become the world's leading AI development company with presence in 100+ countries</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-2xl border border-purple-700/30 p-8 text-center">
                    <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Innovation Hub</h3>
                    <p className="text-gray-300">Establish cutting-edge AI research facilities and innovation centers worldwide</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-2xl border border-green-700/30 p-8 text-center">
                    <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Community Impact</h3>
                    <p className="text-gray-300">Empower 10,000+ businesses with AI solutions and create 1,000+ tech jobs</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Be Part of Our Journey
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Join us as we continue to push the boundaries of AI innovation and transform businesses worldwide
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                    Start Your Project
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300">
                    Join Our Team
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

export default Milestones;