import { useState, useEffect } from 'react';
import { Project, AppData, HeroData, Message, AboutData, SkillCategory, Service, AppSettings } from '../types';
import { supabase } from './supabase';

// Check if we are using the custom backend
const env = (import.meta as any).env;
const USE_CUSTOM_SERVER = env?.VITE_USE_CUSTOM_SERVER !== 'false'; // Default to true unless explicitly disabled
const CUSTOM_API_URL = env?.VITE_CUSTOM_API_URL || '/api';

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
  imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  cards: [
    { 
        title: "Development", 
        description: "Clean code, modern patterns, and scalable architecture.", 
        iconName: "Code2" 
    },
    { 
        title: "Learning", 
        description: "Constantly upskilling in System Design and Cloud Tech.", 
        iconName: "BookOpen" 
    }
  ]
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
    techStack: ["Next.js", "Docker", "Redis", "Swagger"],
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
    youtube: 'https://youtube.com'
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
let globalConnectionStatus: 'local' | 'custom-server' | 'supabase' | 'offline' = 'local';
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
    // 1. Attempt to load from localStorage immediately for speed/offline support
    try {
        const localData = localStorage.getItem('portfolio_data');
        if (localData) {
            const parsed = JSON.parse(localData);
            // Deep merge vital sections to ensure new fields (like about.cards) exist if they are missing in local storage
            const merged = { 
                ...initialData, 
                ...parsed, 
                about: { ...initialData.about, ...parsed.about }, // Merge about so new fields aren't lost
                settings: { ...initialData.settings, ...parsed.settings } 
            };
            setGlobalData(merged);
        }
    } catch(e) {
        console.warn("Local storage error:", e);
    }

    // 2. Fetch Data from Backend (Overrides local storage if newer)
    try {
        if (USE_CUSTOM_SERVER) {
            // Option A: Custom Node Backend
            try {
                const res = await fetch(`${CUSTOM_API_URL}/portfolio`);
                if (res.ok) {
                    const jsonData = await res.json();
                    setGlobalData(jsonData);
                    try {
                        localStorage.setItem('portfolio_data', JSON.stringify(jsonData));
                    } catch (e) {
                         console.warn("Initial data too large for localStorage.");
                    }
                    globalConnectionStatus = 'custom-server';
                }
            } catch (err) {
                console.warn("Custom server unreachable:", err);
                globalConnectionStatus = 'offline';
            }
        } else if (supabase) {
            // Option B: Supabase (Priority)
            const { data: dbData, error } = await supabase
                .from('portfolio_data')
                .select('content')
                .eq('id', 1)
                .single();

            if (!error && dbData && dbData.content) {
                // We found data in the cloud, let's use it!
                // Ensure schema compatibility
                const merged = { 
                    ...initialData, 
                    ...dbData.content, 
                    about: { ...initialData.about, ...dbData.content.about },
                    settings: { ...initialData.settings, ...dbData.content.settings } 
                };
                
                setGlobalData(merged);
                try {
                    localStorage.setItem('portfolio_data', JSON.stringify(merged));
                } catch (e) {
                     console.warn("Initial data too large for localStorage.");
                }
                globalConnectionStatus = 'supabase';
            } else if (error) {
                console.warn("Supabase fetch error (likely first run or offline):", error.message);
                // If it's a "Row not found" error, it means the DB is empty.
                // We will stick with local data (or defaults) and mark status as Supabase
                // so the first Save writes to it.
                if (error.code === 'PGRST116') {
                    globalConnectionStatus = 'supabase'; 
                } else {
                    globalConnectionStatus = 'offline';
                }
            }
        }
    } catch (e) {
        console.error("Background fetch failed", e);
    } finally {
        setGlobalIsLoaded(true);
        notify(); // Notify components about status change
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
    
    // Check safety
    if (!globalIsLoaded) {
         // Force a check if it hangs
         const t = setTimeout(() => {
             if (!globalIsLoaded) setGlobalIsLoaded(true);
         }, 1000);
         return () => { clearTimeout(t); listeners = listeners.filter(l => l !== listener); }
    }

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  // Generic Save Function (Full Overwrite)
  const saveData = async (newData: AppData) => {
    try {
      // 1. Update State
      setGlobalData(newData);
      
      // Attempt to save to LocalStorage, handle quota errors
      try {
        localStorage.setItem('portfolio_data', JSON.stringify(newData));
      } catch (storageError: any) {
        // Code 22 is often QuotaExceededError
        if (storageError.name === 'QuotaExceededError' || storageError.code === 22) {
          console.warn("Local storage quota exceeded. Data will persist in memory and backend, but might not persist locally after refresh if backend is unavailable.");
          // We can optionally alert the user if we are in 'local' mode (offline)
          if (globalConnectionStatus === 'local' || globalConnectionStatus === 'offline') {
              alert("Storage limit reached! Your data (especially large images/files) cannot be saved locally anymore. Please connect to a backend or delete some large items.");
          }
        } else {
          console.error("Local storage error:", storageError);
        }
      }

      // 2. Persist to Backend
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
        if (error) {
            console.error("Supabase Save Error:", error.message);
            alert("Error saving to cloud: " + error.message);
        }
      } 
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  };

  // --- Actions ---

  // Upload File Logic
  const uploadFile = async (file: File): Promise<string> => {
      if (supabase) {
          // Sanitize filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio-assets')
            .upload(filePath, file);

          if (uploadError) {
              console.error("Supabase Upload Error:", uploadError);
              throw uploadError;
          }

          const { data } = supabase.storage
            .from('portfolio-assets')
            .getPublicUrl(filePath);

          return data.publicUrl;
      } else if (globalConnectionStatus === 'custom-server') {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${CUSTOM_API_URL}/upload`, {
              method: 'POST',
              body: formData
          });
          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          return data.url;
      } else {
          // Offline/Local: Convert to Base64 (Not permanent!)
          
          // SAFETY CHECK: Prevent crashing browser with large files in local mode
          if (file.size > 5 * 1024 * 1024) { // 5MB Limit
              const msg = "⚠️ File too large for Local Mode!\n\nProcessing a large file (like a 100MB resume) inside the browser will freeze your page and cause it to be blocked by Edge/Chrome.\n\nPlease connect to a Backend (Custom Server or Supabase) to upload large files.";
              alert(msg);
              throw new Error("File too large for local storage");
          }

          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
          });
      }
  };

  // Special Action: Add Message (Prevents race conditions by using specific endpoint if available)
  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage = { ...msg, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false };
    
    // 1. Optimistic UI Update
    const newMessages = [newMessage, ...globalData.messages];
    const newData = { ...globalData, messages: newMessages };
    
    // Use the safe saveData wrapper (or manually handle it to avoid circular dependency, but saveData handles localStorage error)
    await saveData(newData); 

    try {
        if (USE_CUSTOM_SERVER) {
             // Use dedicated endpoint to append message safely (Backend handles atomic update)
             await fetch(`${CUSTOM_API_URL}/contact`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(newMessage)
             });
        } else if (supabase) {
             // Fetch current state first to avoid overwriting other updates
             const { data: current } = await supabase.from('portfolio_data').select('content').eq('id', 1).single();
             if (current && current.content) {
                 const remoteMessages = current.content.messages || [];
                 const updatedContent = { ...current.content, messages: [newMessage, ...remoteMessages] };
                 await supabase.from('portfolio_data').upsert({ id: 1, content: updatedContent });
             } else {
                 // First message ever
                 await supabase.from('portfolio_data').upsert({ id: 1, content: newData });
             }
        }
    } catch (e) {
        console.error("Failed to send message to backend", e);
    }
    return true;
  };

  // Reply to Message
  const replyToMessage = async (to: string, subject: string, message: string, originalMessageId: string) => {
      if (USE_CUSTOM_SERVER) {
          const res = await fetch(`${CUSTOM_API_URL}/reply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ to, subject, message, originalMessageId })
          });
          if (!res.ok) throw new Error('Failed to send reply');
          return true;
      } else {
          throw new Error("Cannot send email in local/offline mode. Please configure backend.");
      }
  };

  const updateHero = (hero: HeroData) => saveData({ ...globalData, hero });
  const updateAbout = (about: AboutData) => saveData({ ...globalData, about });
  const addProject = (project: Project) => saveData({ ...globalData, projects: [{ ...project, id: Date.now() }, ...globalData.projects] });
  const updateProject = (project: Project) => saveData({ ...globalData, projects: globalData.projects.map(p => p.id === project.id ? project : p) });
  const deleteProject = (id: number) => saveData({ ...globalData, projects: globalData.projects.filter(p => p.id !== id) });
  const updateSkills = (skills: SkillCategory[]) => saveData({ ...globalData, skills });
  const addService = (service: Service) => saveData({ ...globalData, services: [...globalData.services, { ...service, id: Math.random().toString(36).substr(2, 9) }] });
  const updateService = (service: Service) => saveData({ ...globalData, services: globalData.services.map(s => s.id === service.id ? service : s) });
  const deleteService = (id: string) => saveData({ ...globalData, services: globalData.services.filter(s => s.id !== id) });
  
  const markMessageRead = (id: string) => saveData({ ...globalData, messages: globalData.messages.map(m => String(m.id) === String(id) ? { ...m, read: true } : m) });
  const deleteMessage = (id: string) => saveData({ ...globalData, messages: globalData.messages.filter(m => String(m.id) !== String(id)) });
  
  const updateSettings = (settings: AppSettings) => saveData({ ...globalData, settings });
  const resetData = () => { if (window.confirm("Reset all data?")) saveData(initialData); };

  return {
    data: globalData,
    isLoaded: globalIsLoaded,
    connectionStatus: globalConnectionStatus,
    uploadFile,
    updateHero, updateAbout, addProject, updateProject, deleteProject, updateSkills,
    addService, updateService, deleteService, addMessage, markMessageRead, deleteMessage, replyToMessage,
    updateSettings, resetData
  };
};