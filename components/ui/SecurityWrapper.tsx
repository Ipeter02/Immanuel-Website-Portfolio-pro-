import React, { useEffect } from 'react';

const SecurityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }
      // Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
      // Ctrl+U (Windows/Linux) or Cmd+Option+U (Mac) - View Source
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    // Disable drag and drop for images and links
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Disable text selection (optional, but requested to prevent scraping/copying)
    const handleSelectStart = (e: Event) => {
      // Allow selection inside input and textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Anti-DevTools Tricks
    
    // 1. Debugger trap - pauses execution if DevTools is open
    const debuggerInterval = setInterval(() => {
      const before = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger;
      const after = new Date().getTime();
      if (after - before > 100) {
        // DevTools is likely open, we could redirect or clear body
        // document.body.innerHTML = "DevTools is not allowed.";
      }
    }, 1000);

    // 2. Clear console and override it
    if (process.env.NODE_ENV === 'production') {
      console.clear();
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      
      // Print a warning
      setTimeout(() => {
        // Restore temporarily to print warning
        const originalLog = Object.getPrototypeOf(console).log;
        if (originalLog) {
          originalLog.call(console, "%cStop!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000;");
          originalLog.call(console, "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or 'hack' someone's account, it is a scam and will give them access to your account.", "font-size: 16px;");
        }
      }, 100);
    }

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      clearInterval(debuggerInterval);
    };
  }, []);

  return (
    <div className="select-none" style={{ WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none' }}>
      {children}
    </div>
  );
};

export default SecurityWrapper;
