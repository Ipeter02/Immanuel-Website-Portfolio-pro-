import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, CheckCircle2, Eye, ChevronLeft, ChevronRight, Star, Layers } from 'lucide-react';
import { Project } from '../types';
import Button from './ui/Button';
import { useStore } from '../lib/store';

const ProjectCard: React.FC<{ project: Project; index: number; onOpen: (project: Project) => void }> = ({ project, index, onOpen }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const xTranslate = useTransform(xSpring, [-0.5, 0.5], ["-8%", "8%"]);
  const yTranslate = useTransform(ySpring, [-0.5, 0.5], ["-8%", "8%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-cream dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-colors duration-300 flex flex-col h-full"
    >
      <div 
        className="relative h-64 overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => onOpen(project)}
      >
        <motion.img 
          src={project.images && project.images.length > 0 ? project.images[0] : ""} 
          alt={project.title} 
          className="w-full h-full object-cover object-top" // Changed to object-top to show header of websites
          initial={{ scale: 1.15 }}
          style={{ x: xTranslate, y: yTranslate }}
          whileHover={{ scale: 1.25 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
            <span className="flex items-center gap-2 text-white font-semibold tracking-wide px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-all duration-300">
                <Eye size={18} /> View Details
            </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">{project.role}</span>
          <div className="flex gap-2">
            {project.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="text-[10px] px-2 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors flex items-center gap-2 cursor-pointer" onClick={() => onOpen(project)}>
          {project.title}
          <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto space-y-5">
           <div className="flex gap-3">
              <Button 
                onClick={() => onOpen(project)}
                variant="outline"
                size="md"
                className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
              >
                 Details
              </Button>
              {project.liveLink && (
                  <Button 
                    href={project.liveLink} 
                    external 
                    size="md" 
                    className="flex-1 gap-2 shadow-md shadow-primary/5 hover:shadow-primary/20"
                    aria-label={`Visit live demo of ${project.title}`}
                  >
                    Demo <ExternalLink size={16} />
                  </Button>
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const { data } = useStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProject) setActiveImageIndex(0);
  }, [selectedProject]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject && selectedProject.images) {
        setActiveImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject && selectedProject.images) {
        setActiveImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative" aria-label="Portfolio Projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">My Projects</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">My Portfolio</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {data.projects.map((project, index) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                onOpen={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60]"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-5xl w-[95%] md:w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-slate-200 dark:border-slate-700 flex flex-col relative"
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-40 backdrop-blur-md"
                  aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                {/* Enhanced Image Viewer for All Aspect Ratios */}
                <div className="w-full relative flex-shrink-0 bg-slate-950 group overflow-hidden" style={{ minHeight: '300px', maxHeight: '65vh' }}>
                    {/* Blurred Background Layer to fill space */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`bg-${activeImageIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-0"
                        >
                             <img 
                                src={selectedProject.images[activeImageIndex]} 
                                alt=""
                                className="w-full h-full object-cover blur-xl opacity-50 scale-110" 
                             />
                             <div className="absolute inset-0 bg-black/30"></div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Main Image Layer - Object Contain to show full image */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8">
                         <AnimatePresence mode='wait'>
                            <motion.img 
                                key={activeImageIndex}
                                src={selectedProject.images[activeImageIndex]} 
                                alt={`${selectedProject.title} view ${activeImageIndex + 1}`} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-full max-h-[55vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                            />
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    {selectedProject.images && selectedProject.images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage} 
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition-all z-20"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextImage} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition-all z-20"
                            >
                                <ChevronRight size={24} />
                            </button>
                            
                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 backdrop-blur-sm p-2 rounded-full">
                                {selectedProject.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80 w-2'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 md:p-10">
                     {/* Title Section (Moved out of image) */}
                     <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
                                {selectedProject.role}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                {selectedProject.title}
                            </h3>
                         </div>
                         <div className="flex gap-3">
                             {selectedProject.liveLink && (
                                <Button href={selectedProject.liveLink} external size="md" className="shadow-lg shadow-primary/20">
                                    Live Demo <ExternalLink size={16} className="ml-2"/>
                                </Button>
                             )}
                             {selectedProject.repoLink && (
                                <Button href={selectedProject.repoLink} external variant="outline" size="md">
                                    Code <Github size={16} className="ml-2"/>
                                </Button>
                             )}
                         </div>
                     </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-10 border-t border-slate-100 dark:border-slate-800 pt-8">
                        <div className="flex-1 space-y-8">
                             {/* Short Description / Summary */}
                             <div>
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Summary</h4>
                                <p className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                                    {selectedProject.description}
                                </p>
                             </div>

                             {/* Long Description / Details */}
                             <div>
                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Detailed Overview</h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                                    {selectedProject.longDescription}
                                </p>
                             </div>

                             {/* Key Features */}
                             <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 text-primary rounded-lg">
                                    <Star size={20} />
                                  </div>
                                  Key Features
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                  {selectedProject.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-4 group">
                                      <div className="mt-1 w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 transition-colors border border-green-500/20">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                      </div>
                                      <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{feature}</span>
                                    </div>
                                  ))}
                                  {selectedProject.features.length === 0 && (
                                    <p className="text-slate-400 italic">No specific features listed.</p>
                                  )}
                                </div>
                             </div>
                        </div>

                        <div className="w-full md:w-72 flex-shrink-0">
                            <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 sticky top-4">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                                  <Layers size={14} className="text-slate-400"/> Technologies
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack.map(tech => (
                                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;