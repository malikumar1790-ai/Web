import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown') && !target.closest('.language-button')) {
        setIsLanguageOpen(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
  ];

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/portfolio', label: t('nav.portfolio') },
    { path: '/jobs', label: 'Careers' },
    { path: '/contact', label: t('nav.contact') }
  ];

  const secondaryItems = [
    { path: '/testimonials', label: t('nav.testimonials') },
    { path: '/project-builder', label: 'Project Builder' },
    { path: '/milestones', label: 'Milestones' },
    { path: '/voice-bot-ai', label: 'Voice AI' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-lg border-b border-gray-800 shadow-lg' 
          : 'bg-black/90 backdrop-blur-md border-b border-gray-800'
      }`} 
      role="banner"
    >
      <nav className="w-full px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16 lg:h-18 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0" aria-label="Nexariza AI - Home">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logos/nexariza-logo.png"
                alt="Nexariza AI Logo"
                className="w-10 h-10 object-contain rounded-xl group-hover:scale-105 transition-all duration-300"
                loading="eager"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Nexariza
                </span>
                <span className="text-xs text-gray-400 -mt-1 tracking-wide">
                  AI Solutions
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1 bg-gray-900/50 rounded-full px-3 py-2 border border-gray-700/50 backdrop-blur-sm">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap ${
                    location.pathname === item.path 
                      ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/25' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <button
                className="language-button flex items-center space-x-2 px-3 py-2 bg-gray-900/60 hover:bg-gray-800/70 text-gray-300 hover:text-white transition-all duration-300 rounded-full border border-gray-700/50"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                aria-expanded={isLanguageOpen}
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLang?.flag}</span>
                <span className="text-xs text-gray-400">{currentLang?.code.toUpperCase()}</span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-700/50">
                    <h3 className="text-sm font-semibold text-white flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-400" />
                      Select Language
                    </h3>
                  </div>
                  
                  <div className="p-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                          language === lang.code 
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                            : 'text-gray-300 hover:bg-gray-800/60 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <div className="font-medium text-sm">{lang.nativeName}</div>
                            <div className="text-xs opacity-75">{lang.name}</div>
                          </div>
                        </div>
                        {language === lang.code && (
                          <span className="text-blue-400 text-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              to="/project-builder"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
            >
              {t('cta.getQuote')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              className="language-button p-2 text-gray-300 hover:text-white transition-colors duration-300 rounded-full hover:bg-gray-800/50"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-label="Select language"
            >
              <div className="flex items-center space-x-1">
                <span className="text-sm">{currentLang?.flag}</span>
                <span className="text-xs font-medium">{currentLang?.code.toUpperCase()}</span>
              </div>
            </button>
            
            <button
              className="mobile-menu-button p-2.5 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Language Dropdown */}
        {isLanguageOpen && (
          <div className="lg:hidden absolute right-4 top-16 w-56 bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 language-dropdown">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-400" />
                Select Language
              </h3>
            </div>
            
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                    language === lang.code 
                      ? 'bg-blue-600/20 text-blue-300' 
                      : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium text-sm">{lang.nativeName}</span>
                  </div>
                  {language === lang.code && (
                    <span className="text-blue-400 text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mobile-menu">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-900/98 backdrop-blur-md rounded-2xl mt-3 border border-gray-800 shadow-xl">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300 ${
                      location.pathname === item.path 
                        ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/25' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-700/50 pt-4 mt-4">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Client Portal
                </p>
                <div className="space-y-1">
                  {secondaryItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                        location.pathname === item.path 
                          ? 'text-blue-400 bg-blue-500/10' 
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/40'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-700/50 pt-4 mt-4">
                <Link
                  to="/project-builder"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  {t('cta.getQuote')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;