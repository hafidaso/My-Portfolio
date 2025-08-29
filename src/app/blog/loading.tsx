import React from 'react';

export default function BlogLoading() {
  return React.createElement('div', {
    className: "max-w-6xl mx-auto px-4 py-16"
  }, [
    React.createElement('h1', {
      key: 'title',
      className: "text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white"
    }, "Insights & Thoughts"),
    React.createElement('div', {
      key: 'grid',
      className: "grid grid-cols-1 md:grid-cols-2 gap-8"
    }, Array.from({ length: 6 }, (_, i) => 
      React.createElement('div', {
        key: i,
        className: "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md h-full flex flex-col animate-pulse"
      }, [
        React.createElement('div', {
          key: 'image',
          className: "h-48 w-full bg-gray-200 dark:bg-gray-700"
        }),
        React.createElement('div', {
          key: 'content',
          className: "p-6 flex flex-col flex-grow"
        }, [
          React.createElement('div', {
            key: 'title',
            className: "h-6 w-3/4 bg-gray-200 dark:bg-gray-700 mb-2 rounded"
          }),
          React.createElement('div', {
            key: 'desc1',
            className: "h-4 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"
          }),
          React.createElement('div', {
            key: 'desc2',
            className: "h-4 w-2/3 bg-gray-200 dark:bg-gray-700 mb-4 rounded"
          }),
          React.createElement('div', {
            key: 'meta',
            className: "flex items-center text-sm mt-auto space-x-4"
          }, [
            React.createElement('div', {
              key: 'date',
              className: "h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"
            }),
            React.createElement('div', {
              key: 'time',
              className: "h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"
            }),
            React.createElement('div', {
              key: 'category',
              className: "h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"
            })
          ])
        ])
      ])
    ))
  ]);
} 