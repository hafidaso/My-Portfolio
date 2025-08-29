'use client';

import React, { useEffect, useState } from 'react';

interface ServiceWorkerRegistrationProps {
  onUpdateAvailable?: () => void;
  onUpdateInstalled?: () => void;
  className?: string;
}

const ServiceWorkerRegistration: React.FC<ServiceWorkerRegistrationProps> = ({
  onUpdateAvailable,
  onUpdateInstalled,
  className = '',
}) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateInstalled, setIsUpdateInstalled] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox === undefined
    ) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistration(reg);
          console.log('Service Worker registered successfully');

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                  onUpdateAvailable?.();
                }
              });
            }
          });

          // Handle controller change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            setIsUpdateInstalled(true);
            onUpdateInstalled?.();
            
            // Reload page to use new service worker
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle offline/online events
      const handleOnline = () => {
        console.log('Application is online');
        document.body.classList.remove('offline');
      };

      const handleOffline = () => {
        console.log('Application is offline');
        document.body.classList.add('offline');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check initial online status
      if (!navigator.onLine) {
        document.body.classList.add('offline');
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [onUpdateAvailable, onUpdateInstalled]);

  // Handle update installation
  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Don't render anything if no update is available
  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Update Available</h3>
          <p className="text-sm text-blue-100 mt-1">
            A new version of the portfolio is ready to install.
          </p>
        </div>
        <button
          onClick={handleUpdate}
          className="ml-4 bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Update
        </button>
      </div>
      
      {isUpdateInstalled && (
        <div className="mt-2 text-xs text-blue-200">
          Update installed! Page will reload automatically...
        </div>
      )}
    </div>
  );
};

export default ServiceWorkerRegistration;
