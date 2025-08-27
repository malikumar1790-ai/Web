import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Nexariza AI - Custom AI Solutions | Top AI Development Company 2025",
  description = "Transform your ideas into custom AI solutions with Nexariza AI. Leading AI development company specializing in Neural Networks, LLMs, Full-Stack AI Integration, and Enterprise AI Consulting.",
  keywords = "AI development, custom AI solutions, machine learning, neural networks, LLM integration, artificial intelligence consulting, AI service provider, full-stack AI, enterprise AI, business automation",
  image = "https://www.nexariza.com/og-image.jpg",
  url,
  type = "website",
  structuredData
}) => {
  const location = useLocation();
  const currentUrl = url || `https://www.nexariza.com${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', type, 'property');

    // Update Twitter tags
    updateMetaTag('twitter:title', title, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:image', image, 'property');
    updateMetaTag('twitter:url', currentUrl, 'property');

    // Update canonical URL
    updateCanonicalLink(currentUrl);

    // Add structured data if provided
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [title, description, keywords, image, currentUrl, type, structuredData]);

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  const updateCanonicalLink = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  };

  const updateStructuredData = (data: object) => {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(data);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  };

  return null;
};

export default SEO;

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "Nexariza AI - Custom AI Solutions | Top AI Development Company 2025",
    description: "Transform your ideas into custom AI solutions with Nexariza AI. Leading AI development company specializing in Neural Networks, LLMs, Full-Stack AI Integration, and Enterprise AI Consulting. Founded by Ahmad Yasin.",
    keywords: "AI development, custom AI solutions, machine learning, neural networks, LLM integration, artificial intelligence consulting, AI service provider, full-stack AI, enterprise AI, business automation, AI transformation, technical consulting, Ahmad Yasin",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nexariza AI",
      "url": "https://www.nexariza.com",
      "logo": "https://www.nexariza.com/logo.png",
      "description": "Leading AI development company specializing in custom AI solutions",
      "founder": {
        "@type": "Person",
        "name": "Ahmad Yasin"
      }
    }
  },
  
  about: {
    title: "About Nexariza AI - Founded by Ahmad Yasin | AI Innovation Leader",
    description: "Learn about Nexariza AI, founded by Ahmad Yasin in 2024. Our mission is to transform innovative ideas into custom AI solutions. Expert team specializing in Neural Networks, LLMs, and enterprise AI consulting.",
    keywords: "Ahmad Yasin, Nexariza AI founder, AI company history, AI innovation, custom AI development team, AI consulting experts, machine learning specialists",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Nexariza AI",
        "founder": {
          "@type": "Person",
          "name": "Ahmad Yasin",
          "jobTitle": "Founder & CEO"
        }
      }
    }
  },
  
  services: {
    title: "AI Development Services | Custom AI Solutions | Nexariza AI",
    description: "Comprehensive AI development services: Custom AI/ML Development, Neural Networks, LLM Integration, Full-Stack AI, Enterprise Consulting, and Business Automation. Expert AI solutions for every industry.",
    keywords: "AI development services, custom AI solutions, machine learning services, neural network development, LLM integration, AI consulting, enterprise AI, business automation, AI transformation services",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI Development Services",
      "provider": {
        "@type": "Organization",
        "name": "Nexariza AI"
      }
    }
  },
  
  contact: {
    title: "Contact Nexariza AI - Get Free AI Consultation | Custom AI Solutions",
    description: "Contact Nexariza AI for custom AI solutions. Get free consultation from Ahmad Yasin and our expert team. Transform your business with AI. Multiple languages supported worldwide.",
    keywords: "contact Nexariza AI, AI consultation, custom AI quote, AI development inquiry, Ahmad Yasin contact, AI project consultation, enterprise AI contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Nexariza AI",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "contact@nexariza.com",
          "contactType": "customer service"
        }
      }
    }
  },
  
  portfolio: {
    title: "AI Portfolio | Successful AI Projects | Nexariza AI Case Studies",
    description: "Explore Nexariza AI's portfolio of successful AI projects. Real-world AI implementations, custom solutions, and business transformations. See how we've helped companies leverage AI.",
    keywords: "AI portfolio, AI projects, AI case studies, successful AI implementations, custom AI solutions examples, AI business transformation, AI project showcase"
  },

  teams: {
    title: "Meet Our Expert AI Team | Nexariza AI Leadership & Specialists",
    description: "Meet the world-class AI experts, researchers, and engineers at Nexariza AI. Led by founder Ahmad Yasin, our team combines deep technical expertise with business acumen.",
    keywords: "Nexariza AI team, Ahmad Yasin, AI experts, machine learning engineers, AI researchers, technical leadership, AI development team"
  },

  testimonials: {
    title: "Client Success Stories | Nexariza AI Testimonials & Reviews",
    description: "Read success stories from clients who transformed their businesses with Nexariza AI solutions. Real testimonials, measurable results, and proven ROI from our AI implementations.",
    keywords: "Nexariza AI testimonials, client success stories, AI project results, customer reviews, AI transformation case studies"
  }
};