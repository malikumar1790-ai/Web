import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Lightbulb, Heart, Zap } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO, { seoConfigs } from '../components/SEO';

const About: React.FC = () => {
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

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI technology'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Ethical AI development with transparency and responsibility'
    },
    {
      icon: Zap,
      title: 'Excellence',
      description: 'Delivering world-class solutions that exceed expectations'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working together to create transformative AI experiences'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO {...seoConfigs.about} />
      
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
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
          <p className="text-lg text-gray-400 max-w-5xl mx-auto mt-6 leading-relaxed">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* About Nexariza Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  About Nexariza
                </h2>
              </div>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Founded in 2024 by Ahmad Yasin, Nexariza AI has emerged as a leading provider of custom artificial intelligence solutions. 
                  Our mission is to transform innovative ideas into practical AI systems that deliver real business value.
                </p>
                <p>
                  With expertise spanning Neural Networks, Large Language Models, Natural Language Processing, and Full-Stack Development, 
                  we create end-to-end AI solutions that integrate seamlessly with modern business operations.
                </p>
                <p>
                  Our unique approach combines cutting-edge AI research with practical business applications, ensuring that every solution 
                  we develop not only showcases technical excellence but also drives measurable results for our clients.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="AI Technology"
                className="rounded-2xl shadow-2xl border border-gray-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl border border-blue-500">
                <div className="text-2xl font-bold text-white">2024</div>
                <div className="text-blue-200">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Target className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Our Mission
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 md:p-12 rounded-3xl border border-gray-700">
            <p className="text-xl md:text-2xl text-center text-gray-200 leading-relaxed max-w-4xl mx-auto">
              "To revolutionize how businesses operate by making artificial intelligence accessible, 
              ethical, and transformative. We believe AI should augment human capabilities, creating 
              a future where technology serves humanity's greatest ambitions."
            </p>
            <div className="text-center mt-8">
              <p className="text-blue-400 font-semibold">- Ahmad Yasin, Founder & CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision and innovation at Nexariza AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 mx-auto group-hover:bg-blue-500 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Philosophy Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Technology Philosophy"
                className="rounded-2xl shadow-2xl border border-gray-700"
              />
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Our Technology Philosophy
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  We believe that artificial intelligence should be built with human values at its core. 
                  Our approach combines cutting-edge research with practical applications, ensuring that 
                  every solution we develop is both innovative and responsible.
                </p>
                <p>
                  Our technology stack leverages the latest advances in machine learning, deep learning, 
                  and neural networks, while maintaining the highest standards of security, privacy, 
                  and ethical AI development.
                </p>
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-6 rounded-xl border border-blue-700/30">
                  <p className="font-semibold text-blue-300">
                    "We don't just build AI systems; we craft intelligent experiences that enhance human potential."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Work Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join the ranks of industry leaders who trust Nexariza AI to power their digital transformation. 
            Let's build the future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Today
            </Link>
            <Link
              to="/project-builder"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Build Your Project
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

export default About;