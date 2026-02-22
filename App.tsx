import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/admin/Admin';
import Preloader from './components/ui/Preloader';
import ScrollToTop from './components/ui/ScrollToTop';
import { useStore } from './lib/store';

import SecurityWrapper from './components/ui/SecurityWrapper';

const PublicPortfolio = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  return (
    <SecurityWrapper>
      <div className="min-h-screen text-base antialiased bg-cream dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main>
          <Hero />
          <About />
          <Skills />
          <Services />
          <Portfolio />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </SecurityWrapper>
  );
};

function App() {
  const [isDark, setIsDark] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const { isLoaded } = useStore();

  useEffect(() => {
    // Check localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Manage Preloader Timing
  useEffect(() => {
    // If loaded, wait just a moment for smooth transition
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 1500); 
      return () => clearTimeout(timer);
    }

    // Safety: Force show site after 3s max
    const safetyTimer = setTimeout(() => {
        setShowPreloader(false);
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, [isLoaded]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showPreloader ? (
          <Preloader key="preloader" />
        ) : (
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/*" element={<PublicPortfolio isDark={isDark} toggleTheme={toggleTheme} />} />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;