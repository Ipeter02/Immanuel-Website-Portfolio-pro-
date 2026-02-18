import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, MessageSquare, User, Briefcase, FolderOpen, Settings, LogOut, Bell, Home, Menu, 
  X, Cpu, Save, Trash2, Plus, Eye, EyeOff, Upload, AlertTriangle, ExternalLink, Loader2, ArrowLeft, 
  LockKeyhole, Check, Mail, PenTool, Image as ImageIcon, AlertOctagon,
  // Tech Icons
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
  Bookmark, FileText as FileTextIcon,
  Code2, BookOpen
} from 'lucide-react';
import Button from '../ui/Button';
import { Project, Service, SkillCategory } from '../../types';

// --- Icon Mapping ---
const ICON_MAP: Record<string, React.ElementType> = {
  // Development
  Code, Code2, Server, Terminal, Database, GitBranch, FileCode, Braces, Command, Hash, FileJson,
  
  // Web & Devices
  Globe, Layout, Smartphone, Monitor, Chrome, Wifi, Bluetooth,
  
  // Design & Creative
  Palette, PenTool, Figma, Framer, Image: ImageIcon, Camera, Video, Music, Layers, Scissors,
  
  // Infrastructure & Hardware
  Cloud, Cpu, HardDrive, Box, Power, Settings, Shield, LockKeyhole, Wrench,
  
  // Business & Analytics
  Briefcase, TrendingUp, BarChart, PieChart, Target, DollarSign, CreditCard, ShoppingCart, ShoppingBag, Award,
  
  // Communication & Social
  MessageSquare, Mail, Phone, Send, Share2, Slack, Trello, User, Users, ThumbsUp, Heart, Star,
  
  // General UI
  Home, Search, Menu, List, Grid, Filter, Calendar, Clock, MapPin, Link, ExternalLink,
  Zap, Info, AlertTriangle, Check, X, Trash2, Plus, Edit, Copy, Download, Upload,
  BookOpen,
  
  // Misc
  Coffee, Gift, Flag, Tag, Bookmark, Anchor, Key, Umbrella, Sun, Moon, Truck, Package
};

const AVAILABLE_ICONS = Object.keys(ICON_MAP).sort();

// Categories for the Picker
const ICON_CATEGORIES: Record<string, string[]> = {
    "Development": ["Code", "Code2", "Server", "Terminal", "Database", "GitBranch", "FileCode", "Braces", "Command", "Hash", "FileJson"],
    "Design & Creative": ["Palette", "PenTool", "Figma", "Framer", "Image", "Layers", "Camera", "Video", "Music", "Scissors"],
    "Business": ["Briefcase", "TrendingUp", "BarChart", "Target", "DollarSign", "Award", "Users", "CreditCard", "PieChart", "ShoppingBag", "ShoppingCart"],
    "Infrastructure": ["Cloud", "Cpu", "HardDrive", "Shield", "LockKeyhole", "Wrench", "Settings", "Wifi", "Power", "Box"],
    "Web & Devices": ["Globe", "Layout", "Smartphone", "Monitor", "Chrome", "Bluetooth"],
    "Communication": ["MessageSquare", "Mail", "Phone", "Send", "Share2", "Slack", "Trello", "User", "ThumbsUp", "Heart", "Star"],
    "UI Elements": ["Home", "Search", "Menu", "List", "Grid", "Filter", "Calendar", "Clock", "MapPin", "Link", "ExternalLink", "Zap", "Check", "X", "Trash2", "Plus", "Edit", "Copy", "Download", "Upload", "Info", "AlertTriangle"],
    "Misc": ["Coffee", "Gift", "Flag", "Tag", "Bookmark", "Anchor", "Key", "Umbrella", "Sun", "Moon", "Truck", "Package", "BookOpen"]
};

// --- Auth Component ---
const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setAuthChecking(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } else {
        const localUser = sessionStorage.getItem('admin_user');
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
        setAuthChecking(false);
      }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        if (supabase) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            const storedPassword = localStorage.getItem('admin_local_password') || 'admin';
            if (password === storedPassword) {
                const fakeUser = { email: email || 'admin@local', id: 'local-admin' };
                setUser(fakeUser);
                sessionStorage.setItem('admin_user', JSON.stringify(fakeUser));
            } else {
                throw new Error('Invalid password.');
            }
        }
    } catch (err: any) {
        console.error(err);
        setError(supabase ? 'Invalid email or password.' : err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
      if (supabase) {
          await supabase.auth.signOut();
      } else {
          sessionStorage.removeItem('admin_user');
          setUser(null);
      }
  };

  if (authChecking) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
              <Loader2 className="animate-spin" size={40} />
          </div>
      );
  }

  if (!user) {
    const env = (import.meta as any).env || {};
    const hasUrl = !!env.VITE_SUPABASE_URL;
    const hasKey = !!env.VITE_SUPABASE_ANON_KEY;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans relative overflow-hidden py-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

        <div className="w-full max-w-md p-6 relative z-10">
            <form onSubmit={handleLogin} className="p-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
              <div className="text-center mb-8">
                 <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/20 transform rotate-3">IG</div>
                 <h2 className="text-2xl font-bold text-white">Immanuel</h2>
                 <p className="text-slate-400 text-sm mt-2">
                    {supabase ? 'Sign in via Supabase Auth' : 'Welcome Immanuel'}
                 </p>
              </div>
              
              <div className="space-y-4 mb-8">
                  <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600"
                        autoFocus
                      />
                  </div>
                  <div className="relative group">
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-3.5 pl-11 pr-12 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 ${!showPassword ? 'text-primary font-bold tracking-widest' : 'text-white font-normal tracking-normal'}`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
              </div>

              {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}

              <div className="space-y-3">
                  <Button className="w-full py-3.5 text-base font-semibold shadow-lg shadow-primary/20" disabled={loading}>
                     {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20} /> Authenticating...</span> : 'Login'}
                  </Button>
                  
                  <button 
                    type="button" 
                    onClick={() => navigate('/')} 
                    className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 group rounded-xl hover:bg-slate-800"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                    Return to Website
                  </button>
              </div>
            </form>
            
            {!supabase && (
                <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-red-500/30 backdrop-blur-sm">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} /> Connection Debugger
                    </h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-slate-400">VITE_SUPABASE_URL</span>
                            <span className={`font-mono ${hasUrl ? "text-green-500" : "text-red-500 font-bold"}`}>
                                {hasUrl ? "Found" : "Missing"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-slate-400">VITE_SUPABASE_ANON_KEY</span>
                            <span className={`font-mono ${hasKey ? "text-green-500" : "text-red-500 font-bold"}`}>
                                {hasKey ? "Found" : "Missing"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  }

  return <AdminLayout onLogout={handleLogout} />;
};

const SaveAction = ({ onSave, label = "Save Changes", className = "" }: { onSave: () => void, label?: string, className?: string }) => {
   const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

   const handleClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      setStatus('saving');
      await onSave(); 
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
   };

   return (
      <Button 
        type="button" 
        onClick={handleClick} 
        disabled={status !== 'idle'}
        className={`transition-all duration-300 min-w-[140px] shadow-lg ${
            status === 'saved' 
            ? 'bg-green-600 hover:bg-green-700 border-transparent text-white ring-0' 
            : status === 'saving'
            ? 'bg-slate-700 border-transparent text-slate-300 cursor-not-allowed'
            : 'shadow-primary/20'
        } ${className}`}
      >
         {status === 'saving' && <span className="flex items-center"><Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...</span>}
         {status === 'saved' && <span className="flex items-center"><Check size={18} className="mr-2" /> Saved!</span>}
         {status === 'idle' && <span className="flex items-center"><Save size={18} className="mr-2" /> {label}</span>}
      </Button>
   );
};

type Tab = 'dashboard' | 'hero' | 'about' | 'skills' | 'services' | 'projects' | 'messages' | 'settings';

const AdminLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data, updateSettings, connectionStatus, uploadFile } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleViewLive = () => {
      const baseUrl = window.location.href.split('#')[0];
      window.open(`${baseUrl}#/`, '_blank');
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
       alert('Please select an image file.');
       return;
    }

    setIsUploading(true);
    try {
        const imageUrl = await uploadFile(file);
        updateSettings({ ...data.settings, adminProfileImage: imageUrl });
    } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to update profile image.");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: MessageSquare },
    { id: 'about', label: 'About Me', icon: User },
    { id: 'skills', label: 'Skills & Tech Stack', icon: Cpu },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminImage = data.settings.adminProfileImage || "https://via.placeholder.com/150";
  const unreadMessages = data.messages.filter(m => !m.read);
  const unreadCount = unreadMessages.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-100 flex font-sans text-slate-800">
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-[#1e293b] text-white transition-transform duration-300 z-50 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex flex-col items-center border-b border-slate-700/50 bg-[#16202e]">
          <div className="relative group cursor-pointer">
             <input type="file" ref={fileInputRef} onChange={handleProfileImageUpload} accept="image/*" className="hidden" />
             <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary mb-4 relative overflow-hidden">
                <img src={adminImage} alt="Admin" className="w-full h-full rounded-full object-cover border-4 border-[#1e293b]" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
             </div>
          </div>
          <h3 className="font-bold text-lg">Immanuel Gondwe</h3>
          <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium">
             <div className={`w-2 h-2 rounded-full ${connectionStatus === 'supabase' ? 'bg-green-500' : connectionStatus === 'custom-server' ? 'bg-blue-500' : connectionStatus === 'local' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
             <span className="uppercase tracking-wide text-[10px] text-slate-300">
                {connectionStatus === 'supabase' ? 'Supabase' : connectionStatus === 'custom-server' ? 'Custom API' : connectionStatus === 'local' ? 'Local Storage' : 'Offline'}
             </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
           <div className="mb-6 px-2 flex flex-col gap-2">
                <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-3 rounded-xl text-sm font-medium transition-all">
                    <ArrowLeft size={16} /> Back to Website
                </button>
                <button onClick={handleViewLive} className="w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 p-3 rounded-xl text-sm font-bold transition-all group">
                    View Live Website <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
           </div>
           
           <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">Menu</div>
           {menuItems.map(item => (
             <button key={item.id} onClick={() => { setActiveTab(item.id as Tab); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-slate-700/50 text-white border-l-4 border-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <item.icon size={20} className={activeTab === item.id ? 'text-primary' : 'opacity-70'} />
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
              <LogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[280px] flex flex-col h-screen">
         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"><Menu /></button>
               <div className="hidden md:flex items-center text-slate-400 text-sm">
                  <Home size={16} className="mr-2" /> / <span className="capitalize ml-2 text-slate-600 font-semibold">{activeTab.replace('-', ' ')}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                     <Bell size={20} className={`text-slate-500 ${showNotifications ? 'text-primary' : ''}`} />
                     {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                            {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {unreadCount === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    <Bell className="mx-auto mb-2 opacity-50" size={24} /> No new notifications
                                </div>
                            ) : (
                                unreadMessages.slice(0, 5).map(m => (
                                    <div key={m.id} onClick={() => { setActiveTab('messages'); setShowNotifications(false); }} className="p-4 border-b border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-xs text-slate-700">{m.name}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{m.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-2 border-t border-slate-100 bg-slate-50">
                            <button onClick={() => { setActiveTab('messages'); setShowNotifications(false); }} className="w-full py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">View All Messages</button>
                        </div>
                    </div>
                  )}
                  {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>}
               </div>
               <button onClick={() => setActiveTab('settings')}><Settings size={20} className="text-slate-500 hover:text-primary transition-colors cursor-pointer" /></button>
               <img src={adminImage} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer" />
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
            {activeTab === 'dashboard' && <DashboardHome setTab={setActiveTab} />}
            {activeTab === 'hero' && <HeroEditor />}
            {activeTab === 'projects' && <ProjectsEditor />}
            {activeTab === 'messages' && <MessagesViewer />}
            {activeTab === 'about' && <AboutEditor />}
            {activeTab === 'skills' && <SkillsEditor />}
            {activeTab === 'services' && <ServicesEditor />}
            {activeTab === 'settings' && <SettingsEditor />}
         </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

// ... (Rest of components: DashboardHome, HeroEditor, AboutEditor, IconPicker, SkillsEditor, ServicesEditor)

const DashboardHome: React.FC<{ setTab: (t: Tab) => void }> = ({ setTab }) => {
    const { data } = useStore();
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Projects</p>
                        <h3 className="text-3xl font-bold text-slate-800">{data.projects.length}</h3>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-xl"><FolderOpen size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="text-slate-500 text-sm font-medium">Unread Messages</p>
                        <h3 className="text-3xl font-bold text-slate-800">{data.messages.filter(m => !m.read).length}</h3>
                    </div>
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-xl"><MessageSquare size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="text-slate-500 text-sm font-medium">Services Active</p>
                        <h3 className="text-3xl font-bold text-slate-800">{data.services.length}</h3>
                    </div>
                    <div className="p-4 bg-green-50 text-green-500 rounded-xl"><Briefcase size={24} /></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Recent Messages</h3>
                        <button onClick={() => setTab('messages')} className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {data.messages.slice(0, 3).map((msg) => (
                            <div key={msg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                    {msg.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-slate-800">{msg.name}</h4>
                                        <span className="text-[10px] text-slate-400">{new Date(msg.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                        {data.messages.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No messages yet.</p>}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => setTab('projects')} className="p-4 rounded-xl border border-slate-200 hover:border-primary/50 hover:bg-blue-50/50 transition-all text-left group">
                             <Plus className="mb-2 text-slate-400 group-hover:text-primary" />
                             <h4 className="font-bold text-sm text-slate-700 group-hover:text-primary">Add Project</h4>
                         </button>
                         <button onClick={() => setTab('hero')} className="p-4 rounded-xl border border-slate-200 hover:border-primary/50 hover:bg-blue-50/50 transition-all text-left group">
                             <Settings className="mb-2 text-slate-400 group-hover:text-primary" />
                             <h4 className="font-bold text-sm text-slate-700 group-hover:text-primary">Update Hero</h4>
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... other components are unchanged, just re-exporting them implicitly via layout structure
// Re-inserting component definitions to ensure context validity

const HeroEditor: React.FC = () => {
    const { data, updateHero, uploadFile } = useStore();
    const [localData, setLocalData] = useState(data.hero);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalData({ ...localData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (idx: number, val: string) => {
        const newRoles = [...localData.roles];
        newRoles[idx] = val;
        setLocalData({ ...localData, roles: newRoles });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadFile(file);
            setLocalData({ ...localData, profileImage: url });
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (localData.backgroundImages.length >= 10) {
            alert("Maximum 10 background images allowed.");
            return;
        }

        setUploading(true);
        try {
            const url = await uploadFile(file);
            setLocalData({ ...localData, backgroundImages: [...localData.backgroundImages, url] });
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeBgImage = (index: number) => {
        const newImages = [...localData.backgroundImages];
        newImages.splice(index, 1);
        setLocalData({ ...localData, backgroundImages: newImages });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Edit Hero Section</h2>
                 <SaveAction onSave={() => updateHero(localData)} />
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Headline</label>
                    <input name="headline" value={localData.headline} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subheadline</label>
                    <textarea name="subheadline" value={localData.subheadline} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rotating Roles</label>
                    <div className="space-y-2">
                        {localData.roles.map((role, idx) => (
                            <input key={idx} value={role} onChange={(e) => handleRoleChange(idx, e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                        ))}
                    </div>
                 </div>
                 <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Profile Image</label>
                     <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="relative group shrink-0">
                           <img src={localData.profileImage} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-slate-100 shadow-sm" />
                        </div>
                        <div className="flex-1 w-full">
                           <input name="profileImage" value={localData.profileImage} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none mb-3 text-sm font-mono text-slate-500" placeholder="Image URL" />
                           <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                               {uploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>} 
                               <span>Upload New Photo</span>
                               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                           </label>
                        </div>
                     </div>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-100">
                     <label className="block text-sm font-bold text-slate-700 mb-4">Background Images (Max 10)</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                         {localData.backgroundImages.map((img, idx) => (
                             <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200">
                                 <img src={img} alt={`BG ${idx}`} className="w-full h-full object-cover" />
                                 <button 
                                     onClick={() => removeBgImage(idx)}
                                     className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                     title="Remove Image"
                                 >
                                     <X size={12} />
                                 </button>
                             </div>
                         ))}
                         {localData.backgroundImages.length < 10 && (
                             <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                 {uploading ? <Loader2 className="animate-spin text-primary" /> : <Plus className="text-slate-400" />}
                                 <span className="text-[10px] text-slate-500 mt-1">Add Image</span>
                                 <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} disabled={uploading} />
                             </label>
                         )}
                     </div>
                 </div>
            </div>
        </div>
    );
};

const AboutEditor: React.FC = () => {
    const { data, updateAbout, uploadFile } = useStore();
    const [localData, setLocalData] = useState(data.about);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!localData.cards) {
            setLocalData(prev => ({
                ...prev,
                cards: [
                    { title: "Development", description: "Clean code, modern patterns, and scalable architecture.", iconName: "Code2" },
                    { title: "Learning", description: "Constantly upskilling in System Design and Cloud Tech.", iconName: "BookOpen" }
                ]
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name.startsWith('stats.')) {
            const statKey = e.target.name.split('.')[1];
            setLocalData({ ...localData, stats: { ...localData.stats, [statKey]: e.target.value } });
        } else {
            setLocalData({ ...localData, [e.target.name]: e.target.value });
        }
    };

    const handleCardChange = (idx: number, field: string, val: string) => {
        const newCards = [...(localData.cards || [])];
        if (newCards[idx]) {
            (newCards[idx] as any)[field] = val;
            setLocalData({ ...localData, cards: newCards });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadFile(file);
            setLocalData({ ...localData, imageUrl: url });
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Edit About Section</h2>
                 <SaveAction onSave={() => updateAbout(localData)} />
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                    <input name="title" value={localData.title} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bio Paragraph 1</label>
                    <textarea name="bio1" value={localData.bio1} onChange={handleChange} rows={4} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bio Paragraph 2</label>
                    <textarea name="bio2" value={localData.bio2} onChange={handleChange} rows={4} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layout size={18} /> Info Cards</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {localData.cards?.map((card, idx) => (
                            <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Card {idx + 1}</span>
                                    <IconPicker value={card.iconName} onChange={(val) => handleCardChange(idx, 'iconName', val)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                                    <input 
                                        value={card.title}
                                        onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                                        placeholder="Card Title"
                                        className="w-full p-2.5 rounded-lg border border-slate-200 text-sm font-bold focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                    <textarea 
                                        value={card.description}
                                        onChange={(e) => handleCardChange(idx, 'description', e.target.value)}
                                        placeholder="Description"
                                        rows={3}
                                        className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-2">About Image</label>
                    <div className="flex gap-4 items-center">
                        <img src={localData.imageUrl} alt="About" className="w-20 h-20 object-cover rounded-lg border" />
                        <div className="flex-1">
                             <input type="text" name="imageUrl" value={localData.imageUrl} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-200 mb-2 text-sm" placeholder="Image URL" />
                             <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit">
                                 {uploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>} Upload New Image
                                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                             </label>
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Years Experience</label>
                        <input name="stats.experienceYears" value={localData.stats.experienceYears} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Projects Completed</label>
                        <input name="stats.projectsCompleted" value={localData.stats.projectsCompleted} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Delivery Speed</label>
                        <input name="stats.deliverySpeed" value={localData.stats.deliverySpeed} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200" />
                     </div>
                 </div>
            </div>
        </div>
    );
};

const IconPicker: React.FC<{ value: string; onChange: (val: string) => void; showLabel?: boolean }> = ({ value, onChange, showLabel = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const CurrentIcon = ICON_MAP[value] || Code;

    const renderIcons = () => {
        if (searchTerm) {
             const filtered = AVAILABLE_ICONS.filter(iconName => 
                iconName.toLowerCase().includes(searchTerm.toLowerCase())
             );
             
             if (filtered.length === 0) return <p className="text-center text-xs text-slate-400 py-4 col-span-5">No icons found</p>;

             return (
                 <div className="grid grid-cols-5 gap-2">
                    {filtered.map(iconName => {
                        const Icon = ICON_MAP[iconName];
                        return (
                            <button
                                key={iconName}
                                onClick={() => { onChange(iconName); setIsOpen(false); }}
                                className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors ${value === iconName ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                                title={iconName}
                            >
                                <Icon size={20} />
                            </button>
                        );
                    })}
                 </div>
             );
        }

        return Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
            <div key={category} className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1 z-10 border-b border-slate-100">{category}</h4>
                <div className="grid grid-cols-5 gap-2">
                    {icons.map(iconName => {
                        const Icon = ICON_MAP[iconName] || Code;
                        return (
                            <button
                                key={iconName}
                                onClick={() => { onChange(iconName); setIsOpen(false); }}
                                className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors ${value === iconName ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'text-slate-500'}`}
                                title={iconName}
                            >
                                <Icon size={20} />
                            </button>
                        );
                    })}
                </div>
            </div>
        ));
    };

    return (
        <div className="relative">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-xl bg-slate-50 text-slate-600 flex flex-col items-center justify-center border border-slate-200 hover:border-primary hover:text-primary transition-all group ${showLabel ? 'w-20 h-20 p-2' : 'w-12 h-12'}`}
                title="Change Icon"
            >
                <CurrentIcon size={showLabel ? 28 : 24} className="mb-0.5" />
                {showLabel && <span className="text-[10px] text-slate-500 group-hover:text-primary truncate max-w-full font-medium">{value}</span>}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2 flex flex-col max-h-96">
                        <div className="relative mb-3 flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search icons..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-1">
                            {renderIcons()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const SkillsEditor: React.FC = () => {
    const { data, updateSkills } = useStore();
    const [localSkills, setLocalSkills] = useState(data.skills);
    const [quickAddInputs, setQuickAddInputs] = useState<{[key: number]: string}>({});
    const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCatTitle, setNewCatTitle] = useState('');
    const [newCatIcon, setNewCatIcon] = useState('Code');
    const [newCatSkills, setNewCatSkills] = useState<string[]>([]);
    const [tempSkillInput, setTempSkillInput] = useState('');

    const handleCategoryChange = (idx: number, field: string, val: string) => {
        const newSkills = [...localSkills];
        (newSkills[idx] as any)[field] = val;
        setLocalSkills(newSkills);
    };

    const handleRemoveSkill = (catIdx: number, skillIdx: number) => {
        const newSkills = [...localSkills];
        newSkills[catIdx].skills.splice(skillIdx, 1);
        setLocalSkills(newSkills);
    };
    
    const handleQuickInputChange = (idx: number, val: string) => {
        setQuickAddInputs({ ...quickAddInputs, [idx]: val });
    };

    const handleAddSkillName = (catIdx: number) => {
        const name = quickAddInputs[catIdx];
        if (!name || !name.trim()) return;
        
        const newSkills = [...localSkills];
        newSkills[catIdx].skills.push({ name: name.trim() });
        setLocalSkills(newSkills);
        setQuickAddInputs({ ...quickAddInputs, [catIdx]: '' });
    };

    const openAddCategoryModal = () => {
        setNewCatTitle('');
        setNewCatIcon('Code');
        setNewCatSkills([]);
        setTempSkillInput('');
        setIsModalOpen(true);
    };

    const handleAddTempSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tempSkillInput.trim()) {
            e.preventDefault();
            if (!newCatSkills.includes(tempSkillInput.trim())) {
                 setNewCatSkills([...newCatSkills, tempSkillInput.trim()]);
            }
            setTempSkillInput('');
        }
    };

    const handleRemoveTempSkill = (index: number) => {
        setNewCatSkills(newCatSkills.filter((_, i) => i !== index));
    };

    const confirmAddCategory = () => {
        if (!newCatTitle.trim()) {
            alert("Please enter a category title.");
            return;
        }
        const skillsObjects = newCatSkills.map(s => ({ name: s }));
        setLocalSkills([...localSkills, { title: newCatTitle, iconName: newCatIcon, skills: skillsObjects }]);
        setIsModalOpen(false);
    };

    const confirmDeleteCategory = (catIdx: number) => {
        const newSkills = [...localSkills];
        newSkills.splice(catIdx, 1);
        setLocalSkills(newSkills);
        setDeleteConfirmIdx(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Manage Skills</h2>
                 <div className="flex gap-4">
                     <Button onClick={openAddCategoryModal} className="bg-slate-800 hover:bg-slate-700">
                         <Plus size={16} className="mr-2" /> Add Category
                     </Button>
                     <SaveAction onSave={() => updateSkills(localSkills)} />
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localSkills.map((cat, catIdx) => (
                    <div key={catIdx} className={`bg-white p-6 rounded-2xl shadow-sm border ${deleteConfirmIdx === catIdx ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-100'} relative group flex flex-col h-full`}>
                        <div className="flex items-start gap-4 mb-6 border-b border-slate-100 pb-4">
                            <IconPicker 
                                value={cat.iconName} 
                                onChange={(val) => handleCategoryChange(catIdx, 'iconName', val)} 
                                showLabel={true}
                            />
                            
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category Title</label>
                                <input 
                                    value={cat.title} 
                                    onChange={(e) => handleCategoryChange(catIdx, 'title', e.target.value)} 
                                    className="w-full font-bold text-lg text-slate-800 border-none p-0 focus:ring-0 placeholder-slate-300 bg-transparent"
                                    placeholder="e.g. Frontend"
                                />
                            </div>

                            {deleteConfirmIdx === catIdx ? (
                                <div className="flex flex-col gap-1 items-end animate-in fade-in slide-in-from-right-4 duration-200">
                                    <span className="text-[10px] font-bold text-red-500 uppercase">Delete?</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setDeleteConfirmIdx(null)} className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold">Cancel</button>
                                        <button onClick={() => confirmDeleteCategory(catIdx)} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg text-xs font-bold shadow-sm shadow-red-500/30">Confirm</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setDeleteConfirmIdx(catIdx)} className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-red-500/30" title="Delete Entire Category"><Trash2 size={20} /></button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 flex-grow content-start">
                             {cat.skills.map((skill, skillIdx) => (
                                 <div key={skillIdx} className="group/skill flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-1 py-1 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 transition-colors cursor-default">
                                     <span>{skill.name}</span>
                                     <button onClick={() => handleRemoveSkill(catIdx, skillIdx)} className="ml-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-all" title="Delete Skill"><X size={14} /></button>
                                 </div>
                             ))}
                             {cat.skills.length === 0 && <p className="text-sm text-slate-400 italic py-2">No skills added yet.</p>}
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    placeholder="Add skill..."
                                    value={quickAddInputs[catIdx] || ''}
                                    onChange={(e) => handleQuickInputChange(catIdx, e.target.value)}
                                    className="flex-1 text-sm p-2 bg-transparent border-none focus:ring-0 placeholder-slate-400"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkillName(catIdx); }}
                                />
                                <button onClick={() => handleAddSkillName(catIdx)} className="text-[10px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-200 font-bold uppercase transition-colors">Enter</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h3 className="text-xl font-bold text-slate-800">Add New Category</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Category Name</label>
                                    <input value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} placeholder="e.g. Backend Development" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" autoFocus />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Icon</label>
                                    <IconPicker value={newCatIcon} onChange={setNewCatIcon} showLabel={false} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Initial Skills</label>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex gap-2 mb-3">
                                        <input value={tempSkillInput} onChange={(e) => setTempSkillInput(e.target.value)} onKeyDown={handleAddTempSkill} placeholder="Type skill & press Enter" className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none" />
                                        <button onClick={() => { if(tempSkillInput.trim()) { setNewCatSkills([...newCatSkills, tempSkillInput.trim()]); setTempSkillInput(''); } }} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {newCatSkills.map((skill, idx) => (
                                            <div key={idx} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm animate-in zoom-in-50 duration-200">
                                                <span>{skill}</span>
                                                <button onClick={() => handleRemoveTempSkill(idx)} className="p-1 hover:text-red-500 rounded-full"><X size={14} /></button>
                                            </div>
                                        ))}
                                        {newCatSkills.length === 0 && <p className="text-xs text-slate-400 italic w-full text-center py-2">No skills added yet</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 flex-shrink-0">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={confirmAddCategory}>Create Category</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ServicesEditor: React.FC = () => {
    const { data, addService, updateService, deleteService } = useStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Service | null>(null);
    const [newFeature, setNewFeature] = useState('');

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setEditForm({ ...service });
        setNewFeature('');
    };

    const handleSave = () => {
        if (editForm) {
            updateService(editForm);
            setEditingId(null);
        }
    };

    const addFeature = () => {
        if (newFeature.trim() && editForm) {
            setEditForm({
                ...editForm,
                features: [...editForm.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const removeFeature = (idx: number) => {
        if (editForm) {
            const newFeatures = [...editForm.features];
            newFeatures.splice(idx, 1);
            setEditForm({ ...editForm, features: newFeatures });
        }
    };
    
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Services</h2>
                 <Button onClick={() => {
                     const newService = { id: 'new', title: 'New Service', description: '', iconName: 'Code', longDescription: '', features: [] };
                     setEditForm(newService);
                     setNewFeature('');
                     setEditingId('new');
                 }}><Plus size={16} className="mr-2"/> Add Service</Button>
            </div>

            {editingId && editForm ? (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-6">{editingId === 'new' ? 'Create Service' : 'Edit Service'}</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Service Icon</label>
                            <IconPicker value={editForm.iconName} onChange={(val) => setEditForm({...editForm, iconName: val})} showLabel={true} />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Service Title</label>
                                <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Title" className="w-full p-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Short Description (Card)</label>
                                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Short Description" className="w-full p-3 border rounded-lg" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description (Modal)</label>
                                <textarea value={editForm.longDescription} onChange={e => setEditForm({...editForm, longDescription: e.target.value})} placeholder="Long Description" className="w-full p-3 border rounded-lg" rows={4} />
                            </div>
                            
                            {/* Key Features Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Key Features</label>
                                <div className="space-y-2 mb-3">
                                    {editForm.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                                            <div className="p-1.5 bg-green-100 text-green-600 rounded-full shrink-0">
                                                <Check size={12} />
                                            </div>
                                            <span className="flex-1 text-sm text-slate-700 font-medium">{feature}</span>
                                            <button 
                                                onClick={() => removeFeature(idx)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                type="button"
                                                title="Remove Feature"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {editForm.features.length === 0 && (
                                        <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                            No features added yet. Add key highlights of this service.
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addFeature();
                                            }
                                        }}
                                        placeholder="Type a feature and press Enter"
                                        className="flex-1 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    />
                                    <Button 
                                        onClick={addFeature} 
                                        type="button"
                                        disabled={!newFeature.trim()}
                                        className="bg-slate-800 hover:bg-slate-700"
                                    >
                                        <Plus size={16} className="mr-2" /> Add
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button onClick={() => { if (editingId === 'new') addService(editForm); else handleSave(); setEditingId(null); }}>Save Service</Button>
                                <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.services.map(service => {
                        const Icon = ICON_MAP[service.iconName] || Code;
                        return (
                            <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group flex gap-4 items-start">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 p-1 rounded-lg">
                                    <button onClick={() => handleEdit(service)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><PenTool size={16} /></button>
                                    <button onClick={() => deleteService(service.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ProjectsEditor: React.FC = () => {
    const { data, addProject, updateProject, deleteProject, uploadFile } = useStore();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Project | null>(null);
    const [uploading, setUploading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newFeature, setNewFeature] = useState('');

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setEditForm({ ...project });
        setNewFeature('');
    };

    const handleSave = () => {
        if (editForm) {
            updateProject(editForm);
            setEditingId(null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editForm) return;
        
        if (editForm.images.length >= 50) {
            alert("Maximum 50 images allowed.");
            return;
        }

        setUploading(true);
        try {
            const url = await uploadFile(file);
            setEditForm({ ...editForm, images: [...editForm.images, url] });
        } catch (err) {
            console.error("Upload error", err);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const addManualImage = () => {
        if (newImageUrl && editForm) {
            setEditForm({ ...editForm, images: [...editForm.images, newImageUrl] });
            setNewImageUrl('');
        }
    };

    const removeImage = (idx: number) => {
        if (editForm) {
            const newImages = [...editForm.images];
            newImages.splice(idx, 1);
            setEditForm({ ...editForm, images: newImages });
        }
    };

    const addFeature = () => {
        if (newFeature.trim() && editForm) {
            setEditForm({
                ...editForm,
                features: [...editForm.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const removeFeature = (idx: number) => {
        if (editForm) {
            const newFeatures = [...editForm.features];
            newFeatures.splice(idx, 1);
            setEditForm({ ...editForm, features: newFeatures });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">Portfolio Projects</h2>
                 <Button onClick={() => {
                     const newProject: Project = { 
                         id: 0, 
                         title: 'New Project', 
                         description: '', 
                         role: 'Full Stack', 
                         images: [], 
                         techStack: [], 
                         challenges: '', 
                         longDescription: '', 
                         features: [] 
                     };
                     setEditForm(newProject);
                     setNewFeature('');
                     setEditingId(0);
                 }}><Plus size={16} className="mr-2"/> Add Project</Button>
            </div>

            {editingId !== null && editForm ? (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in zoom-in-95">
                    <h3 className="text-lg font-bold mb-6">{editingId === 0 ? 'Create Project' : 'Edit Project'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Project Title (e.g. Graphic Design Portfolio)" className="w-full p-3 border rounded-lg" />
                            <input value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} placeholder="Role / Category (e.g. Design, Research)" className="w-full p-3 border rounded-lg" />
                            <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Short Summary" className="w-full p-3 border rounded-lg" rows={3} />
                             
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Project Link (Live / General URL)</label>
                                <input value={editForm.liveLink || ''} onChange={e => setEditForm({...editForm, liveLink: e.target.value})} placeholder="https://..." className="w-full p-3 border rounded-lg" />
                             </div>
                             
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Secondary Link (Repo / Docs)</label>
                                <input value={editForm.repoLink || ''} onChange={e => setEditForm({...editForm, repoLink: e.target.value})} placeholder="https://..." className="w-full p-3 border rounded-lg" />
                             </div>
                        </div>
                        <div className="space-y-4">
                            <textarea value={editForm.longDescription} onChange={e => setEditForm({...editForm, longDescription: e.target.value})} placeholder="Detailed Description" className="w-full p-3 border rounded-lg" rows={6} />
                            
                            {/* Key Features Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Key Features</label>
                                <div className="space-y-2 mb-3">
                                    {editForm.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                                            <div className="p-1.5 bg-green-100 text-green-600 rounded-full shrink-0">
                                                <Check size={12} />
                                            </div>
                                            <span className="flex-1 text-sm text-slate-700 font-medium">{feature}</span>
                                            <button 
                                                onClick={() => removeFeature(idx)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                type="button"
                                                title="Remove Feature"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {editForm.features.length === 0 && (
                                        <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                            No features added yet. Add key highlights of this project.
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addFeature();
                                            }
                                        }}
                                        placeholder="Type a feature and press Enter (e.g. Real-time updates)"
                                        className="flex-1 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    />
                                    <Button 
                                        onClick={addFeature} 
                                        type="button"
                                        disabled={!newFeature.trim()}
                                        className="bg-slate-800 hover:bg-slate-700"
                                    >
                                        <Plus size={16} className="mr-2" /> Add
                                    </Button>
                                </div>
                            </div>

                            {/* Tech Stack - Simple Comma Separated for now */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Tech Stack / Tools (Comma Separated)</label>
                                <input 
                                    value={editForm.techStack.join(', ')} 
                                    onChange={e => setEditForm({...editForm, techStack: e.target.value.split(',').map(s => s.trim())})} 
                                    className="w-full p-3 border rounded-lg" 
                                    placeholder="React, Photoshop, Figma, ..." 
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Image Management */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ImageIcon size={18}/> Project Images (Max 50)</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {editForm.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                {uploading ? <Loader2 className="animate-spin text-primary" /> : <Plus className="text-slate-400" />}
                                <span className="text-[10px] text-slate-500 mt-1">Upload</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                value={newImageUrl} 
                                onChange={e => setNewImageUrl(e.target.value)} 
                                placeholder="Or paste image URL..." 
                                className="flex-1 p-2 border rounded-lg text-sm" 
                            />
                            <Button size="sm" onClick={addManualImage} type="button">Add URL</Button>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
                        <Button onClick={() => {
                            if (editingId === 0) addProject(editForm);
                            else handleSave();
                            setEditingId(null);
                        }}>Save Project</Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.projects.map(project => (
                        <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                            <div className="h-40 bg-slate-100 relative">
                                <img src={project.images[0] || "https://via.placeholder.com/400x300?text=No+Image"} alt={project.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => handleEdit(project)} className="p-2 bg-white rounded-full text-slate-800 hover:text-primary"><PenTool size={18} /></button>
                                    <button onClick={() => deleteProject(project.id)} className="p-2 bg-white rounded-full text-slate-800 hover:text-red-500"><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-800">{project.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{project.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MessagesViewer: React.FC = () => {
    const { data, markMessageRead, deleteMessage } = useStore();
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Contact Messages</h2>
            <div className="space-y-4">
                {data.messages.map(msg => (
                    <div key={msg.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${msg.read ? 'border-slate-100 opacity-75' : 'border-primary/30 ring-1 ring-primary/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${msg.read ? 'bg-slate-300' : 'bg-primary'}`}></div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{msg.name}</h3>
                                    <p className="text-xs text-slate-500">{msg.email}</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">{new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg">{msg.message}</p>
                        <div className="flex gap-3 justify-end">
                            {!msg.read && (
                                <button onClick={() => markMessageRead(msg.id)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                    <Check size={14} /> Mark Read
                                </button>
                            )}
                            <button onClick={() => deleteMessage(msg.id)} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsEditor: React.FC = () => {
    const { data, updateSettings, uploadFile, resetData, connectionStatus } = useStore();
    const [local, setLocal] = useState(data.settings);
    const [uploading, setUploading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [passwordMsg, setPasswordMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocal({ ...local, [e.target.name]: e.target.value });
    };

    const handleSocial = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocal({ ...local, social: { ...local.social, [e.target.name]: e.target.value } });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadFile(file);
            setLocal({ ...local, adminProfileImage: url });
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }
        setUploading(true);
        try {
            const url = await uploadFile(file);
            setLocal({ ...local, resumeUrl: url });
            alert("Resume uploaded successfully!");
        } catch (e) {
            console.error(e);
            alert("Resume upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg('');
        if (!newPassword || !confirmPassword) {
            setPasswordStatus('error');
            setPasswordMsg('Please fill in new password fields.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordStatus('error');
            setPasswordMsg('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordStatus('error');
            setPasswordMsg('New passwords do not match.');
            return;
        }
        setPasswordStatus('saving');
        try {
            if (supabase) {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
            } else {
                const stored = localStorage.getItem('admin_local_password') || 'admin';
                if (currentPassword !== stored) {
                    throw new Error('Incorrect current password.');
                }
                localStorage.setItem('admin_local_password', newPassword);
            }
            setPasswordStatus('success');
            setPasswordMsg('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error(err);
            setPasswordStatus('error');
            setPasswordMsg(err.message || 'Failed to update password.');
        } finally {
            if (passwordStatus !== 'error') {
                setTimeout(() => setPasswordStatus('idle'), 3000);
            }
        }
    };

    const handleReset = () => {
        const confirmReset = window.confirm("ARE YOU SURE? This will wipe all your custom data and restore the default template. This action cannot be undone.");
        if (confirmReset) {
            const doubleCheck = window.confirm("Really? All projects, messages, and text changes will be lost.");
            if (doubleCheck) {
                resetData();
                alert("Website has been reset to defaults.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800">General Settings</h2>
                 <SaveAction onSave={() => updateSettings(local)} />
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Admin Avatar</label>
                     <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="relative group shrink-0">
                           <img src={local.adminProfileImage} alt="Admin" className="w-24 h-24 object-cover rounded-full border-2 border-slate-100 shadow-sm" />
                        </div>
                        <div className="flex-1 w-full">
                           <input name="adminProfileImage" value={local.adminProfileImage} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none mb-3 text-sm font-mono text-slate-500" placeholder="Image URL" />
                           <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                               {uploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>} 
                               <span>Upload New Avatar</span>
                               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                           </label>
                        </div>
                     </div>
                 </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                    <input name="email" value={local.email} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input name="location" value={local.location} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>

                 <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileTextIcon size={18}/> Resume / CV</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {local.resumeUrl ? (
                                <a href={local.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-bold flex items-center gap-2">
                                    <FileTextIcon size={16} /> View Current Resume
                                </a>
                            ) : (
                                <span className="text-slate-400 text-sm italic">No resume uploaded.</span>
                            )}
                        </div>
                        <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-fit">
                             {uploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>} 
                             <span>Upload PDF Resume (Max 100MB)</span>
                             <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                        </label>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="github" value={local.social.github} onChange={handleSocial} placeholder="GitHub URL" className="w-full p-3 border rounded-lg" />
                        <input name="linkedin" value={local.social.linkedin} onChange={handleSocial} placeholder="LinkedIn URL" className="w-full p-3 border rounded-lg" />
                        <input name="youtube" value={local.social.youtube} onChange={handleSocial} placeholder="YouTube URL" className="w-full p-3 border rounded-lg" />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <LockKeyhole size={18} /> Security
                    </h3>
                    <form onSubmit={handlePasswordChange} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        {connectionStatus === 'local' && (
                             <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" placeholder="••••••••" />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${passwordStatus === 'error' ? 'text-red-500' : 'text-green-500'}`}>{passwordMsg}</span>
                            <Button type="submit" disabled={passwordStatus === 'saving' || !newPassword} className="bg-slate-800 hover:bg-slate-700">
                                {passwordStatus === 'saving' ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                 </div>

                 <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="text-red-600 font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                        <AlertOctagon size={16} /> Danger Zone
                    </h3>
                    <div className="border border-red-200 bg-red-50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-red-900">Reset Website Data</h4>
                            <p className="text-red-700 text-sm mt-1 max-w-md">This will permanently delete all projects, services, custom text, and messages, restoring the site to its initial installation state.</p>
                        </div>
                        <Button type="button" onClick={handleReset} className="bg-white hover:bg-red-100 text-red-600 border border-red-200 shadow-sm whitespace-nowrap">Reset to Defaults</Button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default Admin;