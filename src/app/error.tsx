'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return React.createElement('div', {
    className: "flex flex-col items-center justify-center min-h-screen p-4"
  }, [
    React.createElement('h2', {
      key: 'title',
      className: "text-2xl font-bold text-gray-900 dark:text-white mb-4"
    }, "Something went wrong!"),
    React.createElement('p', {
      key: 'message',
      className: "text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md"
    }, "An error occurred while loading this page. Please try again."),
    React.createElement('button', {
      key: 'button',
      onClick: reset,
      className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
    }, "Try again")
  ]);
} 