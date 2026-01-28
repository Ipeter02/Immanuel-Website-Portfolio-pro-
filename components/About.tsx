import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Target, Zap, BookOpen } from 'lucide-react';
import { useStore } from '../lib/store';

const About: React.FC = () => {
  const { data } = useStore();
  const { about } = data;

  return (
    <section id="about" className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Know Me Better</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">About Me</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {about.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {about.bio1}
            </p>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {about.bio2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-5 bg-cream dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-default transition-colors hover:border-primary/20 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Code2 size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Development</h4>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Clean code, modern patterns, and scalable architecture.</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-5 bg-cream dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-default transition-colors hover:border-primary/20 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <BookOpen size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Learning</h4>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Constantly upskilling in System Design and Cloud Tech.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats / Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex flex-col gap-6 lg:pt-8"
          >
             <motion.div 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-[4/3] group shadow-2xl cursor-pointer"
             >
               <img 
                 src={about.imageUrl} 
                 alt="Coding Workspace" 
                 className="object-cover w-full h-full opacity-60 group-hover:opacity-40 transition-opacity duration-500"
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
                     <p className="text-5xl font-extrabold text-white mb-2">{about.stats.experienceYears}</p>
                     <p className="text-slate-200 font-medium">Years of Experience</p>
                  </div>
               </div>
             </motion.div>

             <div className="flex gap-6">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex-1 bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-primary/20 cursor-pointer"
               >
                  <Target className="mb-3 opacity-80" size={28} />
                  <p className="text-3xl font-extrabold">{about.stats.projectsCompleted}</p>
                  <p className="text-sky-100 text-sm font-medium mt-1">Projects Completed</p>
               </motion.div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
               >
                  <Zap className="mb-3 text-yellow-500" size={28} />
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{about.stats.deliverySpeed}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Delivery & Perf</p>
               </motion.div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;