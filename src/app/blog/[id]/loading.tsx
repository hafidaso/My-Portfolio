import React from 'react';

export default function BlogPostLoading() {
  return React.createElement('div', {
    className: "max-w-7xl mx-auto px-4 py-12"
  }, [
    React.createElement('div', {
      key: 'back',
      className: "inline-flex items-center text-orange-600 mb-6"
    }, [
      React.createElement('div', {
        key: 'arrow',
        className: "w-5 h-5 border-r-2 border-b-2 border-orange-600 transform rotate-135 mr-2"
      }),
      React.createElement('span', {
        key: 'text',
        className: "text-lg"
      }, "Back to blog")
    ]),
    React.createElement('div', {
      key: 'content',
      className: "grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8"
    }, [
      React.createElement('div', {
        key: 'main',
        className: "max-w-3xl mx-auto lg:mx-0 w-full"
      }, [
        React.createElement('div', {
          key: 'title',
          className: "h-12 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"
        }),
        React.createElement('div', {
          key: 'meta',
          className: "flex flex-wrap items-center text-sm mb-8 space-x-4"
        }, [
          React.createElement('div', {
            key: 'date',
            className: "h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"
          }),
          React.createElement('div', {
            key: 'time',
            className: "h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"
          }),
          React.createElement('div', {
            key: 'category',
            className: "h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"
          }),
          React.createElement('div', {
            key: 'author',
            className: "h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"
          })
        ]),
        React.createElement('div', {
          key: 'image',
          className: "h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 animate-pulse"
        }),
        React.createElement('div', {
          key: 'content'
        }, Array.from({ length: 8 }, (_, i) => 
          React.createElement('div', {
            key: i,
            className: `h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse ${i === 2 ? 'w-3/4' : i === 6 ? 'w-2/3' : 'w-full'}`
          })
        ))
      ]),
      React.createElement('aside', {
        key: 'sidebar',
        className: "hidden lg:block"
      }, React.createElement('div', {
        className: "sticky top-24 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm h-64 animate-pulse"
      }))
    ])
  ]);
} 