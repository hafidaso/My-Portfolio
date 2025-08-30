'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    isMobile: false,
    touchSupported: false,
    viewportWidth: 0,
    viewportHeight: 0,
    userAgent: '',
    pathname: '',
    timestamp: '',
    errors: [] as string[]
  });

  const pathname = usePathname();

  useEffect(() => {
    // Only show debugger on mobile devices
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768;
      const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setDebugInfo({
        isMobile,
        touchSupported,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        pathname,
        timestamp: new Date().toISOString(),
        errors: debugInfo.errors
      });

      setIsVisible(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for global errors
    const handleError = (event: ErrorEvent) => {
      console.error('[MobileDebugger] Global error caught:', event.error);
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, `${event.message} at ${event.filename}:${event.lineno}`]
      }));
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('error', handleError);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 bg-black/90 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-2">Mobile Debug Info</div>
      <div className="space-y-1">
        <div>Path: {debugInfo.pathname}</div>
        <div>Width: {debugInfo.viewportWidth}px</div>
        <div>Height: {debugInfo.viewportHeight}px</div>
        <div>Touch: {debugInfo.touchSupported ? 'Yes' : 'No'}</div>
        <div>Mobile: {debugInfo.isMobile ? 'Yes' : 'No'}</div>
        {debugInfo.errors.length > 0 && (
          <div className="mt-2">
            <div className="font-bold text-red-400">Errors:</div>
            {debugInfo.errors.slice(-3).map((error, index) => (
              <div key={index} className="text-red-300 text-xs truncate">
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-white hover:text-gray-300"
      >
        ×
      </button>
    </div>
  );
}
