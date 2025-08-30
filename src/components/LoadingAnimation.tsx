'use client';

import React from 'react';

interface LoadingAnimationProps {
  type?: 'dots' | 'spinner' | 'pulse' | 'wave';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  type = 'dots', 
  size = 'md', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'bg-orange-500',
    secondary: 'bg-purple-500',
    white: 'bg-white'
  };

  // Use CSS animations for better performance
  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s',
            transform: 'translateZ(0)', // Force GPU layer
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );

  const SpinnerLoader = () => (
    <div
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-2 border-t-orange-500 rounded-full animate-spin`}
      style={{
        transform: 'translateZ(0)', // Force GPU layer
        willChange: 'transform'
      }}
    />
  );

  const PulseLoader = () => (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
      style={{
        transform: 'translateZ(0)', // Force GPU layer
        willChange: 'transform, opacity'
      }}
    />
  );

  const WaveLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            height: size === 'sm' ? '12px' : size === 'md' ? '20px' : '32px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s',
            transform: 'translateZ(0)', // Force GPU layer
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );

  const loaders = {
    dots: DotsLoader,
    spinner: SpinnerLoader,
    pulse: PulseLoader,
    wave: WaveLoader
  };

  const LoaderComponent = loaders[type];

  return (
    <div className="flex items-center justify-center" style={{ contain: 'layout style paint' }}>
      <LoaderComponent />
    </div>
  );
};

export default React.memo(LoadingAnimation);