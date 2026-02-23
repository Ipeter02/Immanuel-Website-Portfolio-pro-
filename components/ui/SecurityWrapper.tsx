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
    
    const triggerViolation = () => {
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;width:100vw;background:#0a0a0a;color:#ef4444;font-family:monospace;text-align:center;padding:20px;box-sizing:border-box;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <h1 style="font-size:32px;margin:0 0 10px 0;letter-spacing:2px;">SECURITY VIOLATION</h1>
          <p style="font-size:16px;color:#a3a3a3;max-width:400px;line-height:1.5;">Developer tools, inspection, and scraping are strictly prohibited on this website.</p>
          <p style="font-size:14px;color:#525252;margin-top:20px;">Please close DevTools and refresh the page.</p>
        </div>
      `;
    };

    // 5. Advanced Debugger Trap (Obfuscated)
    // Using a self-invoking function and Function constructor to hide the debugger keyword from simple static analysis
    const debuggerInterval = setInterval(() => {
      const start = performance.now();
      
      // Obfuscated debugger call
      (function() {
        return function() {
          // eslint-disable-next-line no-eval
          eval("debugger");
        }
      })()();
      
      const end = performance.now();
      
      // If execution took longer than 100ms, debugger paused the thread
      if (end - start > 100) {
        triggerViolation();
      }
    }, 1000); // Increased interval to reduce performance impact and false positives

    // 6. Aggressive Console Clearing & Override
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
      clearInterval(debuggerInterval);
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
