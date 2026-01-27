import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Footer: React.FC = () => {
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  
  // Refs
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteractionStart = (type: 'click' | 'touch') => {
      if (type === 'click') {
          // Desktop: 20 clicks to reveal
          if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
          
          clickCountRef.current += 1;
          
          if (clickCountRef.current >= 20) {
              setIsAdminVisible(true);
              clickCountRef.current = 0;
          } else {
              // Reset count if clicking stops for more than 1 second
              clickTimeoutRef.current = setTimeout(() => {
                  clickCountRef.current = 0;
              }, 1000); 
          }
      } else {
          // Mobile: Hold for 20 seconds to reveal
          // Clear any existing timer first
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          
          longPressTimerRef.current = setTimeout(() => {
              setIsAdminVisible(true);
              if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          }, 20000); // 20 seconds
      }
  };

  const handleInteractionEnd = () => {
      if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
      }
  };

  return (
    <footer className="bg-cream dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-4 transition-colors duration-300 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center gap-1">
        
        {/* Combined Logo and Copyright Block */}
        <div 
           className="relative flex flex-col items-center gap-1 cursor-default outline-none p-1 group"
           onClick={() => handleInteractionStart('click')}
           onTouchStart={() => handleInteractionStart('touch')}
           onTouchEnd={handleInteractionEnd}
           onTouchCancel={handleInteractionEnd}
           onTouchMove={handleInteractionEnd}
           onContextMenu={(e) => e.preventDefault()}
           role="button"
           tabIndex={-1}
        >
             <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary opacity-90">
               IG.
             </span>
             
             <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                © {new Date().getFullYear()} Immanuel Gondwe. <span className="hidden sm:inline">All rights reserved.</span>
             </p>

             {/* Invisible Hit Area (Over & Below) for Trigger Logic */}
             <div className="absolute inset-0 z-10 bg-transparent"></div>
             <div className="absolute top-full left-0 w-full h-6 bg-transparent z-10"></div>
        </div>
        
        {isAdminVisible && (
            <Link 
              to="/admin" 
              className="mt-1 flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-bold text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2"
            >
              <Lock size={10} />
              <span>Admin Dashboard</span>
            </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;