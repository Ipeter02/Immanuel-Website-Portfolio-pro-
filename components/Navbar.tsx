import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Home, User, Cpu, Briefcase, FolderOpen, Mail } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Use Intersection Observer to determine which section is active
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scrollToTarget = (targetId: string) => {
    const element = document.getElementById(targetId);
    
    if (element) {
      // Optimistic update
      setActiveSection(targetId);

      // Calculate position with offset for fixed header
      const headerOffset = 80; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else if (targetId === 'home') {
      // Fallback for home if section missing
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    
    if (isOpen) {
      setIsOpen(false);
      // Wait slightly for state update and body overflow unlock to ensure smooth scrolling
      setTimeout(() => {
        scrollToTarget(targetId);
      }, 100);
    } else {
      scrollToTarget(targetId);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: Cpu },
    { name: 'Services', href: '#services', icon: Briefcase },
    { name: 'Portfolio', href: '#portfolio', icon: FolderOpen },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? 'bg-cream/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/5 dark:shadow-slate-900/5' 
            : 'bg-transparent'
        }`}
        aria-label="Main Navigation"
      >
        {/* Scroll Progress Bar */}
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary origin-left z-50" 
            style={{ scaleX }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a 
                href="#home" 
                onClick={(e) => handleNavClick(e, '#home')}
                className="group flex items-center gap-3 focus:outline-none"
                aria-label="Immanuel Gondwe Home"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 border border-primary/10 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-primary/10">
                   <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:scale-110 transition-transform duration-300">IG</span>
                </div>
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                <ul className="flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.href.substring(1);
                    const isContact = link.name === 'Contact';
                    
                    if (isContact) {
                       return (
                         <li key={link.name} className="ml-2">
                            <a
                              href={link.href}
                              onClick={(e) => handleNavClick(e, link.href)}
                              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer ${
                                isActive 
                                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md'
                              }`}
                            >
                              {link.name}
                            </a>
                         </li>
                       );
                    }

                    return (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative group inline-block cursor-pointer
                            ${isActive 
                              ? 'text-primary dark:text-white' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                            }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {link.name}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 -z-10"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4" aria-hidden="true"></div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleTheme} 
                    className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer active:scale-95"
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex md:hidden items-center space-x-4">
              <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none cursor-pointer active:scale-95"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
                </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-full focus:outline-none transition-all duration-300 cursor-pointer active:scale-95 border
                  ${isOpen 
                    ? 'text-sky-500 bg-purple-500/10 border-purple-500/30 dark:bg-purple-500/20 dark:border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 border-transparent'
                  }`}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-x-0 top-20 z-40 md:hidden bg-cream/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group flex items-center justify-between px-5 py-4 rounded-xl text-lg font-medium transition-all duration-200 cursor-pointer
                        ${activeSection === link.href.substring(1)
                          ? 'bg-primary/10 text-primary dark:text-white border border-primary/20 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent'
                        }`}
                      aria-current={activeSection === link.href.substring(1) ? 'page' : undefined}
                    >
                      <span className="flex items-center gap-4">
                          <link.icon size={22} className={activeSection === link.href.substring(1) ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                          {link.name}
                      </span>
                      {activeSection === link.href.substring(1) && (
                          <motion.div layoutId="mobileActiveIndicator" className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
                      )}
                    </motion.a>
                  ))}
                  
                  {/* Extra padding at bottom for safety */}
                  <div className="h-6"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
        {/* Overlay to darken background content when menu is open */}
        <AnimatePresence>
          {isOpen && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-[2px]"
               aria-hidden="true"
             />
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;