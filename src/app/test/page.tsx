import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Mobile Navbar Test Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-medium">1. Check Console Logs</h3>
              <p>Open browser dev tools (F12) and check the Console tab for any errors.</p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Test Mobile Navigation</h3>
              <p>On mobile devices, try tapping the hamburger menu button in the top-right corner.</p>
            </div>
            

          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Expected Behavior</h3>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              <li>• Mobile menu button should be visible on screens ≤768px</li>
              <li>• Tapping the button should open the menu</li>
              <li>• Menu should slide in from the right</li>
              <li>• Navigation links should be clickable</li>
              <li>• Backdrop should close the menu when tapped</li>
              <li>• Body scroll should be prevented when menu is open</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Common Issues</h3>
            <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
              <li>• Button not responding to taps</li>
              <li>• Menu appearing behind other elements</li>
              <li>• JavaScript errors in console</li>
              <li>• Inconsistent behavior across pages</li>
              <li>• Touch events not working properly</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p><strong>Current Path:</strong> /test</p>
            <p><strong>Viewport Width:</strong> <span id="viewport-width">Loading...</span></p>
            <p><strong>Touch Support:</strong> <span id="touch-support">Loading...</span></p>
            <p><strong>User Agent:</strong> <span id="user-agent">Loading...</span></p>
          </div>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('viewport-width').textContent = window.innerWidth + 'px';
            document.getElementById('touch-support').textContent = ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Yes' : 'No';
            document.getElementById('user-agent').textContent = navigator.userAgent;
          });
        `
      }} />
    </div>
  );
}
