import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, ChevronDown, Sparkles, X, CheckCircle2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';
import Button from './ui/Button';
import { useStore } from '../lib/store';

const ProjectCard: React.FC<{ project: Project; index: number; onOpen: (project: Project) => void }> = ({ project, index, onOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
          className="w-full h-full object-cover"
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
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full group/btn focus:outline-none"
             >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 group-hover/btn:text-primary transition-colors">
                    <Sparkles size={14} />
                    <span>Key Challenge</span>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-slate-400 group-hover/btn:text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
             </button>
             <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed border-l-2 border-primary/30 pl-3 ml-1">
                                "{project.challenges}"
                            </p>
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>
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
                className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-4xl w-[95%] md:w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-slate-200 dark:border-slate-700 flex flex-col relative"
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-30 backdrop-blur-md"
                  aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <div className="w-full h-56 sm:h-72 md:h-80 relative flex-shrink-0 bg-slate-900 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
                    
                    <AnimatePresence mode='wait'>
                        <motion.img 
                            key={activeImageIndex}
                            src={selectedProject.images[activeImageIndex]} 
                            alt={`${selectedProject.title} view ${activeImageIndex + 1}`} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {selectedProject.images && selectedProject.images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage} 
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextImage} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            >
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 flex gap-2 z-20 bg-black/20 backdrop-blur-sm p-1.5 rounded-full">
                                {selectedProject.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80 w-1.5'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className="absolute bottom-6 left-6 md:left-10 z-20 pointer-events-none pr-16 md:pr-0">
                         <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block shadow-sm">
                             {selectedProject.role}
                         </span>
                         <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-sm leading-tight">
                             {selectedProject.title}
                         </h3>
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                        <div className="flex-1 space-y-8">
                             {/* Short Description / Summary */}
                             <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Summary</h4>
                                <p className="text-lg md:text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
                                    {selectedProject.description}
                                </p>
                             </div>

                             {/* Long Description / Details */}
                             <div>
                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Detailed Overview</h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                                    {selectedProject.longDescription}
                                </p>
                             </div>

                             <div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                  <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                  Key Features
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {selectedProject.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-cream dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                      <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                             </div>

                             <div className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="text-primary" size={18} /> Technical Challenge
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 italic">
                                    "{selectedProject.challenges}"
                                </p>
                             </div>
                        </div>

                        <div className="w-full md:w-72 flex-shrink-0 space-y-8">
                            <div className="flex flex-col gap-3">
                                {selectedProject.liveLink && (
                                    <Button href={selectedProject.liveLink} external size="lg" className="w-full justify-center">
                                        Live Demo <ExternalLink size={18} className="ml-2"/>
                                    </Button>
                                )}
                                {selectedProject.repoLink && (
                                    <Button href={selectedProject.repoLink} external variant="outline" size="lg" className="w-full justify-center">
                                        View Code <Github size={18} className="ml-2"/>
                                    </Button>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack.map(tech => (
                                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
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