'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components to avoid SSR issues
const PerformanceMonitor = dynamic(() => import("@/components/PerformanceMonitor"), {
  ssr: false,
  loading: () => null,
});

const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), {
  ssr: false,
  loading: () => null,
});

const ClientPerformanceWrapper: React.FC = () => {
  return (
    <>
      <PerformanceMonitor 
        enableReporting={process.env.NODE_ENV === 'production'}
        onMetricsUpdate={(metrics) => {
          // Store metrics for analytics
          if (typeof window !== 'undefined') {
            (window as any).performanceMetrics = metrics;
          }
        }}
      />
      <ServiceWorkerRegistration 
        onUpdateAvailable={() => {
          console.log('Service Worker update available');
        }}
        onUpdateInstalled={() => {
          console.log('Service Worker update installed');
        }}
      />
    </>
  );
};

export default ClientPerformanceWrapper;
