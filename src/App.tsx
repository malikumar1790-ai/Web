import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import AccessibilityEnhancer from './components/AccessibilityEnhancer';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfessionalChatbot from './components/ProfessionalChatbot';
import PerformanceMonitor from './components/PerformanceMonitor';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Teams from './pages/Teams';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import ProjectBuilder from './pages/ProjectBuilder';
import Milestones from './pages/Milestones';
import VoiceBotAI from './pages/VoiceBotAI';
import Jobs from './pages/Jobs';
import JobApplication from './pages/JobApplication';
import AdminDashboard from './components/AdminDashboard';
import FormDebugger from './components/FormDebugger';

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityEnhancer>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-black text-white">
              <Header />
              <main id="main-content" role="main">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/project-builder" element={<ProjectBuilder />} />
                    <Route path="/milestones" element={<Milestones />} />
                    <Route path="/voice-bot-ai" element={<VoiceBotAI />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:jobId/apply" element={<JobApplication />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
              <ProfessionalChatbot />
              <FormDebugger />
              <PerformanceMonitor />
            </div>
          </Router>
        </LanguageProvider>
      </AccessibilityEnhancer>
    </ErrorBoundary>
  );
}

export default App;