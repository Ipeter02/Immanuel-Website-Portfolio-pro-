import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Security from './components/Security'; // Import Security Component
import { useStore } from './lib/store';

const PublicPortfolio = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  return (
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
    // Ensure the preloader stays for at least 2 seconds for a smooth experience
    // And also waits for the data store to be loaded
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 2000); // 2 seconds minimum display time

      return () => clearTimeout(timer);
    }
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
      <Security /> {/* Enable Security Measures */}
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