import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Briefcase, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Home, 
  Menu, 
  X,
  Cpu,
  Save,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Reply,
  PenTool,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Github,
  Linkedin,
  Youtube,
  Twitter,
  Mail,
  AlertTriangle,
  RefreshCcw,
  ExternalLink,
  Loader2,
  ArrowLeft,
  FileText,
  LockKeyhole
} from 'lucide-react';
import { 
  Code, Terminal, Database, Server, Globe, Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
  Layout, Palette, Layers,
  TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
  Zap, Activity, Wrench, Search, Shield, Lock, Calendar, Clock, MapPin,
  Camera, Video, Music, Speaker, Monitor, Hash, Tag, Flag, Bookmark
} from 'lucide-react';
import Button from '../ui/Button';
import { Project } from '../../types';

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
        // Supabase Auth Mode
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setAuthChecking(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } else {
        // Local/Demo Mode
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
            // Local fallback login
            // Check localStorage for a custom password, default to 'admin'
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
    // Check Env Vars for diagnostics - Access directly for accuracy
    const env = (import.meta as any).env || {};
    const hasUrl = !!env.VITE_SUPABASE_URL;
    const hasKey = !!env.VITE_SUPABASE_ANON_KEY;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans relative overflow-hidden py-10">
        {/* Background blobs for aesthetics */}
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
            
            {/* Connection Diagnostics for Debugging */}
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
                        <div className="pt-2">
                           <p className="text-slate-400 leading-relaxed mb-2">
                               If you recently added these to Vercel, you <strong>MUST Redeploy</strong> the project for changes to take effect.
                           </p>
                           <p className="text-slate-500 leading-relaxed">
                               Variables must start with <code>VITE_</code>.
                           </p>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-center text-slate-600 text-xs mt-8">
                Portfolio Cloud Admin • {new Date().getFullYear()}
            </p>
        </div>
      </div>
    );
  }

  return <AdminLayout onLogout={handleLogout} />;
};

// ... (Rest of the file remains exactly the same)
// --- Reusable Save Button ---
const SaveAction = ({ onSave, label = "Save Changes", className = "" }: { onSave: () => void, label?: string, className?: string }) => {
   const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

   const handleClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      setStatus('saving');
      // The store saveData is async
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

// --- Main Layout ---
type Tab = 'dashboard' | 'hero' | 'about' | 'skills' | 'services' | 'projects' | 'messages' | 'settings';

const AdminLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data, updateSettings } = useStore();
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
        let imageUrl = '';
        if (supabase) {
           const fileName = `profile_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
           const { data: uploadData, error: uploadError } = await supabase.storage
               .from('portfolio-assets')
               .upload(`images/${fileName}`, file);

           if (uploadError) throw uploadError;

           const { data: { publicUrl } } = supabase.storage
               .from('portfolio-assets')
               .getPublicUrl(`images/${fileName}`);
           
           imageUrl = publicUrl;
        } else {
           const reader = new FileReader();
           imageUrl = await new Promise((resolve) => {
               reader.onloadend = () => resolve(reader.result as string);
               reader.readAsDataURL(file);
           });
        }
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

  // Notification Logic
  const unreadMessages = data.messages.filter(m => !m.read);
  const unreadCount = unreadMessages.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-100 flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-[#1e293b] text-white transition-transform duration-300 z-50 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Profile Header */}
        <div className="p-8 flex flex-col items-center border-b border-slate-700/50 bg-[#16202e]">
          <div className="relative group cursor-pointer">
             <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleProfileImageUpload}
                accept="image/*"
                className="hidden"
             />
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary mb-4 relative overflow-hidden"
             >
                <img src={adminImage} alt="Admin" className="w-full h-full rounded-full object-cover border-4 border-[#1e293b]" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
             </div>
          </div>
          <h3 className="font-bold text-lg">Immanuel Gondwe</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
             {supabase ? 'Supabase Connected' : 'Admin Mode'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
           <div className="mb-6 px-2 flex flex-col gap-2">
                <button 
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-3 rounded-xl text-sm font-medium transition-all"
                >
                    <ArrowLeft size={16} /> Back to Website
                </button>
                <button 
                    onClick={handleViewLive}
                    className="w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 p-3 rounded-xl text-sm font-bold transition-all group"
                >
                    View Live Website <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
           </div>
           
           <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">Menu</div>
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveTab(item.id as Tab); setSidebarOpen(false); }}
               className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                 activeTab === item.id 
                 ? 'bg-slate-700/50 text-white border-l-4 border-primary' 
                 : 'text-slate-400 hover:bg-slate-800 hover:text-white'
               }`}
             >
               <item.icon size={20} className={activeTab === item.id ? 'text-primary' : 'opacity-70'} />
               {item.label}
             </button>
           ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
              <LogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[280px] flex flex-col h-screen">
         {/* Top Header */}
         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"><Menu /></button>
               <div className="hidden md:flex items-center text-slate-400 text-sm">
                  <Home size={16} className="mr-2" /> / <span className="capitalize ml-2 text-slate-600 font-semibold">{activeTab.replace('-', ' ')}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               {/* Notification Bell */}
               <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                  >
                     <Bell size={20} className={`text-slate-500 ${showNotifications ? 'text-primary' : ''}`} />
                     {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                     )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                            {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {unreadCount === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    <Bell className="mx-auto mb-2 opacity-50" size={24} />
                                    No new notifications
                                </div>
                            ) : (
                                unreadMessages.slice(0, 5).map(m => (
                                    <div 
                                        key={m.id} 
                                        onClick={() => { setActiveTab('messages'); setShowNotifications(false); }}
                                        className="p-4 border-b border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
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
                            <button 
                                onClick={() => { setActiveTab('messages'); setShowNotifications(false); }}
                                className="w-full py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                View All Messages
                            </button>
                        </div>
                    </div>
                  )}
                  {/* Backdrop to close notifications */}
                  {showNotifications && (
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  )}
               </div>

               <button onClick={() => setActiveTab('settings')}>
                 <Settings size={20} className="text-slate-500 hover:text-primary transition-colors cursor-pointer" />
               </button>
               <img src={adminImage} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer" />
            </div>
         </header>

         {/* Content Area */}
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

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

// --- Dashboard Home View ---
const DashboardHome: React.FC<{ setTab: (t: Tab) => void }> = ({ setTab }) => {
  const { data } = useStore();
  
  const heroBg = data.hero.backgroundImages && data.hero.backgroundImages.length > 0 
    ? data.hero.backgroundImages[0] 
    : "https://via.placeholder.com/800x400";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FolderOpen} label="Total Projects" value={data.projects.length.toString()} />
        <StatCard icon={Briefcase} label="Active Services" value={data.services.length.toString()} />
        <StatCard icon={MessageSquare} label="New Messages" value={data.messages.filter(m => !m.read).length.toString()} />
        <StatCard icon={File} label="Resume Updated" value={data.settings.resumeUrl ? "Yes" : "No"} />
      </div>

      <div className="mb-2">
         <h2 className="text-2xl font-bold text-slate-800">Cloud Dashboard</h2>
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Hero Widget */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg">Hero Section</h3>
                  <p className="text-sm text-slate-500">Edit your homepage intro.</p>
               </div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg p-4 relative overflow-hidden mb-4 group">
               <img src={heroBg} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero BG" />
               <div className="relative z-10 text-white">
                  <p className="font-bold text-lg uppercase tracking-wider">{data.hero.headline.split(' ')[0]}...</p>
               </div>
            </div>
            <Button size="sm" onClick={() => setTab('hero')} className="w-full">Edit <PenTool size={14} className="ml-2" /></Button>
         </div>

         {/* About Widget */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg">About Me</h3>
                  <p className="text-sm text-slate-500">Update your bio & info.</p>
               </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-lg p-4 mb-4 flex items-center gap-4">
               <img src={data.about.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="About" />
               <p className="text-xs text-slate-500 line-clamp-3">{data.about.bio1}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setTab('about')} className="w-full">Edit <PenTool size={14} className="ml-2" /></Button>
         </div>

         {/* Tech Stack Widget */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg">Tech Stack</h3>
                  <p className="text-sm text-slate-500">Manage your skills & tools.</p>
               </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-lg p-4 mb-4 flex flex-wrap gap-2 items-center justify-center">
               <Cpu className="text-primary" />
               <span className="text-slate-400">...</span>
            </div>
            <Button size="sm" onClick={() => setTab('skills')} className="w-full">Manage <PenTool size={14} className="ml-2" /></Button>
         </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Projects */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-1">Recent Projects</h3>
            <p className="text-sm text-slate-500 mb-4">Manage your portfolio items.</p>
            <div className="space-y-3">
               {data.projects.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden">
                           <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                           <p className="font-semibold text-sm">{p.title}</p>
                           <p className="text-xs text-slate-500">{p.role}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setTab('projects')} className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90">Edit</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Recent Messages */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-1">Contact Messages</h3>
            <p className="text-sm text-slate-500 mb-4">Latest inquiries.</p>
            <div className="space-y-3">
               {data.messages.length === 0 ? <p className="text-sm text-slate-400 italic">No messages yet.</p> : 
                  data.messages.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                     <div>
                        <p className="font-semibold text-sm flex items-center gap-2">
                           {m.name} 
                           {!m.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{m.message}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setTab('messages')} className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90">View</button>
                        <button className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-50">Reply</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 rounded-lg bg-slate-50 text-slate-700">
         <Icon size={24} />
      </div>
      <div>
         <p className="text-sm font-medium text-slate-500">{label}</p>
         <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
   </div>
);

// --- Editors ---

// Supabase Storage Image Upload
const ImageUpload = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
         }

         setIsProcessing(true);
         try {
             if (supabase) {
                // 1. Upload to Supabase Storage
                const fileName = `images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                const { error: uploadError } = await supabase.storage
                    .from('portfolio-assets')
                    .upload(fileName, file);
                
                if (uploadError) throw uploadError;

                // 2. Get URL
                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio-assets')
                    .getPublicUrl(fileName);
                
                onChange(publicUrl);
             } else {
                 // Fallback: Convert to Base64
                 const reader = new FileReader();
                 reader.onloadend = () => {
                     onChange(reader.result as string);
                 };
                 reader.readAsDataURL(file);
             }
         } catch (error) {
             console.error("Image upload failed:", error);
             alert("Failed to upload image. Ensure you are logged in and connected to Supabase.");
         } finally {
             setIsProcessing(false);
             if (fileInputRef.current) fileInputRef.current.value = '';
         }
      }
   };

   return (
      <div className="space-y-3">
         <label className="block text-sm font-medium text-slate-700">{label}</label>
         
         <div className="relative group border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
                    <div className="flex flex-col items-center text-primary">
                        <Loader2 className="animate-spin w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Processing...</span>
                    </div>
                </div>
            )}
            
            {value ? (
               <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-slate-200/50 flex items-center justify-center">
                    <ImageIcon className="text-slate-300 w-12 h-12" />
                  </div>
                  <img src={value} alt="Preview" className="w-full h-full object-cover relative z-10" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                     <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg"
                     >
                        Change Image
                     </button>
                     <button
                        type="button" 
                        onClick={() => onChange('')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-lg"
                     >
                        Remove
                     </button>
                  </div>
               </div>
            ) : (
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex flex-col items-center justify-center cursor-pointer p-6 text-center hover:bg-slate-100 transition-colors"
               >
                  <Upload className="text-slate-400 mb-2" size={24} />
                  <p className="text-sm text-slate-500 font-medium">Click to upload image</p>
                  <p className="text-xs text-slate-400 mt-1">{supabase ? 'Supabase Storage' : 'Local Storage (Base64)'}</p>
               </div>
            )}
            
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept="image/*" 
               className="hidden" 
            />
         </div>

         <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={14} className="text-slate-400" />
             </div>
             <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder="Or paste image URL directly..." 
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-600 placeholder:text-slate-400"
             />
         </div>
      </div>
   );
};

// Supabase Storage Resume Upload
const ResumeUpload = ({ value, onChange }: { value?: string, onChange: (v: string) => void }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            alert('File must be a PDF');
            return;
         }
         setIsProcessing(true);
         try {
             if (supabase) {
                const fileName = `resumes/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                const { error: uploadError } = await supabase.storage
                    .from('portfolio-assets')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio-assets')
                    .getPublicUrl(fileName);

                onChange(publicUrl);
             } else {
                 // Fallback: Convert to Base64
                 const reader = new FileReader();
                 reader.onloadend = () => {
                     onChange(reader.result as string);
                 };
                 reader.readAsDataURL(file);
             }
         } catch (error: any) {
             console.error("PDF upload failed:", error);
             alert("Failed to upload PDF.");
         } finally {
             setIsProcessing(false);
             if (fileInputRef.current) fileInputRef.current.value = '';
         }
      }
   };

   return (
      <div className="space-y-3">
         <label className="block text-sm font-medium text-slate-700">Resume / CV (PDF)</label>
         
         <div className="relative group border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
                    <div className="flex flex-col items-center text-primary">
                        <Loader2 className="animate-spin w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Processing PDF...</span>
                    </div>
                </div>
            )}
            
            {value ? (
               <div className="relative h-32 w-full flex flex-col items-center justify-center">
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                     <FileText size={24} />
                     <span className="font-semibold text-sm">Resume Uploaded</span>
                  </div>
                  <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20 backdrop-blur-sm">
                     <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg border border-slate-200"
                     >
                        Update
                     </button>
                     <button
                        type="button" 
                        onClick={() => onChange('')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-lg"
                     >
                        Remove
                     </button>
                  </div>
               </div>
            ) : (
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex flex-col items-center justify-center cursor-pointer p-6 text-center hover:bg-slate-100 transition-colors"
               >
                  <FileText className="text-slate-400 mb-2" size={24} />
                  <p className="text-sm text-slate-500 font-medium">Click to upload PDF</p>
                  <p className="text-xs text-slate-400 mt-1">{supabase ? 'Cloud Storage' : 'Local Storage'}</p>
               </div>
            )}
            
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept="application/pdf" 
               className="hidden" 
            />
         </div>
      </div>
   );
};

const IconSelector = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
    // Map string names to actual components for rendering within the selector
    const IconMap: Record<string, any> = {
        Code, Terminal, Database, Server, Cpu, Globe, Cloud, GitBranch, Laptop, Smartphone, Braces, Command,
        Layout, PenTool, Palette, Layers, ImageIcon, Monitor, Hash, Tag, Flag, Bookmark,
        Briefcase, TrendingUp, BarChart, Users, DollarSign, ShoppingCart, Award, Star,
        Zap, Activity, Settings, Wrench, Search, Shield, Lock, FileText, Mail, Calendar, Clock, MapPin,
        Camera, Video, Music, Speaker
    };

    const categories = {
        "Development": ['Code', 'Terminal', 'Database', 'Server', 'Cpu', 'Globe', 'Cloud', 'GitBranch', 'Laptop', 'Smartphone', 'Braces', 'Command'],
        "Design": ['PenTool', 'Layout', 'Palette', 'Layers', 'ImageIcon'],
        "Business": ['Briefcase', 'TrendingUp', 'BarChart', 'Users', 'DollarSign', 'ShoppingCart', 'Award', 'Star'],
        "General": ['Zap', 'Activity', 'Settings', 'Wrench', 'Search', 'Shield', 'Lock', 'FileText', 'Mail', 'Calendar', 'Clock', 'MapPin', 'Camera', 'Video', 'Music']
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-3 text-slate-600">Select Icon</label>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar border border-slate-200 rounded-xl p-3 bg-slate-50">
                {Object.entries(categories).map(([category, icons]) => (
                    <div key={category}>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                        <div className="grid grid-cols-6 gap-2 mb-4">
                            {icons.map(iconName => {
                                const Icon = IconMap[iconName] || Code;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => onChange(iconName === 'ImageIcon' ? 'Image' : iconName)}
                                        className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-all h-16 ${
                                            value === (iconName === 'ImageIcon' ? 'Image' : iconName)
                                            ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' 
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300'
                                        }`}
                                        title={iconName}
                                    >
                                        <Icon size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HeroEditor = () => {
  const { data, updateHero } = useStore();
  const [formData, setFormData] = useState(data.hero);
  const [tempImage, setTempImage] = useState('');

  // Update form if external data changes (e.g. initial load)
  useEffect(() => {
      setFormData(data.hero);
  }, [data.hero]);

  return (
    <div className="max-w-4xl mx-auto">
       <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
         <h2 className="text-2xl font-bold mb-6">Edit Hero Section</h2>
         <form className="space-y-6">
            <InputGroup label="Headline" value={formData.headline} onChange={v => setFormData({...formData, headline: v})} />
            <div>
               <label className="block text-sm font-medium mb-2 text-slate-600">Subheadline</label>
               <textarea 
                  value={formData.subheadline}
                  onChange={e => setFormData({...formData, subheadline: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
               />
            </div>
            <InputGroup label="Roles (comma separated)" value={formData.roles.join(', ')} onChange={v => setFormData({...formData, roles: v.split(',').map(s => s.trim())})} />
            
            <div className="space-y-4">
                <label className="block text-sm font-medium mb-2 text-slate-600">Background Images (Max 20)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.backgroundImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden h-24 border border-slate-200">
                            <img src={img} className="w-full h-full object-cover" alt={`Bg ${idx}`} />
                            <button 
                                type="button" 
                                onClick={() => {
                                   const newImages = [...formData.backgroundImages];
                                   newImages.splice(idx, 1);
                                   setFormData({ ...formData, backgroundImages: newImages });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {formData.backgroundImages.length < 20 && (
                        <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 bg-slate-50">
                            <span className="text-xs">Add below</span>
                        </div>
                    )}
                </div>

                {formData.backgroundImages.length < 20 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <ImageUpload label="Add New Background Image" value={tempImage} onChange={setTempImage} />
                        <div className="mt-2 flex justify-end">
                            <Button 
                                type="button" 
                                size="sm" 
                                onClick={() => {
                                     if (!tempImage) return;
                                     if (formData.backgroundImages.length >= 20) {
                                         alert("Maximum 20 background images allowed.");
                                         return;
                                     }
                                     setFormData({ ...formData, backgroundImages: [...formData.backgroundImages, tempImage] });
                                     setTempImage('');
                                }} 
                                disabled={!tempImage}
                            >
                                <Plus size={16} className="mr-1" /> Add to List
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ImageUpload label="Profile Image" value={formData.profileImage} onChange={v => setFormData({...formData, profileImage: v})} />
            
            <div className="pt-4 flex justify-end">
               <SaveAction onSave={() => updateHero(formData)} />
            </div>
         </form>
       </div>
    </div>
  );
};

const AboutEditor = () => {
   const { data, updateAbout } = useStore();
   const [formData, setFormData] = useState(data.about);

   useEffect(() => {
       setFormData(data.about);
   }, [data.about]);
 
   return (
     <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6">Edit About Section</h2>
          <form className="space-y-6">
             <InputGroup label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
             <div>
               <label className="block text-sm font-medium mb-2 text-slate-600">Bio Paragraph 1</label>
               <textarea 
                  value={formData.bio1}
                  onChange={e => setFormData({...formData, bio1: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-2 text-slate-600">Bio Paragraph 2</label>
               <textarea 
                  value={formData.bio2}
                  onChange={e => setFormData({...formData, bio2: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
               />
             </div>
             <div className="grid md:grid-cols-3 gap-4">
               <InputGroup label="Experience (Years)" value={formData.stats.experienceYears} onChange={v => setFormData({...formData, stats: {...formData.stats, experienceYears: v}})} />
               <InputGroup label="Projects Completed" value={formData.stats.projectsCompleted} onChange={v => setFormData({...formData, stats: {...formData.stats, projectsCompleted: v}})} />
               <InputGroup label="Delivery Speed" value={formData.stats.deliverySpeed} onChange={v => setFormData({...formData, stats: {...formData.stats, deliverySpeed: v}})} />
             </div>
             <ImageUpload label="About Image" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} />
             <div className="pt-4 flex justify-end">
                <SaveAction onSave={() => updateAbout(formData)} />
             </div>
          </form>
        </div>
     </div>
   );
 };

const SkillsEditor = () => {
    const { data, updateSkills } = useStore();
    const [localSkills, setLocalSkills] = useState(data.skills);
    
    useEffect(() => {
        setLocalSkills(data.skills);
    }, [data.skills]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', iconName: 'Code', skills: [] as { name: string }[] });
    const [newSkillName, setNewSkillName] = useState('');

    // Handlers
    const handleOpenCreate = () => {
        setEditingIndex(null);
        setFormData({ title: '', iconName: 'Code', skills: [] });
        setNewSkillName('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (index: number) => {
        setEditingIndex(index);
        setFormData(JSON.parse(JSON.stringify(localSkills[index])));
        setNewSkillName('');
        setIsModalOpen(true);
    };

    const handleDeleteCategory = (index: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const updated = [...localSkills];
            updated.splice(index, 1);
            setLocalSkills(updated);
        }
    };

    const handleModalSave = () => {
        if (!formData.title.trim()) {
            alert("Category title is required");
            return;
        }

        const updated = [...localSkills];
        if (editingIndex !== null) {
            // Update existing
            // @ts-ignore
            updated[editingIndex] = formData;
        } else {
            // Create new
            // @ts-ignore
            updated.push(formData);
        }
        setLocalSkills(updated);
        setIsModalOpen(false);
    };

    const addSkillToForm = () => {
        if (!newSkillName.trim()) return;
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: newSkillName.trim() }]
        });
        setNewSkillName('');
    };

    const removeSkillFromForm = (skillIndex: number) => {
        const newSkills = [...formData.skills];
        newSkills.splice(skillIndex, 1);
        setFormData({ ...formData, skills: newSkills });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Manage Skills</h2>
                <div className="flex gap-3">
                   <Button onClick={handleOpenCreate}><Plus size={18} className="mr-2" /> Add Category</Button>
                   <SaveAction onSave={() => updateSkills(localSkills)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localSkills.map((category, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 flex items-center justify-center min-w-[40px]">
                                    <span className="text-xs font-bold">{category.iconName}</span> 
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">{category.title}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleOpenEdit(idx)} 
                                    className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"
                                    title="Edit Category"
                                >
                                    <PenTool size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteCategory(idx)} 
                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {category.skills.length > 0 ? (
                                category.skills.map((skill, sIdx) => (
                                    <span key={sIdx} className="text-xs bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                                        {skill.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 italic">No skills added</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingIndex !== null ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <InputGroup 
                                label="Category Title" 
                                value={formData.title} 
                                onChange={v => setFormData({...formData, title: v})} 
                            />
                            
                            <IconSelector 
                                value={formData.iconName} 
                                onChange={v => setFormData({...formData, iconName: v})} 
                            />
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-600">Skills</label>
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.skills.map((skill, i) => (
                                            <div key={i} className="bg-white border border-slate-200 text-slate-700 pl-3 pr-1 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                                                <span>{skill.name}</span>
                                                <button 
                                                    onClick={() => removeSkillFromForm(i)} 
                                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.skills.length === 0 && (
                                            <span className="text-slate-400 text-sm italic py-1">No skills added yet.</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={newSkillName}
                                            onChange={(e) => setNewSkillName(e.target.value)}
                                            placeholder="Type a skill (e.g. React)..." 
                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addSkillToForm();
                                                }
                                            }}
                                        />
                                        <Button size="sm" onClick={addSkillToForm} disabled={!newSkillName.trim()}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleModalSave}>
                                    {editingIndex !== null ? 'Save Changes' : 'Create Category'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ServicesEditor = () => {
    const { data, addService, updateService, deleteService } = useStore();
    const [editingService, setEditingService] = useState<any | null>(null);

    const handleSave = () => {
        if (editingService.id) {
            updateService(editingService);
        } else {
            addService(editingService);
        }
        setEditingService(null);
    };

    if (editingService) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{editingService.id ? 'Edit Service' : 'Add Service'}</h3>
                    <button onClick={() => setEditingService(null)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
                </div>
                <div className="space-y-6">
                    <InputGroup label="Title" value={editingService.title} onChange={v => setEditingService({...editingService, title: v})} />
                    <IconSelector value={editingService.iconName} onChange={v => setEditingService({...editingService, iconName: v})} />
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-600">Short Description</label>
                        <textarea 
                           value={editingService.description}
                           onChange={e => setEditingService({...editingService, description: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                           rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-600">Long Description</label>
                        <textarea 
                           value={editingService.longDescription}
                           onChange={e => setEditingService({...editingService, longDescription: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                           rows={4}
                        />
                    </div>
                    <InputGroup 
                        label="Features (comma separated)" 
                        value={editingService.features?.join(', ')} 
                        onChange={v => setEditingService({...editingService, features: v.split(',').map(s => s.trim())})} 
                    />
                    
                    <div className="flex justify-end pt-4">
                        <SaveAction onSave={handleSave} label="Save Service" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Services</h2>
                <Button onClick={() => setEditingService({ title: '', description: '', longDescription: '', iconName: 'Code', features: [] })}>
                    <Plus size={18} className="mr-2" /> Add Service
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.services.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col relative group hover:border-primary/50 transition-colors">
                         <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                <span className="font-bold text-xs">{service.iconName}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{service.title}</h4>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                            </div>
                         </div>
                         <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end gap-2">
                             <button onClick={() => setEditingService(service)} className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors">Edit</button>
                             <button onClick={() => deleteService(service.id)} className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors">Delete</button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MessagesViewer = () => {
    const { data, markMessageRead, deleteMessage } = useStore();
    
    const handleReply = (email: string, name: string) => {
        const subject = encodeURIComponent(`Re: Inquiry from ${name}`);
        const body = encodeURIComponent(`Hi ${name},\n\nThank you for reaching out.\n\nBest,\nImmanuel`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Inbox</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               {data.messages.length === 0 ? (
                   <p className="text-center text-slate-500 py-12">No messages yet.</p>
               ) : (
                   <div className="divide-y divide-slate-100">
                      {data.messages.map(m => (
                          <div key={m.id} className={`p-6 flex flex-col md:flex-row gap-4 hover:bg-slate-50 transition-colors ${!m.read ? 'bg-blue-50/50' : ''}`}>
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-sm">
                                 {m.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start mb-1">
                                      <h4 className={`font-medium ${!m.read ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{m.name} <span className="text-slate-400 font-normal text-sm ml-2">&lt;{m.email}&gt;</span></h4>
                                      <span className="text-xs text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-slate-600 text-sm leading-relaxed mb-3">{m.message}</p>
                                  <div className="flex gap-3">
                                      {!m.read && <button onClick={() => markMessageRead(m.id)} className="text-xs font-medium text-primary hover:underline">Mark as Read</button>}
                                      <button onClick={() => deleteMessage(m.id)} className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                                      <button 
                                        onClick={() => handleReply(m.email, m.name)}
                                        className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                                      >
                                        <Reply size={12} /> Reply
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                   </div>
               )}
            </div>
        </div>
    );
};

const InputGroup = ({ label, value, onChange }: { label: string, value: string | undefined, onChange: (v: string) => void }) => (
    <div className="w-full">
        <label className="block text-sm font-medium mb-2 text-slate-600">{label}</label>
        <input 
            type="text" 
            value={value || ''} 
            onChange={e => onChange(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-800"
        />
    </div>
);

const File: any = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
   </svg>
);

const ProjectsEditor = () => {
  const { data, addProject, updateProject, deleteProject } = useStore();
  const [formMode, setFormMode] = useState<'list' | 'edit' | 'create'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempImage, setTempImage] = useState('');

  const emptyProject: Omit<Project, 'id'> = {
      title: '', description: '', role: '', images: [], techStack: [],
      challenges: '', longDescription: '', features: [], liveLink: '', repoLink: ''
  };

  const [formData, setFormData] = useState(emptyProject);

  const handleEdit = (project: Project) => {
    // Ensure images and arrays are initialized
    // @ts-ignore
    setFormData({...project, images: project.images || [], techStack: project.techStack || [], features: project.features || []});
    setEditingId(project.id);
    setFormMode('edit');
    setTempImage('');
  };

  const handleCreate = () => {
    setFormData(emptyProject);
    setEditingId(null);
    setFormMode('create');
    setTempImage('');
  };

  const handleSave = () => {
    if (formMode === 'create') {
        // @ts-ignore
        addProject(formData);
    } else if (formMode === 'edit' && editingId !== null) {
        // @ts-ignore
        updateProject({ ...formData, id: editingId });
    }
    setFormMode('list');
  };

  const handleAddImage = () => {
      if (!tempImage) return;
      if (formData.images.length >= 200) {
          alert("Maximum 200 images allowed.");
          return;
      }
      setFormData({ ...formData, images: [...formData.images, tempImage] });
      setTempImage('');
  };

  const removeImage = (index: number) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
  };

  if (formMode !== 'list') {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{formMode === 'create' ? 'Add New Project' : 'Edit Project'}</h3>
                <button onClick={() => setFormMode('list')} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
            </div>
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Title" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                    <InputGroup label="Role" value={formData.role} onChange={v => setFormData({...formData, role: v})} />
                </div>
                <InputGroup label="Short Description" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-500">Long Description</label>
                  <textarea 
                     value={formData.longDescription}
                     onChange={e => setFormData({...formData, longDescription: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                     rows={4}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <InputGroup label="Live Link" value={formData.liveLink} onChange={v => setFormData({...formData, liveLink: v})} />
                    <InputGroup label="Repo Link" value={formData.repoLink} onChange={v => setFormData({...formData, repoLink: v})} />
                </div>
                <InputGroup label="Tech Stack (comma separated)" value={formData.techStack.join(', ')} onChange={v => setFormData({...formData, techStack: v.split(',').map(s => s.trim())})} />
                <InputGroup label="Features (comma separated)" value={formData.features.join(', ')} onChange={v => setFormData({...formData, features: v.split(',').map(s => s.trim())})} />
                
                <div className="space-y-4">
                    <label className="block text-sm font-medium mb-2 text-slate-600">Project Images (Max 200)</label>
                    
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden h-24 border border-slate-200">
                                    <img src={img} className="w-full h-full object-cover" alt={`Project img ${idx}`} />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {formData.images.length < 200 && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <ImageUpload label={formData.images.length === 0 ? "Main Project Image" : "Add Another Image"} value={tempImage} onChange={setTempImage} />
                            <div className="mt-2 flex justify-end">
                                <Button 
                                    type="button" 
                                    size="sm" 
                                    onClick={handleAddImage} 
                                    disabled={!tempImage}
                                >
                                    <Plus size={16} className="mr-1" /> Add Image
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
                <InputGroup label="Challenges" value={formData.challenges} onChange={v => setFormData({...formData, challenges: v})} />
                
                <div className="flex justify-end pt-4">
                    <SaveAction onSave={handleSave} label={formMode === 'create' ? 'Create Project' : 'Save Changes'} />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">Projects Library</h2>
         <Button onClick={handleCreate}><Plus size={18} className="mr-2" /> Add Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.projects.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col group hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                       <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{p.title}</h4>
                        <p className="text-sm text-primary font-medium">{p.role}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                           {p.techStack.slice(0,3).map(t => <span key={t} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600">{t}</span>)}
                        </div>
                    </div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors" title="Edit"><PenTool size={18} /></button>
                    <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

const SettingsEditor = () => {
  const { data, updateSettings, resetData } = useStore();
  const [formData, setFormData] = useState(data.settings);
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  useEffect(() => {
      setFormData(data.settings);
  }, [data.settings]);

  const handleSave = () => {
    updateSettings(formData);
  };

  const handleReset = () => {
    resetData();
  };

  const handleChangePassword = () => {
      setPassMsg({ type: '', text: '' });
      
      if (supabase) {
          setPassMsg({ type: 'error', text: 'Password change is managed by Supabase Auth directly (check email settings).' });
          return;
      }

      const storedPwd = localStorage.getItem('admin_local_password') || 'admin';
      
      if (passData.current !== storedPwd) {
          setPassMsg({ type: 'error', text: 'Current password is incorrect.' });
          return;
      }

      if (passData.new.length < 4) {
          setPassMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
          return;
      }

      if (passData.new !== passData.confirm) {
          setPassMsg({ type: 'error', text: 'New passwords do not match.' });
          return;
      }

      // Success
      localStorage.setItem('admin_local_password', passData.new);
      setPassMsg({ type: 'success', text: 'Password updated successfully!' });
      setPassData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       
       <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="text-slate-400" /> General Settings</h2>
          <form className="space-y-6">
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-2">Contact Information</h3>
              <InputGroup label="Contact Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
              <InputGroup label="Location" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
              <InputGroup label="Contact Heading" value={formData.contactHeading} onChange={v => setFormData({...formData, contactHeading: v})} />
              <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600">Contact Description</label>
                  <textarea 
                     value={formData.contactDescription}
                     onChange={e => setFormData({...formData, contactDescription: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-800"
                     rows={3}
                  />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-2">Profile Image</h3>
              <ImageUpload label="Admin Dashboard Profile Image" value={formData.adminProfileImage} onChange={v => setFormData({...formData, adminProfileImage: v})} />
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-2">Resume / CV</h3>
               <ResumeUpload value={formData.resumeUrl} onChange={v => setFormData({...formData, resumeUrl: v})} />
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-2">Social Media Links</h3>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                     <Github className="absolute left-3 top-9 text-slate-400" size={18} />
                     <InputGroup label="GitHub URL" value={formData.social.github} onChange={v => setFormData({...formData, social: {...formData.social, github: v}})} />
                  </div>
                  <div className="relative">
                     <Linkedin className="absolute left-3 top-9 text-slate-400" size={18} />
                     <InputGroup label="LinkedIn URL" value={formData.social.linkedin} onChange={v => setFormData({...formData, social: {...formData.social, linkedin: v}})} />
                  </div>
                  <div className="relative">
                     <Youtube className="absolute left-3 top-9 text-slate-400" size={18} />
                     <InputGroup label="YouTube URL" value={formData.social.youtube} onChange={v => setFormData({...formData, social: {...formData.social, youtube: v}})} />
                  </div>
               </div>
            </div>

            <div className="pt-4 flex justify-end">
               <SaveAction onSave={handleSave} label="Save Settings" />
            </div>
          </form>
       </div>

       {/* Security Section (Local Mode Only) */}
       {!supabase && (
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><LockKeyhole className="text-slate-400" /> Security</h2>
               <div className="space-y-4 max-w-md">
                   <div>
                       <label className="block text-sm font-medium mb-2 text-slate-600">Current Password</label>
                       <input 
                           type="password" 
                           value={passData.current} 
                           onChange={e => setPassData({...passData, current: e.target.value})} 
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium mb-2 text-slate-600">New Password</label>
                       <input 
                           type="password" 
                           value={passData.new} 
                           onChange={e => setPassData({...passData, new: e.target.value})} 
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium mb-2 text-slate-600">Confirm New Password</label>
                       <input 
                           type="password" 
                           value={passData.confirm} 
                           onChange={e => setPassData({...passData, confirm: e.target.value})} 
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                       />
                   </div>
                   
                   {passMsg.text && (
                       <div className={`text-sm p-3 rounded-lg ${passMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                           {passMsg.text}
                       </div>
                   )}

                   <Button onClick={handleChangePassword} className="mt-2">Change Password</Button>
               </div>
           </div>
       )}

       <div className="bg-red-50 p-8 rounded-xl border border-red-100">
          <h2 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Danger Zone</h2>
          <p className="text-red-600 mb-6 text-sm">Resetting will wipe your database and revert to the default template data.</p>
          <button 
             onClick={handleReset}
             className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm"
          >
             <RefreshCcw size={16} /> Reset All Data
          </button>
       </div>
    </div>
  );
};

export default Admin;