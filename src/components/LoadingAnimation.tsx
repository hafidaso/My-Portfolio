'use client';

import { motion } from 'framer-motion';

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

  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const SpinnerLoader = () => (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-2 border-t-orange-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  const PulseLoader = () => (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const WaveLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1 ${colorClasses[color]} rounded-full`}
          style={{ height: size === 'sm' ? '12px' : size === 'md' ? '20px' : '32px' }}
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
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

  return <LoaderComponent />;
};

export default LoadingAnimation; 