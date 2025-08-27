import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Award, Users, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO, { seoConfigs } from '../components/SEO';

const Teams: React.FC = () => {
  const { t, language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

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

  const teamMembers = [
    {
      id: 1,
      name: 'Ahmad Yasin',
      role: 'CEO & Founder',
      bio: 'Visionary AI expert and entrepreneur with deep expertise in neural networks, machine learning, and enterprise AI solutions. Leading Nexariza AI to transform businesses worldwide with innovative AI technologies.',
      image: 'https://ik.imagekit.io/2t5jvenlr/WhatsApp_Image_2025-08-27_at_23.25.38_ae390ece-removebg-preview.png?updatedAt=1756319311282',
      expertise: ['AI Strategy', 'Neural Networks', 'Business Leadership', 'Innovation Management'],
      social: {
        linkedin: 'http://www.linkedin.com/in/mian-ahmad-yasin',
        github: 'https://github.com/Ahmadyasin1',
        email: 'ahmad_yasin@nexariza.com'
      },
      achievements: ['AI Industry Pioneer', 'Tech Innovation Leader', 'Business Transformation Expert'],
      location: 'Lahore, Pakistan',
      joinDate: 'Founder - 2024',
      isFounder: true
    },
    {
      id: 2,
      name: 'Abdul Rehman',
      role: 'Senior AI Engineer',
      bio: 'Former Google AI Researcher with 12+ years of experience in advancing machine learning, deep learning, and neural network architectures. Proven track record in designing and scaling large AI systems, leading research initiatives, and driving innovation in applied artificial intelligence.',
      image: 'https://ik.imagekit.io/2t5jvenlr/17221672231404556-removebg-preview.png?updatedAt=1756320396462',
      expertise: ['Machine Learning', 'Deep Learning', 'Neural Architecture', 'Research & Development'],
      social: {
        linkedin: 'https://www.linkedin.com/in/abdul-rehman-a49365320',
        github: 'https://github.com/Abdul-Rehman-44',
        email: 'abdul_rehman@nexariza.com'
      },
      achievements: ['AI Visionary Award', 'AI Researcher of the Year', 'TEDx Speaker'],
      location: 'Lahore, Pakistan',
      joinDate: 'March 2024',
      isFounder: false
    },
    {
      id: 3,
      name: 'Muhammad Anas',
      role: 'Lead AI Developer',
      bio: 'Full-stack AI developer specializing in computer vision and autonomous systems. Former Tesla engineer with expertise in real-time AI processing and edge computing solutions.',
      image: 'https://ik.imagekit.io/2t5jvenlr/163725130.jpeg?updatedAt=1756320900270',
      expertise: ['Computer Vision', 'Full-Stack Development', 'Edge Computing', 'Real-time Systems'],
      social: {
        linkedin: 'https://www.linkedin.com/in/muhammad-anas10/',
        github: 'https://github.com/anasdev-10',
        email: 'muhammad_anas@nexariza.com'
      },
      achievements: ['Tech Innovation Award', 'Patent Holder (8)', 'Open Source Contributor'],
      location: 'Lahore, Pakistan',
      joinDate: 'May 2024',
      isFounder: false
    },
    {
      id: 4,
      name: 'Eman Sarfaraz',
      role: 'AI Consultant',
      bio: 'Strategic AI consultant with expertise in enterprise AI implementation and business transformation. PhD from MIT with focus on AI ethics and responsible AI development.',
      image: 'https://ik.imagekit.io/2t5jvenlr/17221672231404556-removebg-preview.png?updatedAt=1756320396462',
      expertise: ['AI Strategy', 'Enterprise Consulting', 'AI Ethics', 'Business Transformation'],
      social: {
        linkedin: 'https://www.linkedin.com/in/eman-sarfraz-146a8728a/',
        github: 'https://github.com/Eman-Sarfraz',
        email: 'eman_sarfaraz@nexariza.com'
      },
      achievements: ['AI Ethics Leader', 'Enterprise Consultant', 'Industry Speaker'],
      location: 'Lahore, Pakistan',
      joinDate: 'July 2024',
      isFounder: false
    }
  ];

  const stats = [
    { number: '4', label: 'Core Team Members', icon: Users },
    { number: '50+', label: 'Combined Years Experience', icon: Award },
    { number: '500+', label: 'Projects Delivered', icon: ExternalLink },
    { number: '98%', label: 'Client Satisfaction', icon: Award }
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO {...seoConfigs.teams} />
      
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
            {t('teams.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('teams.hero.subtitle')}
          </p>
          
          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-2xl border border-blue-700/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3 mx-auto">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              World-class AI professionals dedicated to transforming your vision into reality
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Founder Badge */}
                {member.isFounder && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                    FOUNDER
                  </div>
                )}

                {/* Profile Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Social Links - Show on Hover */}
                  <AnimatePresence>
                    {hoveredMember === member.id && (
                      <motion.div
                        className="absolute top-4 right-4 flex flex-col space-y-2"
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        transition={{ duration: 0.3, staggerChildren: 0.1 }}
                      >
                        <motion.a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-full hover:bg-blue-500 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                          whileHover={{ rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Linkedin className="h-4 w-4" />
                        </motion.a>
                        <motion.a 
                          href={member.social.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-700/90 backdrop-blur-sm text-white rounded-full hover:bg-gray-600 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-gray-500/50"
                          whileHover={{ rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="h-4 w-4" />
                        </motion.a>
                        <motion.a 
                          href={`mailto:${member.social.email}`}
                          className="p-3 bg-red-600/90 backdrop-blur-sm text-white rounded-full hover:bg-red-500 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                          whileHover={{ rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Mail className="h-4 w-4" />
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Member Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 font-semibold text-lg mb-2">{member.role}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Bio */}
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30 hover:bg-blue-600/30 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Achievement */}
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-semibold">Key Achievement</span>
                    </div>
                    <p className="text-gray-300 text-sm">{member.achievements[0]}</p>
                  </div>

                  {/* Contact Button */}
                  <motion.a
                    href={`mailto:${member.social.email}?subject=Hello from Nexariza AI Website&body=Hi ${member.name},%0D%0A%0D%0AI visited the Nexariza AI website and would like to connect.%0D%0A%0D%0AThank you!`}
                    className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Get in Touch</span>
                  </motion.a>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Our Team Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that unite our team and drive our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Innovation First',
                description: 'We push the boundaries of AI technology to create breakthrough solutions'
              },
              {
                icon: '🤝',
                title: 'Collaboration',
                description: 'Working together to achieve extraordinary results for our clients'
              },
              {
                icon: '🎯',
                title: 'Excellence',
                description: 'Delivering world-class quality in every project and interaction'
              },
              {
                icon: '💡',
                title: 'Continuous Learning',
                description: 'Staying at the forefront of AI research and technological advancement'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Be part of the team that's transforming businesses with AI innovation. 
              We're always looking for talented individuals who share our passion for excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/25"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/jobs'}
              >
                View Open Positions
              </motion.button>
              <motion.button 
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'mailto:careers@nexariza.com?subject=Interest in Joining Nexariza AI Team&body=Hello Nexariza AI Team,%0D%0A%0D%0AI am interested in joining your team and would like to learn more about opportunities.%0D%0A%0D%0AThank you!'}
              >
                Send Your Resume
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Culture Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Our Team Culture
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  At Nexariza AI, we foster a culture of innovation, collaboration, and continuous learning. 
                  Our team combines diverse backgrounds and expertise to tackle the most challenging AI problems.
                </p>
                <p>
                  We believe in empowering each team member to contribute their unique perspective while working 
                  together toward our shared mission of transforming businesses through artificial intelligence.
                </p>
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-6 rounded-xl border border-blue-700/30">
                  <p className="font-semibold text-blue-300 mb-2">
                    "Our strength lies in our diversity of thought and our shared commitment to excellence."
                  </p>
                  <p className="text-blue-200 text-sm">- Ahmad Yasin, CEO & Founder</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl border border-gray-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl border border-blue-500 shadow-xl">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-blue-200 text-sm">Remote Friendly</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-black">
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
                icon: '🚀',
                title: 'Cutting-Edge Projects',
                description: 'Work on revolutionary AI projects that shape the future of technology and business transformation'
              },
              {
                icon: '🌟',
                title: 'World-Class Team',
                description: 'Collaborate with top AI researchers, engineers, and consultants from leading tech companies'
              },
              {
                icon: '📈',
                title: 'Career Growth',
                description: 'Accelerate your career with mentorship, learning opportunities, and leadership development'
              },
              {
                icon: '💰',
                title: 'Competitive Benefits',
                description: 'Comprehensive compensation package with equity, health benefits, and professional development'
              },
              {
                icon: '🌍',
                title: 'Remote Flexibility',
                description: 'Work from anywhere with flexible hours and a strong remote-first culture'
              },
              {
                icon: '🎯',
                title: 'Impact & Purpose',
                description: 'Make a real difference by building AI solutions that transform businesses globally'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="group text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;