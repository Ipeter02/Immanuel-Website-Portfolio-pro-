import React from 'react';
import { motion } from 'framer-motion';

const Preloader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-cream dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="relative">
        {/* Animated Background Blob */}
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.6, 0.3],
             rotate: [0, 180, 360]
           }}
           transition={{ 
             duration: 3, 
             repeat: Infinity, 
             ease: "linear" 
           }}
           className="absolute inset-[-20px] bg-primary/20 rounded-full blur-xl"
        />

        {/* Logo Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <span className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter">
            IG.
          </span>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest"
      >
        Immanuel Gondwe
      </motion.p>

      {/* Progress Bar Container */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </motion.div>
  );
};

export default Preloader;