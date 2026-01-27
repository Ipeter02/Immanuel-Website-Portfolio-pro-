import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Server, Globe, Zap, ArrowRight, X, CheckCircle2,
  Terminal, Database, Cpu, Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
  Layout, PenTool, Palette, Layers, Image,
  TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
  Activity, Wrench, Search, Shield, Lock, FileText, Mail, Calendar, Clock, MapPin,
  Camera, Video, Music, Speaker, Monitor, Hash, Tag, Flag, Bookmark, Briefcase, Settings
} from 'lucide-react';
import { Service } from '../types';
import Button from './ui/Button';
import { useStore } from '../lib/store';

// Helper to map string names to Lucide components
const IconMap: any = {
  Code, Server, Globe, Zap,
  Terminal, Database, Cpu, Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
  Layout, PenTool, Palette, Layers, Image,
  TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
  Activity, Wrench, Search, Shield, Lock, FileText, Mail, Calendar, Clock, MapPin,
  Camera, Video, Music, Speaker, Monitor, Hash, Tag, Flag, Bookmark, Briefcase, Settings
};

const Services: React.FC = () => {
  const { data, isLoaded } = useStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleDiscussClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedService(null);
    const element = document.getElementById('contact');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (!isLoaded) return null;

  return (
    <section id="services" className="py-16 bg-cream dark:bg-slate-900 transition-colors duration-300 relative" aria-label="Services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">What I Offer</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">My Services</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.services.map((service, index) => {
            const Icon = IconMap[service.iconName] || Code;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover="hover"
                className="group bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                  <Icon size={80} />
                </div>
                
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg relative z-10 flex-shrink-0"
                  variants={{
                    hover: { 
                      scale: 1.15, 
                      rotate: 5,
                      boxShadow: "0 0 25px rgba(14, 165, 233, 0.6)" 
                    }
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon size={32} aria-hidden="true" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{service.title}</h3>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6 flex-grow relative z-10 font-medium opacity-90">
                  {service.description}
                </p>

                <button 
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center text-primary font-bold group/btn focus:outline-none relative z-10 mt-auto"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-slate-200 dark:border-slate-700 flex flex-col"
              >
                <div className="p-8 pb-0 flex justify-between items-start sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-transparent">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl text-primary">
                        {(() => {
                            const Icon = IconMap[selectedService.iconName] || Code;
                            return <Icon size={28} />;
                        })()}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {selectedService.title}
                      </h3>
                   </div>
                   <button 
                    onClick={() => setSelectedService(null)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                   >
                     <X size={24} />
                   </button>
                </div>
                
                <div className="p-8">
                  {/* Short Description Section */}
                  <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Overview</h4>
                      <p className="text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
                        {selectedService.description}
                      </p>
                  </div>

                  {/* Long Description Section */}
                  <div className="mb-8">
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Details</h4>
                      <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedService.longDescription}
                      </p>
                  </div>

                  {/* Features Section */}
                  <div className="bg-cream dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedService.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-8 pt-0 mt-auto flex justify-end gap-4 bg-white dark:bg-slate-900 sticky bottom-0 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" onClick={() => setSelectedService(null)}>
                    Close
                  </Button>
                  <Button href="#contact" onClick={handleDiscussClick}>
                    Let's Discuss
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;