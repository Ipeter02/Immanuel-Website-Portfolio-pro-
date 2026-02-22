import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Server, Terminal, Globe, Database, Layout, Smartphone, Cloud, Palette, Zap, Shield, Search,
  GitBranch, Box, Layers, Monitor, Wifi, Bluetooth, HardDrive, FileCode, FileJson, Hash, Braces,
  Command, Chrome, Figma, Framer, Slack, Trello, Coffee, Link, Share2, Anchor, Award, Book,
  Calendar, Camera, Circle, Clipboard, Clock, Compass, Copy, CreditCard, Disc, Download,
  Edit, File, FileText, Filter, Flag, Folder, Gift, Grid, Heart,
  Inbox, Info, Key, LifeBuoy, List, Map, MapPin, Mic, Moon, Music, Package, Paperclip,
  Phone, PieChart, Play, Power, Printer, Radio, RefreshCw, Repeat, RotateCw, Rss,
  Scissors, Send, ShoppingBag, ShoppingCart, Sliders, Speaker, Star, Sun, Table, Tag,
  Thermometer, ThumbsUp, ToggleLeft, Wrench, Truck, Tv, Umbrella, Unlock, UserCheck,
  UserPlus, Users, Video, Voicemail, Volume, Volume2, Watch, Youtube, TrendingUp, BarChart, DollarSign, Target,
  Bookmark,
  Code2, BookOpen
} from 'lucide-react';
import { useStore } from '../lib/store';

// Helper to map string names to Lucide components - Matching Admin.tsx for consistency
const AboutIconMap: any = { 
  Code, Code2, Server, Terminal, Database, GitBranch, FileCode, Braces, Command, Hash, FileJson,
  Globe, Layout, Smartphone, Monitor, Chrome, Wifi, Bluetooth,
  Palette, PenTool: Layout, Figma, Framer, Image: Layout, Camera, Video, Music, Layers, Scissors,
  Cloud, Cpu: Layout, HardDrive, Box, Power, Settings: Layout, Shield, Lock: Shield, Wrench,
  Briefcase: Layout, TrendingUp, BarChart, PieChart, Target, DollarSign, CreditCard, ShoppingCart, ShoppingBag, Award,
  MessageSquare: Layout, Mail: Layout, Phone, Send, Share2, Slack, Trello, User: Layout, Users, ThumbsUp, Heart, Star,
  Home: Layout, Search, Menu: Layout, List, Grid, Filter, Calendar, Clock, MapPin, Link, ExternalLink: Link,
  Zap, Info, AlertTriangle: Layout, Check: Layout, X: Layout, Trash2: Layout, Plus: Layout, Edit, Copy, Download, Upload: Layout,
  BookOpen,
  Coffee, Gift, Flag, Tag, Bookmark, Anchor, Key, Umbrella, Sun, Moon, Truck, Package
};

const About: React.FC = () => {
  const { data } = useStore();
  const { about } = data;
  
  // Fallback for older data structures if cards don't exist yet
  const cards = about.cards || [
    { title: "Development", description: "Clean code, modern patterns, and scalable architecture.", iconName: "Code2" },
    { title: "Learning", description: "Constantly upskilling in System Design and Cloud Tech.", iconName: "BookOpen" }
  ];

  const bgColors = [
    "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
    "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  ];

  return (
    <section id="about" className="py-12 md:py-16 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Know Me Better</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">About Me</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="md:col-span-12 lg:col-span-7 space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight text-center md:text-left">
              {about.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {about.bio1}
            </p>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {about.bio2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {cards.map((card, idx) => {
                  const Icon = AboutIconMap[card.iconName] || Code2;
                  const colorClass = bgColors[idx % bgColors.length];
                  
                  return (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-5 bg-cream dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-default transition-colors hover:border-primary/20 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2.5 rounded-xl ${colorClass}`}>
                            <Icon size={22} />
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{card.title}</h4>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{card.description}</p>
                      </motion.div>
                  );
              })}
            </div>
          </motion.div>

          {/* Stats / Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-12 lg:col-span-5 flex flex-col gap-6 lg:pt-8"
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

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-primary/20 cursor-pointer"
               >
                  <Target className="mb-3 opacity-80" size={28} />
                  <p className="text-3xl font-extrabold">{about.stats.projectsCompleted}</p>
                  <p className="text-sky-100 text-sm font-medium mt-1">Projects Completed</p>
               </motion.div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
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