import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ProfessionalChatbot: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Professional responses in multiple languages
  const responses = React.useMemo(() => ({
    en: {
      greeting: "Hello! I'm Nexariza AI Assistant. How can I help you with our AI solutions today?",
      services: "We offer Custom AI/ML Development, Neural Networks, Computer Vision, NLP, Full-Stack Integration, and Enterprise AI Consulting. Which service interests you most?",
      pricing: "Our pricing is customized based on your specific needs. AI Chatbots start at $499/month, Computer Vision at $899/month. Would you like to schedule a consultation?",
      contact: "You can reach us at contact@nexariza.com or through our contact form. I can also help you get started right now. What would you prefer?",
      about: "Nexariza AI, founded by Ahmad Yasin in 2024, specializes in creating custom AI solutions that transform businesses. We focus on delivering real business value with lifetime partnership support.",
      timeline: "Development timelines typically range from 2-8 weeks depending on complexity. Simple chatbots can be deployed in 2 weeks, while custom AI solutions may take 6-8 weeks.",
      support: "We offer 24/7 technical support for all enterprise clients, with guaranteed response times under 2 hours. Our support includes system monitoring and regular updates.",
      default: "I'd be happy to help you with that! For detailed information, please contact our team at contact@nexariza.com or explore our services. Is there anything specific about our AI solutions you'd like to know?"
    },
    es: {
      greeting: "¡Hola! Soy el Asistente IA de Nexariza. ¿Cómo puedo ayudarte con nuestras soluciones de IA hoy?",
      services: "Ofrecemos Desarrollo IA/ML Personalizado, Redes Neuronales, Visión por Computadora, NLP, Integración Full-Stack y Consultoría IA Empresarial. ¿Qué servicio te interesa más?",
      pricing: "Nuestros precios están personalizados según tus necesidades. Los Chatbots IA comienzan en $499/mes, Visión por Computadora en $899/mes. ¿Te gustaría programar una consulta?",
      contact: "Puedes contactarnos en contact@nexariza.com o a través de nuestro formulario. También puedo ayudarte a comenzar ahora. ¿Qué prefieres?",
      about: "Nexariza AI, fundada por Ahmad Yasin en 2024, se especializa en crear soluciones IA personalizadas que transforman empresas. Nos enfocamos en entregar valor comercial real con soporte de asociación de por vida.",
      timeline: "Los plazos de desarrollo típicamente van de 2-8 semanas dependiendo de la complejidad. Los chatbots simples pueden desplegarse en 2 semanas, mientras que las soluciones IA personalizadas pueden tomar 6-8 semanas.",
      support: "Ofrecemos soporte técnico 24/7 para todos los clientes empresariales, con tiempos de respuesta garantizados bajo 2 horas. Nuestro soporte incluye monitoreo del sistema y actualizaciones regulares.",
      default: "¡Estaría encantado de ayudarte! Para información detallada, contacta a nuestro equipo en contact@nexariza.com o explora nuestros servicios. ¿Hay algo específico sobre nuestras soluciones IA que te gustaría saber?"
    },
    fr: {
      greeting: "Bonjour ! Je suis l'Assistant IA de Nexariza. Comment puis-je vous aider avec nos solutions IA aujourd'hui ?",
      services: "Nous proposons le Développement IA/ML Personnalisé, Réseaux de Neurones, Vision par Ordinateur, NLP, Intégration Full-Stack et Conseil IA d'Entreprise. Quel service vous intéresse le plus ?",
      pricing: "Nos prix sont personnalisés selon vos besoins. Les Chatbots IA commencent à 499$/mois, Vision par Ordinateur à 899$/mois. Souhaitez-vous planifier une consultation ?",
      contact: "Vous pouvez nous contacter à contact@nexariza.com ou via notre formulaire. Je peux aussi vous aider à commencer maintenant. Que préférez-vous ?",
      about: "Nexariza AI, fondée par Ahmad Yasin en 2024, se spécialise dans la création de solutions IA personnalisées qui transforment les entreprises. Nous nous concentrons sur la livraison de valeur commerciale réelle avec un support de partenariat à vie.",
      timeline: "Les délais de développement vont typiquement de 2-8 semaines selon la complexité. Les chatbots simples peuvent être déployés en 2 semaines, tandis que les solutions IA personnalisées peuvent prendre 6-8 semaines.",
      support: "Nous offrons un support technique 24/7 pour tous les clients d'entreprise, avec des temps de réponse garantis sous 2 heures. Notre support inclut la surveillance système et les mises à jour régulières.",
      default: "Je serais ravi de vous aider ! Pour des informations détaillées, contactez notre équipe à contact@nexariza.com ou explorez nos services. Y a-t-il quelque chose de spécifique sur nos solutions IA que vous aimeriez savoir ?"
    },
    de: {
      greeting: "Hallo! Ich bin der Nexariza KI-Assistent. Wie kann ich Ihnen heute mit unseren KI-Lösungen helfen?",
      services: "Wir bieten Maßgeschneiderte KI/ML-Entwicklung, Neuronale Netzwerke, Computer Vision, NLP, Full-Stack-Integration und Enterprise KI-Beratung. Welcher Service interessiert Sie am meisten?",
      pricing: "Unsere Preise sind auf Ihre spezifischen Bedürfnisse zugeschnitten. KI-Chatbots beginnen bei 499$/Monat, Computer Vision bei 899$/Monat. Möchten Sie eine Beratung vereinbaren?",
      contact: "Sie können uns unter contact@nexariza.com oder über unser Kontaktformular erreichen. Ich kann Ihnen auch helfen, gleich zu beginnen. Was bevorzugen Sie?",
      about: "Nexariza AI, 2024 von Ahmad Yasin gegründet, spezialisiert sich auf die Erstellung maßgeschneiderter KI-Lösungen, die Unternehmen transformieren. Wir konzentrieren uns darauf, echten Geschäftswert mit lebenslanger Partnerschaftsunterstützung zu liefern.",
      timeline: "Entwicklungszeiten reichen typischerweise von 2-8 Wochen je nach Komplexität. Einfache Chatbots können in 2 Wochen bereitgestellt werden, während maßgeschneiderte KI-Lösungen 6-8 Wochen dauern können.",
      support: "Wir bieten 24/7 technischen Support für alle Unternehmenskunden, mit garantierten Antwortzeiten unter 2 Stunden. Unser Support umfasst Systemüberwachung und regelmäßige Updates.",
      default: "Ich helfe Ihnen gerne dabei! Für detaillierte Informationen kontaktieren Sie bitte unser Team unter contact@nexariza.com oder erkunden Sie unsere Services. Gibt es etwas Spezifisches über unsere KI-Lösungen, das Sie wissen möchten?"
    }
  }), []);

  const getResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    const currentResponses = responses[language as keyof typeof responses] || responses.en;

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || 
        lowerInput.includes('hola') || lowerInput.includes('bonjour') || lowerInput.includes('hallo')) {
      return currentResponses.greeting;
    }
    
    if (lowerInput.includes('service') || lowerInput.includes('what do you') || lowerInput.includes('offer') ||
        lowerInput.includes('servicio') || lowerInput.includes('service') || lowerInput.includes('dienstleistung')) {
      return currentResponses.services;
    }
    
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('pricing') ||
        lowerInput.includes('precio') || lowerInput.includes('prix') || lowerInput.includes('preis')) {
      return currentResponses.pricing;
    }
    
    if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('talk') ||
        lowerInput.includes('contacto') || lowerInput.includes('contacter') || lowerInput.includes('kontakt')) {
      return currentResponses.contact;
    }
    
    if (lowerInput.includes('about') || lowerInput.includes('who are') || lowerInput.includes('company') ||
        lowerInput.includes('acerca') || lowerInput.includes('à propos') || lowerInput.includes('über')) {
      return currentResponses.about;
    }

    if (lowerInput.includes('timeline') || lowerInput.includes('time') || lowerInput.includes('how long') ||
        lowerInput.includes('tiempo') || lowerInput.includes('délai') || lowerInput.includes('zeit')) {
      return currentResponses.timeline;
    }

    if (lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('assistance') ||
        lowerInput.includes('soporte') || lowerInput.includes('aide') || lowerInput.includes('unterstützung')) {
      return currentResponses.support;
    }
    
    return currentResponses.default;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = responses[language as keyof typeof responses]?.greeting || responses.en.greeting;
      setMessages([{
        id: '1',
        type: 'bot',
        content: greeting,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Text-to-speech for bot responses
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.content);
        utterance.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'de-DE';
        speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'de-DE';
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  const toggleTextToSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 relative group"
          aria-label="Open AI Chat Assistant"
        >
          {/* Pulse animation for attention */}
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20 group-hover:opacity-0"></div>
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-bounce"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 }}
          >
            AI
          </motion.div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0, y: 0 }}
            whileHover={{ opacity: 1, y: -5 }}
          >
            Chat with AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
        </motion.div>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-16 right-2 sm:bottom-24 sm:right-6 w-[calc(100vw-1rem)] sm:w-96 max-w-[calc(100vw-1rem)] h-[70vh] sm:h-[600px] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Nexariza AI Assistant</h3>
                  <p className="text-blue-100 text-xs hidden sm:block">Always here to help • Voice enabled</p>
                  <div className="flex items-center space-x-1 sm:hidden">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-100 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      )}
                    </div>
                    <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 border border-gray-600/50'
                    }`}>
                      <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center animate-pulse">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border border-gray-600/50">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 animate-spin" />
                        <span className="text-xs sm:text-sm text-gray-300">AI is thinking...</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-700/50 p-3 sm:p-4 flex-shrink-0 bg-gray-900/50">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <button
                  onClick={toggleVoiceRecognition}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/25'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-lg'
                  }`}
                  title="Voice Recognition"
                >
                  {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
                </button>
                <button
                  onClick={toggleTextToSpeech}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isSpeaking
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-lg'
                  }`}
                  title="Text to Speech"
                >
                  {isSpeaking ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />}
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about AI solutions..."
                  className="flex-1 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-full px-3 py-2 sm:px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-blue-500/25"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
              {isListening && (
                <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-500/10 rounded-lg p-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs sm:text-sm ml-2 font-medium">🎤 Listening for your voice...</span>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                {['Services', 'Pricing', 'Contact', 'About'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInputValue(action)}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white text-xs rounded-full transition-all duration-200 border border-gray-600/30 hover:border-gray-500"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfessionalChatbot;