import React, { useEffect } from 'react';

const SecurityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Disable keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') e.preventDefault();
      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) e.preventDefault();
      // Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) e.preventDefault();
      // Ctrl+Shift+C / Cmd+Option+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) e.preventDefault();
      // Ctrl+U / Cmd+Option+U - View Source
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) e.preventDefault();
      // Ctrl+S / Cmd+S - Save Page
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) e.preventDefault();
      // Ctrl+P / Cmd+P - Print Page
      if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) e.preventDefault();
    };

    // 3. Disable drag and drop
    const handleDragStart = (e: DragEvent) => e.preventDefault();

    // 4. Disable text selection (except inputs)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // --- Advanced Anti-DevTools Tricks ---
    
    // 5. Aggressive Console Clearing & Override
    const consoleInterval = setInterval(() => {
      console.clear();
    }, 50);

    const noop = () => {};
    const originalConsole = { ...console };
    
    // Override all common console methods
    ['log', 'warn', 'error', 'info', 'table', 'dir', 'debug', 'trace'].forEach(method => {
      (console as any)[method] = noop;
    });

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      clearInterval(consoleInterval);
      
      // Restore console
      Object.keys(originalConsole).forEach(key => {
        (console as any)[key] = (originalConsole as any)[key];
      });
    };
  }, []);

  return (
    <div 
      className="select-none" 
      style={{ 
        WebkitUserSelect: 'none', 
        MozUserSelect: 'none', 
        msUserSelect: 'none', 
        userSelect: 'none',
        WebkitTouchCallout: 'none' // Disable iOS callout
      }}
    >
      {children}
    </div>
  );
};

export default SecurityWrapper;
