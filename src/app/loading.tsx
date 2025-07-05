import React from 'react';

export default function Loading() {
  return React.createElement('div', {
    className: "flex justify-center items-center min-h-screen"
  }, [
    React.createElement('div', {
      key: 'spinner',
      className: "animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"
    })
  ]);
} 