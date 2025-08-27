import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Comprehensive translations for top 4 languages
const translations = {
  // NAVIGATION
  'nav.home': { en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite' },
  'nav.about': { en: 'About', es: 'Acerca de', fr: 'À propos', de: 'Über uns' },
  'nav.services': { en: 'Services', es: 'Servicios', fr: 'Services', de: 'Dienstleistungen' },
  'nav.portfolio': { en: 'Portfolio', es: 'Portafolio', fr: 'Portfolio', de: 'Portfolio' },
  'nav.teams': { en: 'Teams', es: 'Equipos', fr: 'Équipes', de: 'Teams' },
  'nav.contact': { en: 'Contact', es: 'Contacto', fr: 'Contact', de: 'Kontakt' },
  'nav.testimonials': { en: 'Testimonials', es: 'Testimonios', fr: 'Témoignages', de: 'Referenzen' },
  'nav.project': { en: 'Project Builder', es: 'Constructor de Proyectos', fr: 'Constructeur de Projet', de: 'Projekt-Builder' },
  'nav.milestones': { en: 'Milestones', es: 'Hitos', fr: 'Jalons', de: 'Meilensteine' },
  'nav.voicebot': { en: 'Voice AI', es: 'IA de Voz', fr: 'IA Vocale', de: 'Sprach-KI' },

  // HERO SECTION
  'hero.title': { 
    en: 'Transform Your Ideas into Custom AI Solutions', 
    es: 'Transforma tus Ideas en Soluciones de IA Personalizadas', 
    fr: 'Transformez vos Idées en Solutions IA Personnalisées', 
    de: 'Verwandeln Sie Ihre Ideen in Maßgeschneiderte KI-Lösungen' 
  },
  'hero.subtitle': { 
    en: 'From concept to deployment, we deliver custom AI solutions that transform your business with lifetime partnership support.', 
    es: 'Desde el concepto hasta el despliegue, entregamos soluciones de IA personalizadas que transforman tu negocio con soporte de asociación de por vida.', 
    fr: 'Du concept au déploiement, nous livrons des solutions IA personnalisées qui transforment votre entreprise avec un support de partenariat à vie.', 
    de: 'Von der Konzeption bis zur Bereitstellung liefern wir maßgeschneiderte KI-Lösungen, die Ihr Unternehmen mit lebenslanger Partnerschaftsunterstützung transformieren.' 
  },

    // HOME PAGE
  'home.features.title': { 
    en: 'Why Choose Nexariza AI?', 
    es: '¿Por qué elegir Nexariza AI?', 
    fr: 'Pourquoi choisir Nexariza AI ?', 
    de: 'Warum Nexariza AI wählen?' 
  },
  'home.features.aiDev.title': { 
    en: 'Custom AI/ML Development', 
    es: 'Desarrollo de IA/ML Personalizado', 
    fr: 'Développement IA/ML Personnalisé', 
    de: 'Maßgeschneiderte KI/ML-Entwicklung' 
  },
  'home.features.aiDev.description': { 
    en: 'Build AI models from scratch with Neural Networks, LLMs, NLP, and Agentic AI systems', 
    es: 'Construye modelos de IA desde cero con Redes Neuronales, LLMs, NLP y sistemas de IA Agéntica', 
    fr: 'Construisez des modèles IA à partir de zéro avec des Réseaux de Neurones, LLMs, NLP et systèmes IA Agentiques', 
    de: 'Erstellen Sie KI-Modelle von Grund auf mit Neuronalen Netzwerken, LLMs, NLP und Agentischen KI-Systemen' 
  },
  'home.features.integration.title': { 
    en: 'Full-Stack Integration', 
    es: 'Integración Full-Stack', 
    fr: 'Intégration Full-Stack', 
    de: 'Full-Stack-Integration' 
  },
  'home.features.integration.description': { 
    en: 'Seamless AI integration into websites and apps using Next.js, React, Django, FastAPI', 
    es: 'Integración perfecta de IA en sitios web y aplicaciones usando Next.js, React, Django, FastAPI', 
    fr: 'Intégration transparente de l\'IA dans les sites web et applications avec Next.js, React, Django, FastAPI', 
    de: 'Nahtlose KI-Integration in Websites und Apps mit Next.js, React, Django, FastAPI' 
  },
  'home.features.devops.title': { 
    en: 'Enterprise DevOps', 
    es: 'DevOps Empresarial', 
    fr: 'DevOps Entreprise', 
    de: 'Enterprise DevOps' 
  },
  'home.features.devops.description': { 
    en: 'Scalable cloud deployment on AWS & Google Cloud with Kubernetes and Docker', 
    es: 'Implementación escalable en la nube en AWS y Google Cloud con Kubernetes y Docker', 
    fr: 'Déploiement cloud évolutif sur AWS et Google Cloud avec Kubernetes et Docker', 
    de: 'Skalierbare Cloud-Bereitstellung auf AWS und Google Cloud mit Kubernetes und Docker' 
  },
  'home.features.support.title': { 
    en: 'Lifetime Support', 
    es: 'Soporte de por Vida', 
    fr: 'Support à Vie', 
    de: 'Lebenslange Unterstützung' 
  },
  'home.features.support.description': { 
    en: 'Premium partnership with ongoing maintenance, updates, and system monitoring', 
    es: 'Asociación premium con mantenimiento continuo, actualizaciones y monitoreo del sistema', 
    fr: 'Partenariat premium avec maintenance continue, mises à jour et surveillance système', 
    de: 'Premium-Partnerschaft mit laufender Wartung, Updates und Systemüberwachung' 
  },

  // STATS
  'home.stats.title': { 
    en: 'Trusted by Global Innovators', 
    es: 'Confiado por Innovadores Globales', 
    fr: 'Approuvé par les Innovateurs Mondiaux', 
    de: 'Vertraut von Globalen Innovatoren' 
  },
  'home.stats.custom': { en: 'Custom', es: 'Personalizado', fr: 'Personnalisé', de: 'Maßgeschneidert' },
  'home.stats.models': { 
    en: 'AI Models Built', 
    es: 'Modelos de IA Construidos', 
    fr: 'Modèles IA Construits', 
    de: 'KI-Modelle Erstellt' 
  },
  'home.stats.premium': { en: 'Premium', es: 'Premium', fr: 'Premium', de: 'Premium' },
  'home.stats.partnership': { 
    en: 'Partnership Focus', 
    es: 'Enfoque de Asociación', 
    fr: 'Focus Partenariat', 
    de: 'Partnerschaftsfokus' 
  },
  'home.stats.support': { en: '24/7', es: '24/7', fr: '24/7', de: '24/7' },
  'home.stats.available': { 
    en: 'Support Available', 
    es: 'Soporte Disponible', 
    fr: 'Support Disponible', 
    de: 'Support Verfügbar' 
  },
  'home.stats.founded': { 
    en: 'Founded by Ahmad Yasin', 
    es: 'Fundado por Ahmad Yasin', 
    fr: 'Fondé par Ahmad Yasin', 
    de: 'Gegründet von Ahmad Yasin' 
  },


  // ABOUT PAGE
  'about.title': { 
    en: 'About Nexariza AI', 
    es: 'Acerca de Nexariza AI', 
    fr: 'À propos de Nexariza AI', 
    de: 'Über Nexariza AI' 
  },
  'about.subtitle': { 
    en: 'Leading the future of artificial intelligence with innovative solutions that transform businesses worldwide', 
    es: 'Liderando el futuro de la inteligencia artificial con soluciones innovadoras que transforman empresas en todo el mundo', 
    fr: 'Mener l\'avenir de l\'intelligence artificielle avec des solutions innovantes qui transforment les entreprises dans le monde entier', 
    de: 'Die Zukunft der künstlichen Intelligenz mit innovativen Lösungen anführen, die Unternehmen weltweit transformieren' 
  },
  'about.description': { 
    en: 'Founded by Ahmad Yasin, Nexariza AI specializes in creating custom AI solutions that transform businesses worldwide. We combine cutting-edge technology with practical business applications to deliver real value.', 
    es: 'Fundada por Ahmad Yasin, Nexariza AI se especializa en crear soluciones de IA personalizadas que transforman empresas en todo el mundo. Combinamos tecnología de vanguardia con aplicaciones comerciales prácticas para entregar valor real.', 
    fr: 'Fondée par Ahmad Yasin, Nexariza AI se spécialise dans la création de solutions IA personnalisées qui transforment les entreprises dans le monde entier. Nous combinons une technologie de pointe avec des applications commerciales pratiques pour offrir une valeur réelle.', 
    de: 'Gegründet von Ahmad Yasin, spezialisiert sich Nexariza AI auf die Erstellung maßgeschneiderter KI-Lösungen, die Unternehmen weltweit transformieren. Wir kombinieren Spitzentechnologie mit praktischen Geschäftsanwendungen, um echten Wert zu liefern.' 
  },

  // SERVICES PAGE
  'services.hero.title': { 
    en: 'AI Services', 
    es: 'Servicios de IA', 
    fr: 'Services IA', 
    de: 'KI-Dienstleistungen' 
  },
  'services.hero.subtitle': { 
    en: 'Comprehensive artificial intelligence solutions designed to transform your business operations and drive growth', 
    es: 'Soluciones integrales de inteligencia artificial diseñadas para transformar las operaciones de tu negocio e impulsar el crecimiento', 
    fr: 'Solutions d\'intelligence artificielle complètes conçues pour transformer vos opérations commerciales et stimuler la croissance', 
    de: 'Umfassende Lösungen für künstliche Intelligenz zur Transformation Ihrer Geschäftsabläufe und Wachstumsförderung' 
  },

  // PORTFOLIO PAGE
  'portfolio.hero.title': { 
    en: 'Our Portfolio', 
    es: 'Nuestro Portafolio', 
    fr: 'Notre Portfolio', 
    de: 'Unser Portfolio' 
  },
  'portfolio.hero.subtitle': { 
    en: 'Showcasing successful AI projects that have transformed businesses across industries worldwide', 
    es: 'Mostrando proyectos de IA exitosos que han transformado empresas en todas las industrias a nivel mundial', 
    fr: 'Présentation de projets IA réussis qui ont transformé les entreprises dans tous les secteurs à travers le monde', 
    de: 'Präsentation erfolgreicher KI-Projekte, die Unternehmen branchenübergreifend weltweit transformiert haben' 
  },

  // TEAMS PAGE
  'teams.hero.title': { 
    en: 'Meet Our Expert Team', 
    es: 'Conoce a Nuestro Equipo Experto', 
    fr: 'Rencontrez Notre Équipe d\'Experts', 
    de: 'Lernen Sie Unser Expertenteam Kennen' 
  },
  'teams.hero.subtitle': { 
    en: 'World-class AI experts, researchers, and engineers united by a passion for innovation and excellence', 
    es: 'Expertos en IA, investigadores e ingenieros de clase mundial unidos por una pasión por la innovación y la excelencia', 
    fr: 'Experts IA de classe mondiale, chercheurs et ingénieurs unis par une passion pour l\'innovation et l\'excellence', 
    de: 'Weltklasse-KI-Experten, Forscher und Ingenieure, vereint durch eine Leidenschaft für Innovation und Exzellenz' 
  },

  // CONTACT PAGE
  'contact.hero.title': { 
    en: 'Get In Touch', 
    es: 'Ponte en Contacto', 
    fr: 'Contactez-nous', 
    de: 'Kontaktieren Sie uns' 
  },
  'contact.hero.subtitle': { 
    en: 'Ready to transform your business with AI? Let\'s discuss your project and create something extraordinary together.', 
    es: '¿Listo para transformar tu negocio con IA? Hablemos de tu proyecto y creemos algo extraordinario juntos.', 
    fr: 'Prêt à transformer votre entreprise avec l\'IA ? Discutons de votre projet et créons quelque chose d\'extraordinaire ensemble.', 
    de: 'Bereit, Ihr Unternehmen mit KI zu transformieren? Lassen Sie uns Ihr Projekt besprechen und gemeinsam etwas Außergewöhnliches schaffen.' 
  },

  // TESTIMONIALS PAGE
  'testimonials.hero.title': { 
    en: 'Client Success Stories', 
    es: 'Historias de Éxito de Clientes', 
    fr: 'Histoires de Réussite Clients', 
    de: 'Kunden-Erfolgsgeschichten' 
  },
  'testimonials.hero.subtitle': { 
    en: 'Discover how industry leaders transformed their businesses with our AI solutions and achieved extraordinary results', 
    es: 'Descubre cómo los líderes de la industria transformaron sus negocios con nuestras soluciones de IA y lograron resultados extraordinarios', 
    fr: 'Découvrez comment les leaders de l\'industrie ont transformé leurs entreprises avec nos solutions IA et obtenu des résultats extraordinaires', 
    de: 'Entdecken Sie, wie Branchenführer ihre Unternehmen mit unseren KI-Lösungen transformiert und außergewöhnliche Ergebnisse erzielt haben' 
  },

  // CTA BUTTONS
  'cta.getStarted': { 
    en: 'Get Started', 
    es: 'Comenzar', 
    fr: 'Commencer', 
    de: 'Loslegen' 
  },
  'cta.getQuote': { 
    en: 'Get Quote', 
    es: 'Obtener Cotización', 
    fr: 'Obtenir un Devis', 
    de: 'Angebot Erhalten' 
  },
  'cta.learnMore': { 
    en: 'Learn More', 
    es: 'Saber Más', 
    fr: 'En Savoir Plus', 
    de: 'Mehr Erfahren' 
  },
  'cta.startJourney': { 
    en: 'Start Your AI Journey', 
    es: 'Comienza tu Viaje de IA', 
    fr: 'Commencez Votre Voyage IA', 
    de: 'Beginnen Sie Ihre KI-Reise' 
  },

  // CONTACT FORM
  'contact.form.name': { en: 'Full Name', es: 'Nombre Completo', fr: 'Nom Complet', de: 'Vollständiger Name' },
  'contact.form.email': { en: 'Email Address', es: 'Dirección de Email', fr: 'Adresse Email', de: 'E-Mail-Adresse' },
  'contact.form.company': { en: 'Company', es: 'Empresa', fr: 'Entreprise', de: 'Unternehmen' },
  'contact.form.service': { en: 'Service Interest', es: 'Interés en Servicio', fr: 'Intérêt pour le Service', de: 'Service-Interesse' },
  'contact.form.message': { en: 'Message', es: 'Mensaje', fr: 'Message', de: 'Nachricht' },
  'contact.form.send': { en: 'Send Message', es: 'Enviar Mensaje', fr: 'Envoyer le Message', de: 'Nachricht Senden' },
  'contact.form.success': { 
    en: 'Message sent successfully! We\'ll get back to you within 24 hours. Please check your email for confirmation.', 
    es: '¡Mensaje enviado exitosamente! Te responderemos dentro de 24 horas. Por favor revisa tu correo para confirmación.', 
    fr: 'Message envoyé avec succès ! Nous vous répondrons dans les 24 heures. Veuillez vérifier votre e-mail pour confirmation.', 
    de: 'Nachricht erfolgreich gesendet! Wir melden uns innerhalb von 24 Stunden bei Ihnen. Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.' 
  },

  // FEATURES
  'features.aiDev.title': { 
    en: 'Custom AI Development', 
    es: 'Desarrollo de IA Personalizado', 
    fr: 'Développement IA Personnalisé', 
    de: 'Maßgeschneiderte KI-Entwicklung' 
  },
  'features.aiDev.description': { 
    en: 'Build AI models from scratch with Neural Networks, LLMs, NLP, and advanced machine learning systems', 
    es: 'Construye modelos de IA desde cero con Redes Neuronales, LLMs, NLP y sistemas avanzados de aprendizaje automático', 
    fr: 'Construisez des modèles IA à partir de zéro avec des Réseaux de Neurones, LLMs, NLP et systèmes d\'apprentissage automatique avancés', 
    de: 'Erstellen Sie KI-Modelle von Grund auf mit Neuronalen Netzwerken, LLMs, NLP und fortgeschrittenen maschinellen Lernsystemen' 
  },
  'features.integration.title': { 
    en: 'Full-Stack Integration', 
    es: 'Integración Full-Stack', 
    fr: 'Intégration Full-Stack', 
    de: 'Full-Stack-Integration' 
  },
  'features.integration.description': { 
    en: 'Seamless AI integration into websites and applications using modern frameworks and technologies', 
    es: 'Integración perfecta de IA en sitios web y aplicaciones usando marcos y tecnologías modernas', 
    fr: 'Intégration transparente de l\'IA dans les sites web et applications avec des frameworks et technologies modernes', 
    de: 'Nahtlose KI-Integration in Websites und Anwendungen mit modernen Frameworks und Technologien' 
  },
  'features.support.title': { 
    en: 'Lifetime Partnership', 
    es: 'Asociación de por Vida', 
    fr: 'Partenariat à Vie', 
    de: 'Lebenslange Partnerschaft' 
  },
  'features.support.description': { 
    en: 'Premium partnership with ongoing maintenance, updates, monitoring, and dedicated support', 
    es: 'Asociación premium con mantenimiento continuo, actualizaciones, monitoreo y soporte dedicado', 
    fr: 'Partenariat premium avec maintenance continue, mises à jour, surveillance et support dédié', 
    de: 'Premium-Partnerschaft mit laufender Wartung, Updates, Überwachung und dediziertem Support' 
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  useEffect(() => {
    const savedLanguage = localStorage.getItem('nexariza-language') as Language;
    if (savedLanguage && ['en', 'es', 'fr', 'de'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    // Set document language
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('nexariza-language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return the key itself as fallback
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleLanguageChange, 
        t 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;