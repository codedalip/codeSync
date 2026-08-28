import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  ArrowRight, 
  Sun, 
  Moon, 
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import CRTGridBackground from './CRTGridBackground';
import ThemeShowcase from './ThemeShowcase';
import StackingFeatureCards from './StackingFeatureCards';

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const LandingPage = ({ onGetStarted, onGoToDashboard, onGoToIDE, activeWorkspaceId }) => {
  const { isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDownClick = () => {
    const showcaseElem = document.getElementById('theme-showcase-section');
    if (showcaseElem) {
      showcaseElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 550, behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = () => {
    setAuthModal(null);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-zinc-800 selection:text-white transition-colors duration-200 overflow-x-hidden relative ${
      isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-zinc-100'
    }`}>
      {/* Composio-Style CRT Pixel Mesh & Edge Voxel Block Background */}
      <CRTGridBackground />

      {/* Sleek Minimalist Top Navbar */}
      <motion.header 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors ${
          isLight 
            ? 'bg-white/80 border-zinc-200 shadow-sm' 
            : 'bg-[#09090b]/80 border-zinc-800/80 shadow-md'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              isLight 
                ? 'bg-zinc-900 text-white border-zinc-900' 
                : 'bg-white text-zinc-900 border-white'
            }`}>
              <Code2 className="w-5 h-5" />
            </div>
            <span className={`text-lg font-bold tracking-tight ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}>
              CodeSync
            </span>
          </div>

          {/* Header Controls (Professional Monochrome Theme Switcher + Auth) */}
          <div className="flex items-center space-x-3">
            {/* Professional Theme Switcher Toggle Pill */}
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-300 text-zinc-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200'
              }`}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow ${
                    isLight
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      : 'bg-white hover:bg-zinc-200 text-zinc-900'
                  }`}
                >
                  <span>{activeWorkspaceId ? 'Return to Editor' : 'Go to Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>

                <button
                  onClick={logout}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all flex items-center space-x-1.5 ${
                    isLight 
                      ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800' 
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                  title="Sign Out of CodeSync"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    isLight 
                      ? 'text-zinc-700 hover:bg-zinc-200/60' 
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAuthModal('register')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                    isLight
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      : 'bg-white hover:bg-zinc-200 text-zinc-900'
                  }`}
                >
                  Get Started Free
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8 max-w-3xl mx-auto"
        >
          {/* Badge Pill */}
          <motion.div variants={fadeInUp} className="inline-block">
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-sm ${
              isLight 
                ? 'bg-zinc-100 border-zinc-300 text-zinc-700' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}>
              <Zap className="w-3.5 h-3.5 text-zinc-500" />
              <span>Real-Time Multi-User Pair Programming Platform</span>
            </div>
          </motion.div>

          {/* Main Clean Monochrome Headline */}
          <motion.h1 variants={fadeInUp} className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] ${
            isLight ? 'text-zinc-900' : 'text-white'
          }`}>
            Code Together in Real Time.{' '}
            <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
              Anywhere, Instantly.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeInUp} className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            A high-performance browser IDE built with Monaco Editor, Socket.IO room streams, collaborative cursors, integrated multi-language terminal, and instant team chat.
          </motion.p>

          {/* Single Main CTA Action */}
          <motion.div variants={fadeInUp} className="pt-2 flex flex-col items-center space-y-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => (isAuthenticated ? onGetStarted() : setAuthModal('register'))}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isLight 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
                  : 'bg-white hover:bg-zinc-200 text-zinc-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{isAuthenticated ? 'Open Dashboard' : 'Start Coding Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Bottom-Center Bouncing Scroll Down Indicator Button */}
      <AnimatePresence>
        {showScrollIndicator && (
          <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none">
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ 
                y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.3 }
              }}
              onClick={handleScrollDownClick}
              className={`pointer-events-auto px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-2xl backdrop-blur-md flex items-center space-x-2 border cursor-pointer ${
                isLight 
                  ? 'bg-white/90 text-zinc-900 border-zinc-300 hover:bg-zinc-100 shadow-zinc-300/60' 
                  : 'bg-zinc-900/90 text-white border-zinc-700 hover:bg-zinc-800 shadow-black/80'
              }`}
            >
              <span>Scroll Down</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Interactive Dual Theme Showcase Section */}
      <section id="theme-showcase-section" className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ThemeShowcase />
      </section>

      {/* 2. Stacking Cards Deck Core Capabilities Section */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <StackingFeatureCards />
      </section>

      {/* Clean Footer */}
      <footer className={`relative z-10 border-t py-8 transition-colors ${
        isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-[#09090b] border-zinc-800 text-zinc-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Code2 className={`w-4 h-4 ${isLight ? 'text-zinc-800' : 'text-white'}`} />
            <span className={`font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>CodeSync</span>
            <span>— Real-Time Collaborative IDE Platform</span>
          </div>
          <div>© {new Date().getFullYear()} CodeSync. Built with React, Monaco, Socket.IO & Node.js.</div>
        </div>
      </footer>

      {/* Auth Modal Overlay with AnimatePresence */}
      <AnimatePresence>
        {authModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              {authModal === 'login' ? (
                <LoginForm 
                  onSwitchToRegister={() => setAuthModal('register')} 
                  onSuccess={handleAuthSuccess}
                  onClose={() => setAuthModal(null)}
                />
              ) : (
                <RegisterForm 
                  onSwitchToLogin={() => setAuthModal('login')} 
                  onSuccess={handleAuthSuccess}
                  onClose={() => setAuthModal(null)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
