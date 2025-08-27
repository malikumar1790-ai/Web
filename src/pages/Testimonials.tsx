import React, { useState, useEffect } from 'react';
import { Star, Play, Quote, ChevronLeft, ChevronRight, Award, TrendingUp, Users } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'CEO, TechVision Inc.',
      company: 'Fortune 500 Technology Company',
      image: 'https://images.pexels.com/photos/3760811/pexels-photo-3760811.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      rating: 5,
      text: 'Nexariza AI transformed our customer service operations completely. Their chatbot handles 95% of inquiries with human-like precision, reducing our support costs by 60% while improving customer satisfaction scores to 98%. The ROI was evident within the first month.',
      project: 'AI Customer Service Platform',
      results: {
        metric1: { label: 'Cost Reduction', value: '60%' },
        metric2: { label: 'Customer Satisfaction', value: '98%' },
        metric3: { label: 'Response Time', value: '< 2s' }
      },
      videoThumbnail: 'https://images.pexels.com/photos/3760811/pexels-photo-3760811.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      hasVideo: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'CTO, AutoMaker Pro',
      company: 'Leading Automotive Manufacturer',
      image: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      rating: 5,
      text: 'The computer vision system Nexariza developed for our quality control process is phenomenal. We achieved 99.5% defect detection accuracy, virtually eliminating production errors. Their team delivered ahead of schedule and provided exceptional ongoing support.',
      project: 'Computer Vision Quality Control',
      results: {
        metric1: { label: 'Defect Detection', value: '99.5%' },
        metric2: { label: 'Production Errors', value: '-95%' },
        metric3: { label: 'Quality Score', value: '9.8/10' }
      },
      videoThumbnail: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      hasVideo: true
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      title: 'Chief Medical Officer, HealthFirst',
      company: 'Premier Healthcare Network',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      rating: 5,
      text: 'Nexariza\'s medical AI diagnostic assistant has revolutionized our radiology department. Early disease detection improved by 45%, and our radiologists can now process cases 3x faster while maintaining the highest accuracy standards. Patient outcomes have never been better.',
      project: 'Medical AI Diagnostic System',
      results: {
        metric1: { label: 'Early Detection', value: '+45%' },
        metric2: { label: 'Processing Speed', value: '3x faster' },
        metric3: { label: 'Accuracy Rate', value: '94%' }
      },
      videoThumbnail: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      hasVideo: false
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'VP of Operations, RetailGiant',
      company: 'Global E-commerce Leader',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      rating: 5,
      text: 'The predictive analytics platform exceeded all expectations. Our demand forecasting accuracy improved by 78%, inventory costs dropped by 40%, and we can now predict market trends with unprecedented precision. Nexariza delivered a game-changing solution.',
      project: 'Predictive Analytics Platform',
      results: {
        metric1: { label: 'Forecast Accuracy', value: '+78%' },
        metric2: { label: 'Inventory Costs', value: '-40%' },
        metric3: { label: 'Market Prediction', value: '92%' }
      },
      videoThumbnail: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      hasVideo: true
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Director of Innovation, FinanceFlow',
      company: 'Leading Financial Services',
      image: 'https://images.pexels.com/photos/3760736/pexels-photo-3760736.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      rating: 5,
      text: 'Nexariza\'s document processing AI transformed our loan approval process. Processing time reduced by 89%, accuracy increased to 97%, and customer satisfaction soared. The system handles 10,000+ documents daily flawlessly. Absolutely revolutionary technology.',
      project: 'Document Processing AI',
      results: {
        metric1: { label: 'Processing Time', value: '-89%' },
        metric2: { label: 'Accuracy Rate', value: '97%' },
        metric3: { label: 'Daily Volume', value: '10K+' }
      },
      videoThumbnail: 'https://images.pexels.com/photos/3760736/pexels-photo-3760736.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      hasVideo: false
    }
  ];

  const stats = [
    { number: '500+', label: 'Successful Projects', icon: Award },
    { number: '98%', label: 'Client Satisfaction', icon: Star },
    { number: '150+', label: 'Enterprise Clients', icon: Users },
    { number: '$50M+', label: 'Value Generated', icon: TrendingUp }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleVideoPlay = (id: number) => {
    setPlayingVideo(playingVideo === id ? null : id);
  };

  const currentClient = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen pt-16">
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
            Client Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Discover how industry leaders transformed their businesses with our AI solutions and achieved extraordinary results
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

      {/* Featured Testimonial */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Client Info & Quote */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <img
                    src={currentClient.image}
                    alt={currentClient.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentClient.name}</h3>
                    <p className="text-blue-400 font-medium">{currentClient.title}</p>
                    <p className="text-gray-400 text-sm">{currentClient.company}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-300 text-sm">5.0 Rating</span>
                </div>

                <Quote className="h-8 w-8 text-blue-400 mb-4" />
                <p className="text-lg text-gray-200 leading-relaxed mb-6">
                  {currentClient.text}
                </p>

                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-4 border border-blue-700/30 mb-6">
                  <h4 className="text-white font-semibold mb-2">Project: {currentClient.project}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(currentClient.results).map(([key, result]) => (
                      <div key={key} className="text-center">
                        <div className="text-xl font-bold text-blue-400">{result.value}</div>
                        <div className="text-xs text-gray-300">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-300"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Testimonial */}
              <div className="relative h-96 lg:h-full">
                {currentClient.hasVideo ? (
                  <div className="relative h-full">
                    <img
                      src={currentClient.videoThumbnail}
                      alt="Video testimonial"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => handleVideoPlay(currentClient.id)}
                        className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transform hover:scale-110 transition-all duration-300"
                      >
                        <Play className="h-8 w-8 text-white ml-1" />
                      </button>
                    </div>
                    {playingVideo === currentClient.id && (
                      <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p>Loading video testimonial...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-900/50 to-blue-800/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Quote className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold">Written Testimonial</p>
                      <p className="text-blue-200">Video coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from real clients across diverse industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 mr-3"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-blue-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                  {testimonial.text}
                </p>

                <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg p-3 border border-blue-700/20">
                  <p className="text-blue-300 text-xs font-medium mb-2">{testimonial.project}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(testimonial.results).map(([key, result]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-bold text-blue-400">{result.value}</div>
                        <div className="text-xs text-gray-400">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {testimonial.hasVideo && (
                  <button
                    onClick={() => handleVideoPlay(testimonial.id)}
                    className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
                  >
                    <Play className="h-4 w-4" />
                    <span className="text-sm">Watch Video</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Let's discuss how we can create measurable results for your business with our AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              Start Your Project
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;