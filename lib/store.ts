import { useState, useEffect } from 'react';
import { Project, AppData, HeroData, Message, AboutData, SkillCategory, Service, AppSettings } from '../types';
import { supabase } from './supabase';
import imageCompression from 'browser-image-compression';
import { saveFileLocally, saveAppDataLocally, getAppDataLocally } from './localDb';

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
  email: 'immanuelgondwe52@gmail.com',
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
let globalIsAdmin = false;
let globalToken = localStorage.getItem('admin_token') || '';
if (globalToken) globalIsAdmin = true;
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

const setGlobalIsAdmin = (isAdmin: boolean, token: string = '') => {
  globalIsAdmin = isAdmin;
  globalToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
  notify();
};

// --- INITIALIZATION LOGIC ---
const initializeData = async () => {
    // 1. Attempt to load from IndexedDB (Built-in Database) for robust offline support
    let localDBData: AppData | undefined;
    try {
        localDBData = await getAppDataLocally();
        if (localDBData) {
            // Deep merge vital sections
            const merged = { 
                ...initialData, 
                ...localDBData, 
                about: { ...initialData.about, ...localDBData.about },
                settings: { ...initialData.settings, ...localDBData.settings } 
            };
            setGlobalData(merged);
            console.log("Loaded data from built-in database (IndexedDB)");
        } else {
            // Migration: Check localStorage if IndexedDB is empty
            const localData = localStorage.getItem('portfolio_data');
            if (localData) {
                const parsed = JSON.parse(localData);
                const merged = { 
                    ...initialData, 
                    ...parsed, 
                    about: { ...initialData.about, ...parsed.about },
                    settings: { ...initialData.settings, ...parsed.settings } 
                };
                setGlobalData(merged);
                // Migrate to IndexedDB
                await saveAppDataLocally(merged);
            }
        }
    } catch(e) {
        console.warn("Local database error:", e);
    }

    // 2. Fetch Data from Backend (Overrides local storage if newer)
    try {
        let fetchedFromSupabase = false;
        let supabaseData: any = null;
        let supabaseUpdatedAt: string | null = null;
        
        if (supabase) {
            try {
                // Option A: Supabase (Priority)
                const { data: dbData, error } = await supabase
                    .from('portfolio_data')
                    .select('content, updated_at')
                    .eq('id', 1)
                    .single();

                if (!error && dbData && dbData.content) {
                    supabaseData = dbData.content;
                    supabaseUpdatedAt = dbData.updated_at;
                    
                    // SMART SYNC LOGIC:
                    // Compare local vs remote timestamps to decide winner
                    const remoteTime = new Date(supabaseUpdatedAt || 0).getTime();
                    const localTime = localDBData?.lastUpdated || 0;
                    
                    // If local is significantly newer (e.g. > 5 seconds), push to cloud
                    if (localTime > remoteTime + 5000) {
                        console.log("Local data is newer than cloud. Auto-syncing to Supabase...");
                        await supabase.from('portfolio_data').upsert({ id: 1, content: localDBData });
                        // Keep local data as is
                        globalConnectionStatus = 'supabase';
                        fetchedFromSupabase = true;
                    } else {
                        // Remote is newer or same, use remote
                        console.log("Cloud data is newer or same. Using cloud version.");
                        const merged = { 
                            ...initialData, 
                            ...dbData.content, 
                            about: { ...initialData.about, ...dbData.content.about },
                            settings: { ...initialData.settings, ...dbData.content.settings } 
                        };
                        
                        setGlobalData(merged);
                        // Sync to local built-in database
                        await saveAppDataLocally(merged);
                        
                        globalConnectionStatus = 'supabase';
                        fetchedFromSupabase = true;
                    }
                } else if (error) {
                    console.warn("Supabase fetch error (likely first run or offline):", error.message);
                    // If it's a "Row not found" error (PGRST116), it means the DB is empty but connected.
                    if (error.code === 'PGRST116') {
                        // If we have local data, push it up immediately!
                        if (localDBData) {
                             console.log("Supabase empty. Pushing local data...");
                             await supabase.from('portfolio_data').upsert({ id: 1, content: localDBData });
                        }
                        globalConnectionStatus = 'supabase'; 
                        fetchedFromSupabase = true;
                    } 
                    // If table doesn't exist (42P01), warn user to run setup script
                    else if (error.code === '42P01') {
                        console.error("CRITICAL: Supabase table 'portfolio_data' does not exist. Please run 'supabase_setup.sql' in your Supabase SQL Editor.");
                        // alert("Database Setup Required: The 'portfolio_data' table is missing in Supabase. Please run the provided SQL script.");
                    }
                }
            } catch (supabaseError) {
                console.warn("Supabase fetch exception:", supabaseError);
            }
        }
        
        if (USE_CUSTOM_SERVER) {
            // Option B: Custom Node Backend (Fallback & Sync)
            try {
                const res = await fetch(`${CUSTOM_API_URL}/portfolio`);
                if (res.ok) {
                    const jsonData = await res.json();
                    const serverData = jsonData.content || jsonData;
                    const serverUpdatedAt = jsonData.updatedAt;

                    // Sync logic: If Server has newer data, update Supabase and use Server data
                    if (supabase && serverUpdatedAt) {
                        const supTime = supabaseUpdatedAt ? new Date(supabaseUpdatedAt).getTime() : 0;
                        const monTime = new Date(serverUpdatedAt).getTime();
                        
                        if (monTime > supTime) {
                            console.log("Server data is newer (or Supabase is empty). Syncing to Supabase...");
                            await supabase.from('portfolio_data').upsert({ id: 1, content: serverData });
                            
                            const merged = { 
                                ...initialData, 
                                ...serverData, 
                                ...{ about: { ...initialData.about, ...serverData.about } },
                                ...{ settings: { ...initialData.settings, ...serverData.settings } } 
                            };
                            setGlobalData(merged);
                            await saveAppDataLocally(merged);
                        }
                    } else if (!fetchedFromSupabase) {
                        // Fallback if Supabase failed
                        const merged = { 
                            ...initialData, 
                            ...serverData, 
                            about: { ...initialData.about, ...serverData.about },
                            settings: { ...initialData.settings, ...serverData.settings } 
                        };
                        setGlobalData(merged);
                        await saveAppDataLocally(merged);
                        globalConnectionStatus = 'custom-server';
                    }
                } else if (!fetchedFromSupabase) {
                    globalConnectionStatus = 'offline';
                }
            } catch (err) {
                console.warn("Custom server unreachable:", err);
                if (!fetchedFromSupabase) globalConnectionStatus = 'offline';
            }
        } else if (!fetchedFromSupabase) {
            globalConnectionStatus = 'offline';
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

    // Add online listener for auto-sync
    const handleOnline = () => {
        console.log("Back online! Re-initializing to sync...");
        initializeData();
    };
    window.addEventListener('online', handleOnline);

    return () => {
      listeners = listeners.filter(l => l !== listener);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Generic Save Function (Full Overwrite)
  const saveData = async (newData: AppData) => {
    try {
      // Add timestamp for sync logic
      const dataWithTimestamp = { ...newData, lastUpdated: Date.now() };
      
      // 1. Update State
      setGlobalData(dataWithTimestamp);
      
      // 2. Save to Built-in Database (IndexedDB)
      // This is our primary offline storage now, replacing localStorage
      try {
        await saveAppDataLocally(dataWithTimestamp);
      } catch (dbError) {
        console.error("Local database save error:", dbError);
      }

      // 3. Persist to Backend
      let savedToSupabase = false;
      if (supabase) {
        try {
          const { error } = await supabase
              .from('portfolio_data')
              .upsert({ id: 1, content: dataWithTimestamp });
          if (error) {
              console.error("Supabase Save Error:", error.message);
          } else {
              savedToSupabase = true;
          }
        } catch (supabaseError) {
          console.error("Supabase Save Exception:", supabaseError);
        }
      } 
      
      if (!savedToSupabase && USE_CUSTOM_SERVER) {
          try {
              await fetch(`${CUSTOM_API_URL}/portfolio`, {
                  method: 'POST',
                  headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${globalToken}`
                  },
                  body: JSON.stringify(dataWithTimestamp)
              });
          } catch (err) {
              console.error("Custom server save error:", err);
          }
      }
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  };

  // --- Actions ---

  // Upload File Logic
  const uploadFile = async (file: File): Promise<string> => {
      let uploadedToSupabase = false;
      let url = '';
      let fileToUpload = file;
      
      // Image Compression
      if (file.type.startsWith('image/')) {
          try {
              const options = {
                  maxSizeMB: 0.5,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true
              };
              fileToUpload = await imageCompression(file, options);
          } catch (error) {
              console.error("Image compression failed:", error);
          }
      }
      
      if (supabase) {
          try {
              // Sanitize filename
              const fileExt = fileToUpload.name.split('.').pop() || 'png';
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
              // Use 'resumes' folder for PDFs, 'images' for others
              const folder = file.type === 'application/pdf' ? 'resumes' : 'images';
              const filePath = `${folder}/${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from('portfolio-assets')
                .upload(filePath, fileToUpload);

              if (!uploadError) {
                  const { data } = supabase.storage
                    .from('portfolio-assets')
                    .getPublicUrl(filePath);
                  url = data.publicUrl;
                  
                  // Verify if the URL is actually accessible (Bucket might not be public)
                  try {
                      const checkRes = await fetch(url, { method: 'HEAD' });
                      if (!checkRes.ok) {
                          console.warn("Uploaded file is not publicly accessible. Bucket might not be public.");
                          alert("⚠️ Upload Successful, but Image is not accessible.\n\nPlease ensure your 'portfolio-assets' bucket is set to PUBLIC in Supabase Storage settings.\n\nOr run the 'supabase_setup.sql' script.");
                      }
                  } catch (e) {
                      console.warn("Could not verify image accessibility:", e);
                  }

                  uploadedToSupabase = true;
                  return url; // Return immediately on success
              } else {
                  console.error("Supabase Upload Error:", uploadError);
                  throw new Error(`Supabase Upload Failed: ${uploadError.message}`);
              }
          } catch (e) {
              console.error("Supabase Upload Exception:", e);
              throw e; // Re-throw to prevent silent fallback to broken custom server
          }
      } 
      
      let uploadedToServer = false;
      
      if (!uploadedToSupabase && USE_CUSTOM_SERVER) {
          try {
              const formData = new FormData();
              formData.append('file', fileToUpload);
              const res = await fetch(`${CUSTOM_API_URL}/upload`, {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${globalToken}`
                  },
                  body: formData
              });
              if (res.ok) {
                  const data = await res.json();
                  uploadedToServer = true;
                  return data.url;
              }
          } catch (e) {
              // Only log if we expected a server to be there (i.e. not just a network error in local mode)
              // console.warn("Custom server upload failed, falling back to local storage.");
          }
      }
      
      // If neither Supabase nor Custom Server worked, use Local Storage
      if (!uploadedToSupabase && !uploadedToServer) {
          // Offline/Local: Use IndexedDB (idb-keyval) for persistent local storage
          // This bypasses the 5MB localStorage limit and persists across refreshes
          try {
              const base64 = await saveFileLocally(fileToUpload);
              return base64;
          } catch (idbError) {
              console.error("IndexedDB save failed:", idbError);
              
              // Fallback to old localStorage method if IDB fails (rare)
              // SAFETY CHECK: Prevent crashing browser with large files in local mode
              if (fileToUpload.size > 5 * 1024 * 1024) { // 5MB Limit
                  const msg = "⚠️ File too large for Local Mode!\n\nProcessing a large file (like a 100MB resume) inside the browser will freeze your page.\n\nPlease connect to a Backend (Custom Server or Supabase) to upload large files.";
                  alert(msg);
                  throw new Error("File too large for local storage");
              }
    
              return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(fileToUpload);
              });
          }
      }
      
      return url;
  };

  // Special Action: Add Message (Prevents race conditions by using specific endpoint if available)
  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage = { ...msg, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString(), read: false };
    
    // 1. Optimistic UI Update
    const newMessages = [newMessage, ...globalData.messages];
    const newData = { ...globalData, messages: newMessages };
    
    // Use the safe saveData wrapper (or manually handle it to avoid circular dependency, but saveData handles localStorage error)
    await saveData(newData); 

    let sentToSupabase = false;
    if (supabase) {
         try {
             // Fetch current state first to avoid overwriting other updates
             const { data: current, error } = await supabase.from('portfolio_data').select('content').eq('id', 1).single();
             if (!error) {
                 if (current && current.content) {
                     const remoteMessages = current.content.messages || [];
                     const updatedContent = { ...current.content, messages: [newMessage, ...remoteMessages] };
                     await supabase.from('portfolio_data').upsert({ id: 1, content: updatedContent });
                 } else {
                     // First message ever
                     await supabase.from('portfolio_data').upsert({ id: 1, content: newData });
                 }
                 sentToSupabase = true;
             }
         } catch (supabaseError) {
             console.error("Supabase Add Message Exception:", supabaseError);
         }
    }
    
    // ALWAYS call the custom server if enabled. 
    // This is crucial because the server handles EMAIL NOTIFICATIONS.
    // Even if we saved to Supabase, we need the server to send the email.
    if (USE_CUSTOM_SERVER) {
         try {
             // Use dedicated endpoint to append message safely (Backend handles atomic update)
             await fetch(`${CUSTOM_API_URL}/contact`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(newMessage)
             });
         } catch (customServerError) {
             console.error("Custom server add message error:", customServerError);
         }
    }
    return true;
  };

  // Reply to Message
  const replyToMessage = async (to: string, subject: string, message: string, originalMessageId: string) => {
      if (USE_CUSTOM_SERVER) {
          const res = await fetch(`${CUSTOM_API_URL}/reply`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${globalToken}`
              },
              body: JSON.stringify({ to, subject, message, originalMessageId })
          });
          if (!res.ok) throw new Error('Failed to send reply');
          return true;
      } else {
          throw new Error("Cannot send email in local/offline mode. Please configure backend.");
      }
  };

  // Login
  const login = async (password: string) => {
      if (USE_CUSTOM_SERVER) {
          const res = await fetch(`${CUSTOM_API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password })
          });
          if (res.ok) {
              const data = await res.json();
              setGlobalIsAdmin(true, data.token);
              return true;
          }
          return false;
      } else {
          // Fallback for local/Supabase without custom server auth
          if (password === (import.meta as any).env.VITE_ADMIN_PASSWORD || password === 'admin' || password === 'admin123') {
              setGlobalIsAdmin(true, 'local-token');
              return true;
          }
          return false;
      }
  };

  const logout = () => {
      setGlobalIsAdmin(false, '');
  };

  const setAdminState = (isAdmin: boolean, token: string = '') => {
      setGlobalIsAdmin(isAdmin, token);
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
    isAdmin: globalIsAdmin,
    login,
    logout,
    setAdminState,
    uploadFile,
    updateHero, updateAbout, addProject, updateProject, deleteProject, updateSkills,
    addService, updateService, deleteService, addMessage, markMessageRead, deleteMessage, replyToMessage,
    updateSettings, resetData
  };
};