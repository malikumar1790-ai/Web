import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Users, Award, ArrowRight, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { jobService, type Job } from '../lib/supabase';
import SEO from '../components/SEO';

const Jobs: React.FC = () => {
  const { language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setContentVisible(false);
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, [language]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobService.getAllJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || job.job_type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'internship'];

  return (
    <div className="min-h-screen pt-16">
      <SEO 
        title="Careers at Nexariza AI - Join Our AI Team | Remote AI Jobs"
        description="Join the leading AI development company. Explore exciting career opportunities in AI engineering, research, and development. Remote positions available worldwide."
        keywords="AI jobs, machine learning careers, AI engineer positions, remote AI work, AI company jobs, neural network jobs, AI research positions"
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
                  Join Our AI Team
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  Shape the future of artificial intelligence with Nexariza AI. Work on cutting-edge projects that transform businesses worldwide.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-900/30 to-blue-800/30 px-6 py-3 rounded-full border border-blue-700/30">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-300 font-semibold">Remote-First Culture</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-900/30 to-green-800/30 px-6 py-3 rounded-full border border-green-700/30">
                    <Award className="h-5 w-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Competitive Benefits</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-900/30 to-purple-800/30 px-6 py-3 rounded-full border border-purple-700/30">
                    <Briefcase className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">Growth Opportunities</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Search and Filter */}
            <section className="py-8 bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Jobs Listing */}
            <section className="py-20 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {filteredJobs.length === 0 ? (
                      <div className="text-center py-20">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
                        <p className="text-gray-400">Try adjusting your search criteria or check back later for new opportunities.</p>
                      </div>
                    ) : (
                      filteredJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <div className="p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                                    <p className="text-blue-400 font-medium">{job.company}</p>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                                  </div>
                                  {job.salary_range && (
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="h-4 w-4 text-gray-400" />
                                      <span>{job.salary_range}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-shrink-0">
                                <Link
                                  to={`/jobs/${job.id}/apply`}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 space-x-2"
                                >
                                  <span>Apply Now</span>
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6">
                              {job.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="text-white font-semibold mb-3">Requirements</h4>
                                <ul className="space-y-1">
                                  {job.requirements.slice(0, 3).map((req, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                                      <span className="text-blue-400 mr-2">•</span>
                                      {req}
                                    </li>
                                  ))}
                                  {job.requirements.length > 3 && (
                                    <li className="text-blue-400 text-sm">
                                      +{job.requirements.length - 3} more requirements
                                    </li>
                                  )}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-white font-semibold mb-3">Responsibilities</h4>
                                <ul className="space-y-1">
                                  {job.responsibilities.slice(0, 3).map((resp, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                                      <span className="text-green-400 mr-2">•</span>
                                      {resp}
                                    </li>
                                  ))}
                                  {job.responsibilities.length > 3 && (
                                    <li className="text-green-400 text-sm">
                                      +{job.responsibilities.length - 3} more responsibilities
                                    </li>
                                  )}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-white font-semibold mb-3">Benefits</h4>
                                <ul className="space-y-1">
                                  {job.benefits.slice(0, 3).map((benefit, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                                      <span className="text-purple-400 mr-2">•</span>
                                      {benefit}
                                    </li>
                                  ))}
                                  {job.benefits.length > 3 && (
                                    <li className="text-purple-400 text-sm">
                                      +{job.benefits.length - 3} more benefits
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Why Work With Us */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Why Work at Nexariza AI?
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Join a team that's passionate about pushing the boundaries of AI innovation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Award,
                      title: 'Cutting-Edge Projects',
                      description: 'Work on revolutionary AI projects that shape the future of technology'
                    },
                    {
                      icon: Users,
                      title: 'World-Class Team',
                      description: 'Collaborate with top AI researchers and engineers from around the globe'
                    },
                    {
                      icon: Briefcase,
                      title: 'Career Growth',
                      description: 'Accelerate your career with mentorship and learning opportunities'
                    }
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="group text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 mx-auto group-hover:bg-blue-500 transition-colors duration-300">
                        <benefit.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Join Our Mission?
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Be part of the team that's transforming businesses with AI innovation. Apply today and help shape the future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => document.querySelector('.jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                  >
                    View Open Positions
                  </button>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
                  >
                    Contact HR Team
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

export default Jobs;