import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings, Zap, Brain, Globe } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

const VoiceBotAI: React.FC = () => {
  const { language } = useLanguage();
  const [contentVisible, setContentVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female',
    speed: 1.0,
    pitch: 1.0,
    language: 'en-US'
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

  const features = [
    {
      icon: Brain,
      title: 'Advanced NLP',
      description: 'Natural language understanding with context awareness and sentiment analysis'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Support for 50+ languages with native pronunciation and cultural context'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Lightning-fast response times under 200ms for seamless conversations'
    }
  ];

  const voiceOptions = [
    { id: 'female', name: 'Sarah (Female)', accent: 'US English' },
    { id: 'male', name: 'David (Male)', accent: 'US English' },
    { id: 'british', name: 'Emma (Female)', accent: 'British English' },
    { id: 'australian', name: 'Jack (Male)', accent: 'Australian English' }
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with speech recognition API
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Here you would integrate with text-to-speech API
  };

  const playDemo = () => {
    setIsPlaying(!isPlaying);
    // Here you would play a demo conversation
  };

  return (
    <div className="min-h-screen pt-16">
      <SEO 
        title="Voice AI Bot - Advanced Voice Recognition | Nexariza AI"
        description="Experience our advanced Voice AI Bot with natural language processing, multi-language support, and real-time conversation capabilities."
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
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                  Voice AI Bot
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  Experience the future of voice interaction with our advanced AI-powered voice bot
                </p>
                
                {/* Voice Visualizer */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center ${
                      isListening ? 'animate-pulse bg-blue-500/20' : 'bg-gray-900/50'
                    }`}>
                      <Mic className={`h-16 w-16 ${isListening ? 'text-blue-300' : 'text-gray-400'}`} />
                    </div>
                    {isListening && (
                      <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Demo */}
            <section className="py-20 bg-black">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Voice Interface */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Try Voice AI</h2>
                    
                    {/* Voice Controls */}
                    <div className="flex justify-center space-x-6 mb-8">
                      <button
                        onClick={toggleListening}
                        className={`p-6 rounded-full transition-all duration-300 ${
                          isListening
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                      >
                        {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                      </button>
                      
                      <button
                        onClick={toggleSpeaking}
                        className={`p-6 rounded-full transition-all duration-300 ${
                          isSpeaking
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-white hover:bg-gray-500'
                        }`}
                      >
                        {isSpeaking ? <Volume2 className="h-8 w-8" /> : <VolumeX className="h-8 w-8" />}
                      </button>
                      
                      <button
                        onClick={playDemo}
                        className="p-6 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-all duration-300"
                      >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </button>
                    </div>

                    {/* Status Display */}
                    <div className="text-center mb-6">
                      {isListening && (
                        <div className="text-blue-400 font-semibold">
                          🎤 Listening... Speak now
                        </div>
                      )}
                      {isSpeaking && (
                        <div className="text-green-400 font-semibold">
                          🔊 Speaking... AI is responding
                        </div>
                      )}
                      {isPlaying && (
                        <div className="text-purple-400 font-semibold">
                          ▶️ Playing demo conversation
                        </div>
                      )}
                      {!isListening && !isSpeaking && !isPlaying && (
                        <div className="text-gray-400">
                          Click microphone to start voice interaction
                        </div>
                      )}
                    </div>

                    {/* Voice Settings */}
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Voice Settings</h3>
                        <Settings className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Voice</label>
                          <select
                            value={voiceSettings.voice}
                            onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {voiceOptions.map(voice => (
                              <option key={voice.id} value={voice.id}>
                                {voice.name} - {voice.accent}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Speed: {voiceSettings.speed}x</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={voiceSettings.speed}
                            onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Pitch: {voiceSettings.pitch}x</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={voiceSettings.pitch}
                            onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Advanced Voice AI Features</h2>
                      <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        Our Voice AI Bot combines cutting-edge speech recognition, natural language processing, 
                        and text-to-speech technologies to deliver human-like conversations.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Capabilities */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                      <h3 className="text-xl font-semibold text-white mb-4">Voice AI Capabilities</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">99%</div>
                          <div className="text-sm text-gray-300">Accuracy Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">50+</div>
                          <div className="text-sm text-gray-300">Languages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">&lt;200ms</div>
                          <div className="text-sm text-gray-300">Response Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">24/7</div>
                          <div className="text-sm text-gray-300">Availability</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Voice AI Use Cases
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Discover how Voice AI can transform your business operations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Customer Support',
                      description: 'Handle customer inquiries with natural voice interactions',
                      icon: '🎧'
                    },
                    {
                      title: 'Virtual Assistants',
                      description: 'Personal AI assistants for scheduling and task management',
                      icon: '🤖'
                    },
                    {
                      title: 'Healthcare',
                      description: 'Voice-enabled patient care and medical documentation',
                      icon: '🏥'
                    },
                    {
                      title: 'Education',
                      description: 'Interactive learning with voice-based tutoring systems',
                      icon: '📚'
                    },
                    {
                      title: 'Smart Homes',
                      description: 'Voice control for IoT devices and home automation',
                      icon: '🏠'
                    },
                    {
                      title: 'Accessibility',
                      description: 'Voice interfaces for users with disabilities',
                      icon: '♿'
                    }
                  ].map((useCase, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 p-6 text-center">
                      <div className="text-4xl mb-4">{useCase.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Implement Voice AI?
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Let's build a custom Voice AI solution that transforms how your customers interact with your business
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                    Get Voice AI Quote
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300">
                    Schedule Demo
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

export default VoiceBotAI;