import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return React.createElement('div', {
    className: "flex flex-col items-center justify-center min-h-screen p-4"
  }, [
    React.createElement('h2', {
      key: 'title',
      className: "text-4xl font-bold text-gray-900 dark:text-white mb-4"
    }, "404 - Page Not Found"),
    React.createElement('p', {
      key: 'message',
      className: "text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md"
    }, "The page you're looking for doesn't exist. It might have been moved or deleted."),
    React.createElement(Link, {
      key: 'link',
      href: "/",
      className: "px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
    }, "Go back home")
  ]);
} 