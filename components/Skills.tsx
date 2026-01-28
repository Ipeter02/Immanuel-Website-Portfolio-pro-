import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Layout, PenTool, Terminal, Code, Database, Globe, Cpu, 
  Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
  Palette, Layers, Image,
  TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
  Zap, Activity, Wrench, Search, Shield, Lock, FileText, Mail, Calendar, Clock, MapPin,
  Camera, Video, Music, Speaker, Monitor, Hash, Tag, Flag, Bookmark, Briefcase, Settings
} from 'lucide-react';
import { useStore } from '../lib/store';

// Helper to map string names to Lucide components
const IconMap: any = {
  Server, Layout, PenTool, Terminal, Code, Database, Globe, Cpu,
  Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
  Palette, Layers, Image,
  TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
  Zap, Activity, Wrench, Search, Shield, Lock, FileText, Mail, Calendar, Clock, MapPin,
  Camera, Video, Music, Speaker, Monitor, Hash, Tag, Flag, Bookmark, Briefcase, Settings
};

const Skills: React.FC = () => {
  const { data } = useStore();

  return (
    <section id="skills" className="py-16 bg-cream dark:bg-slate-900 transition-colors duration-300" aria-label="Technical Skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">My Expertise</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">My Skills</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-6 text-lg">
            A diverse arsenal of languages and tools I use to build scalable, high-performance applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.skills.map((category, categoryIndex) => {
            const Icon = IconMap[category.iconName] || Terminal;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/5 flex flex-col hover:border-primary dark:hover:border-primary transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 relative z-10">
                  <div 
                    className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl text-primary mr-3 group-hover:scale-110 transition-transform duration-300"
                  >
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + (categoryIndex * 0.05) + (skillIndex * 0.03) }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3.5 py-1.5 bg-cream dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-transparent 
                      hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary dark:hover:text-white
                      shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all cursor-default"
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;