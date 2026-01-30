import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Download, PenTool, Database } from 'lucide-react';
import Button from './ui/Button';
import { useStore } from '../lib/store';

const Hero: React.FC = () => {
  const { data, isLoaded } = useStore();
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [currentBg, setCurrentBg] = useState(0);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Typing Effect
  useEffect(() => {
    if (!isLoaded) return;
    const roles = data.hero.roles.length > 0 ? data.hero.roles : ["Developer"];
    
    const handleTyping = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, data.hero.roles, isLoaded]);

  // Background Slideshow
  useEffect(() => {
    if (!isLoaded || data.hero.backgroundImages.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentBg(prev => (prev + 1) % data.hero.backgroundImages.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [isLoaded, data.hero.backgroundImages.length]);

  const bgImages = data.hero.backgroundImages.length > 0 ? data.hero.backgroundImages : [""];
  const resumeLink = data.settings.resumeUrl || "/resume.pdf";
  const downloadAttr = data.settings.resumeUrl ? "Immanuel_Gondwe_Resume.pdf" : undefined;

  return (
    <section id="home" className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden py-24 lg:py-0" aria-label="Introduction">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-900">
        <AnimatePresence mode="popLayout">
            <motion.img
                key={currentBg}
                src={bgImages[currentBg]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Hero Background"
            />
        </AnimatePresence>
        <div className="absolute inset-0 bg-cream/70 dark:bg-slate-950/60 transition-colors duration-500 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream dark:to-slate-950 z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-primary text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Available for work
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
            >
              {data.hero.headline.split('Immanuel Gondwe')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary relative whitespace-nowrap">
                Immanuel Gondwe
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-secondary blur-2xl opacity-20 -z-10" aria-hidden="true"></span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-8 mb-8 text-lg sm:text-xl md:text-2xl font-mono text-slate-600 dark:text-slate-300"
            >
              I am a <span className="text-slate-900 dark:text-white border-r-2 border-primary pr-1">{text || (data.hero.roles[0] || 'Developer')}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {data.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button href="#contact" onClick={handleContactClick} size="lg" className="group relative overflow-hidden w-full sm:w-auto">
                 <span className="relative z-10 flex items-center justify-center font-bold tracking-wide">
                    Contact Me
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-l from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                href={resumeLink}
                download={downloadAttr}
                external={!data.settings.resumeUrl} 
                className="group relative overflow-hidden border-2 border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-transparent dark:hover:bg-transparent transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center font-semibold group-hover:text-primary transition-colors duration-300">
                    Download Resume
                    <Download className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end [perspective:1000px] mt-8 lg:mt-0"
          >
             <motion.div 
                className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
             >
                <div className="absolute inset-[-10px] bg-gradient-to-tr from-primary to-secondary blur-[40px] sm:blur-[50px] opacity-60 rounded-full animate-pulse-slow pointer-events-none" style={{ transform: "translateZ(-50px)" }}></div>
                <div className="w-full h-full rounded-full border-[6px] sm:border-[8px] border-white dark:border-slate-800 shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900">
                   <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-white to-purple-100 dark:from-sky-950 dark:via-slate-900 dark:to-purple-950/50"></div>
                   <img 
                      src={data.hero.profileImage} 
                      alt="Profile"
                      className="absolute inset-0 w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
                   />
                </div>
                
                {/* Floating Cards - Hidden on very small screens, visible on sm+ */}
                <motion.div 
                   className="absolute top-6 -right-4 sm:top-10 sm:right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                   style={{ transform: "translateZ(40px)" }}
                   animate={{ y: [0, -8, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                   <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-xl"><PenTool size={18} className="sm:w-5 sm:h-5" /></div>
                   <div>
                     <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Designer</p>
                     <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">UI/UX</p>
                   </div>
                </motion.div>
                
                <motion.div 
                   className="absolute bottom-8 -left-4 sm:bottom-12 sm:left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                   style={{ transform: "translateZ(60px)" }}
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                   <div className="p-1.5 sm:p-2 bg-secondary/10 text-secondary rounded-xl"><Database size={18} className="sm:w-5 sm:h-5" /></div>
                   <div>
                       <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Focus</p>
                       <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">Systems</p>
                   </div>
                </motion.div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;