import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Nexariza AI
                </span>
                <div className="text-xs text-gray-400">AI Solutions</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Leading the future of artificial intelligence with innovative solutions that transform businesses worldwide. Founded by Ahmad Yasin in 2024.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">{t('nav.about')}</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">{t('nav.services')}</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">{t('nav.portfolio')}</Link></li>
              <li><Link to="/teams" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">{t('nav.teams')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>contact@nexariza.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>Available upon request</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Worldwide Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Nexariza AI. All rights reserved. Founded by Ahmad Yasin.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;