import React, { useEffect } from 'react';

const Security: React.FC = () => {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Common DevTools Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+Shift+C (Element Picker)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Obfuscation / Debugger Loop
    // This makes it annoying to use DevTools by constantly hitting a breakpoint
    // or detecting timing differences.
    const aggressiveSecurity = () => {
      // Infinite debugger loop to freeze inspection
      (function() {
        try {
          setInterval(() => {
             // Function constructor to avoid static analysis
             (function(){})["constructor"]("debugger")();
          }, 1000);
        } catch(e) {}
      })();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Enable the aggressive debugger loop.
    aggressiveSecurity();

    // Console clearing to hide logs
    const clearConsole = setInterval(() => {
      console.clear();
      console.log("%cSecurity Enabled", "color: red; font-size: 20px; font-weight: bold;");
      console.log("Access to source code is restricted.");
    }, 2000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(clearConsole);
    };
  }, []);

  return null;
};

export default Security;