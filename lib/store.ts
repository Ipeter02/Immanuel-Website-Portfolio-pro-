import { useState, useEffect } from 'react';
import { Project, AppData, HeroData, Message, AboutData, SkillCategory, Service, AppSettings } from '../types';
import { supabase } from './supabase';

// Check if we are using the custom backend
const env = (import.meta as any).env;
const USE_CUSTOM_SERVER = env?.VITE_USE_CUSTOM_SERVER === 'true';
const CUSTOM_API_URL = env?.VITE_CUSTOM_API_URL || 'http://localhost:3001/api';

const defaultHero: HeroData = {
  headline: "Hi, I'm Immanuel Gondwe",
  subheadline: "Transforming ideas into high-performance web applications. Focused on scalable architecture and seamless user experiences.",
  roles: ["Full Stack Developer", "CS Student", "React Specialist", "Problem Solver"],
  backgroundImages: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ],
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

const defaultAbout: AboutData = {
  title: "I code to innovate and simplify.",
  bio1: "Hey! I'm Immanuel. My journey into tech began with a curiosity for how things work under the hood. Today, I'm a Computer Science student channeling that curiosity into building robust full-stack applications.",
  bio2: "I specialize in the React ecosystem and Node.js. Whether it's pixel-perfect frontends or scalable backends, I love the challenge of creating clean, efficient software.",
  stats: {
    experienceYears: "2+",
    projectsCompleted: "10+",
    deliverySpeed: "Fast"
  },
  imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

const defaultSkills: SkillCategory[] = [
  {
    title: 'Frontend',
    iconName: 'Layout',
    skills: [
      { name: 'React' }, { name: 'Next.js' }, { name: 'TypeScript' }, 
      { name: 'Tailwind CSS' }, { name: 'Framer Motion' }
    ]
  },
  {
    title: 'Backend',
    iconName: 'Server',
    skills: [
      { name: 'NestJS' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, 
      { name: 'Prisma' }, { name: 'REST API' }
    ]
  },
  {
    title: 'DevOps & Tools',
    iconName: 'Terminal',
    skills: [
      { name: 'Git' }, { name: 'Docker' }, { name: 'AWS' }, { name: 'Vercel' }
    ]
  },
  {
    title: 'Design',
    iconName: 'PenTool',
    skills: [
      { name: 'Figma' }, { name: 'UI/UX Principles' }, { name: 'Responsive Design' }
    ]
  }
];

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Frontend Dev',
    description: 'Building responsive, accessible, and high-performance user interfaces using React, Next.js and Tailwind CSS.',
    longDescription: 'I craft pixel-perfect, engaging, and accessible user interfaces that leave a lasting impression.',
    iconName: 'Code',
    features: ['SPA with React', 'SSR with Next.js', 'Responsive Design', 'Accessibility']
  },
  {
    id: '2',
    title: 'Backend Dev',
    description: 'Designing scalable RESTful APIs, robust microservices, and secure database architectures using NestJS.',
    longDescription: 'Powering applications with secure, scalable, and high-performance server-side solutions.',
    iconName: 'Server',
    features: ['RESTful APIs', 'Microservices', 'Database Design', 'Authentication']
  },
  {
    id: '3',
    title: 'Full Stack Integration',
    description: 'Seamlessly connecting frontend and backend systems with type-safe implementations.',
    longDescription: 'Bridging the gap between client and server to deliver complete, cohesive digital products.',
    iconName: 'Globe',
    features: ['End-to-End Type Safety', 'Real-time Features', 'API Integrations', 'CI/CD']
  },
  {
    id: '4',
    title: 'Performance',
    description: 'Optimizing application speed, implementing caching strategies, and ensuring best SEO practices.',
    longDescription: 'Speed matters. In a digital world where milliseconds count, I analyze and optimize web applications.',
    iconName: 'Zap',
    features: ['Core Web Vitals', 'Caching (Redis)', 'Image Optimization', 'Technical SEO']
  }
];

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "A comprehensive admin dashboard for managing products, orders, and analytics.",
    role: "Full Stack",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    techStack: ["Next.js", "NestJS", "PostgreSQL", "Tailwind"],
    liveLink: "#",
    repoLink: "#",
    challenges: "Handling real-time updates for inventory while ensuring consistency.",
    longDescription: "This project addresses the need for a centralized control hub for e-commerce business owners.",
    features: ["Real-time sales analytics", "Role-based access control", "Inventory management"]
  },
  {
    id: 2,
    title: "Task Management API",
    description: "A scalable REST API for a collaborative task management tool.",
    role: "Backend",
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    techStack: ["NestJS", "Docker", "Redis", "Swagger"],
    liveLink: "#",
    repoLink: "#",
    challenges: "Optimizing database queries for complex filtering.",
    longDescription: "Designed to serve as the backbone for a Trello-like application.",
    features: ["Advanced task filtering", "Team collaboration", "Redis caching"]
  }
];

const defaultSettings: AppSettings = {
  email: 'contact@immanuelgondwe.com',
  adminProfileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  resumeUrl: "",
  location: "Northern region mzuzu malawi",
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com'
  },
  contactHeading: "Let's work together!",
  contactDescription: "I am currently available for freelance projects and full-time opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"
};

const initialData: AppData = {
  hero: defaultHero,
  about: defaultAbout,
  skills: defaultSkills,
  services: defaultServices,
  projects: defaultProjects,
  messages: [],
  settings: defaultSettings
};

// --- GLOBAL STATE SINGLETON ---
let globalData: AppData = initialData;
let globalIsLoaded = false;
let listeners: (() => void)[] = [];

// Helper to notify all components to re-render
const notify = () => listeners.forEach(l => l());

const setGlobalData = (newData: AppData) => {
  globalData = newData;
  notify();
};

const setGlobalIsLoaded = (loaded: boolean) => {
  globalIsLoaded = loaded;
  notify();
};

// --- INITIALIZATION LOGIC ---
const initializeData = async () => {
    // 1. Attempt to load from localStorage immediately
    // This allows the site to show something instantly while the network request happens
    try {
        const localData = localStorage.getItem('portfolio_data');
        if (localData) {
            const parsed = JSON.parse(localData);
            setGlobalData(parsed);
            // Crucial: Mark as loaded immediately if we have ANY data
            setGlobalIsLoaded(true); 
        }
    } catch(e) {
        console.warn("Local storage error:", e);
    }

    // If no Supabase and no Custom Server, just stop here and mark loaded
    if (!USE_CUSTOM_SERVER && !supabase) {
        setGlobalIsLoaded(true);
        return;
    }

    // 2. Background fetch to update data
    // We do NOT await this in a way that blocks the UI if we already loaded local data
    try {
        if (USE_CUSTOM_SERVER) {
            const res = await fetch(`${CUSTOM_API_URL}/portfolio`);
            if (res.ok) {
                const jsonData = await res.json();
                setGlobalData(jsonData);
            }
        } else if (supabase) {
            const { data: dbData } = await supabase
                .from('portfolio_data')
                .select('content')
                .eq('id', 1)
                .single();

            if (dbData && dbData.content) {
                setGlobalData(dbData.content);
                // Update local storage backup
                localStorage.setItem('portfolio_data', JSON.stringify(dbData.content));
            }
        }
    } catch (e) {
        console.error("Background fetch failed", e);
    } finally {
        // Ensure we are marked as loaded regardless of network success/failure
        setGlobalIsLoaded(true);
    }
};

// Start initialization immediately
initializeData();

// --- REACT HOOK ---
export const useStore = () => {
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    listeners.push(listener);
    
    // Safety check: if for some reason init didn't fire or hang, force it
    if (!globalIsLoaded) {
        // Check if we already have data in memory
        if (globalData) {
            setGlobalIsLoaded(true);
        } else {
            // Fallback timeout
            const t = setTimeout(() => setGlobalIsLoaded(true), 1000);
            return () => {
                clearTimeout(t);
                listeners = listeners.filter(l => l !== listener);
            };
        }
    }

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const saveData = async (newData: AppData) => {
    try {
      setGlobalData(newData);
      localStorage.setItem('portfolio_data', JSON.stringify(newData)); // Always update local backup

      if (USE_CUSTOM_SERVER) {
          await fetch(`${CUSTOM_API_URL}/portfolio`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newData)
          });
      }
      else if (supabase) {
        const { error } = await supabase
            .from('portfolio_data')
            .upsert({ id: 1, content: newData });
        if (error) throw error;
      } 
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  };

  // Helper functions
  const updateHero = (hero: HeroData) => saveData({ ...globalData, hero });
  const updateAbout = (about: AboutData) => saveData({ ...globalData, about });
  const addProject = (project: Project) => saveData({ ...globalData, projects: [{ ...project, id: Date.now() }, ...globalData.projects] });
  const updateProject = (project: Project) => saveData({ ...globalData, projects: globalData.projects.map(p => p.id === project.id ? project : p) });
  const deleteProject = (id: number) => saveData({ ...globalData, projects: globalData.projects.filter(p => p.id !== id) });
  const updateSkills = (skills: SkillCategory[]) => saveData({ ...globalData, skills });
  const addService = (service: Service) => saveData({ ...globalData, services: [...globalData.services, { ...service, id: Math.random().toString(36).substr(2, 9) }] });
  const updateService = (service: Service) => saveData({ ...globalData, services: globalData.services.map(s => s.id === service.id ? service : s) });
  const deleteService = (id: string) => saveData({ ...globalData, services: globalData.services.filter(s => s.id !== id) });
  const addMessage = (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    saveData({ ...globalData, messages: [{ ...msg, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false }, ...globalData.messages] });
    return true;
  };
  const markMessageRead = (id: string) => saveData({ ...globalData, messages: globalData.messages.map(m => m.id === id ? { ...m, read: true } : m) });
  const deleteMessage = (id: string) => saveData({ ...globalData, messages: globalData.messages.filter(m => m.id !== id) });
  const updateSettings = (settings: AppSettings) => saveData({ ...globalData, settings });
  const resetData = () => { if (window.confirm("Reset all data?")) saveData(initialData); };

  return {
    data: globalData,
    isLoaded: globalIsLoaded,
    updateHero, updateAbout, addProject, updateProject, deleteProject, updateSkills,
    addService, updateService, deleteService, addMessage, markMessageRead, deleteMessage,
    updateSettings, resetData
  };
};