'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MicroInteractionsProps {
  children: ReactNode;
  type?: 'button' | 'card' | 'link' | 'input';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MicroInteractions: React.FC<MicroInteractionsProps> = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(255, 165, 0, 0.3)"
    },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.5 }
  };

  const cardVariants = {
    initial: { 
      y: 0,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      y: -8,
      boxShadow: "0 20px 25px rgba(255, 165, 0, 0.2)"
    },
    tap: { y: -4 }
  };

  const linkVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      color: "#f97316"
    },
    tap: { scale: 0.98 }
  };

  const inputVariants = {
    initial: { 
      borderColor: "#d1d5db",
      boxShadow: "0 0 0 0 rgba(255, 165, 0, 0)"
    },
    focus: { 
      borderColor: "#f97316",
      boxShadow: "0 0 0 3px rgba(255, 165, 0, 0.1)"
    }
  };

  const getVariants = () => {
    switch (type) {
      case 'button':
        return buttonVariants;
      case 'card':
        return cardVariants;
      case 'link':
        return linkVariants;
      case 'input':
        return inputVariants;
      default:
        return buttonVariants;
    }
  };

  const getBaseClasses = () => {
    switch (type) {
      case 'button':
        return 'px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 cursor-pointer';
      case 'card':
        return 'p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer';
      case 'link':
        return 'text-blue-600 hover:text-orange-500 cursor-pointer transition-colors duration-300';
      case 'input':
        return 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white';
      default:
        return '';
    }
  };

  const variants = getVariants();
  const baseClasses = getBaseClasses();

  if (type === 'input') {
    return (
      <motion.input
        className={`${baseClasses} ${className}`}
        variants={variants}
        initial="initial"
        whileFocus="focus"
        disabled={disabled}
      />
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      variants={variants}
      initial="initial"
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? "disabled" : "tap"}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

// Specialized components
export const AnimatedButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className, disabled }) => (
  <MicroInteractions
    type="button"
    onClick={onClick}
    className={className}
    disabled={disabled}
  >
    {children}
  </MicroInteractions>
);

export const AnimatedCard: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => (
  <MicroInteractions
    type="card"
    onClick={onClick}
    className={className}
  >
    {children}
  </MicroInteractions>
);

export const AnimatedLink: React.FC<{
  children: ReactNode;
  href: string;
  className?: string;
}> = ({ children, href, className }) => (
  <motion.a
    href={href}
    className={`text-blue-600 hover:text-orange-500 cursor-pointer transition-colors duration-300 ${className}`}
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.02, color: "#f97316" },
      tap: { scale: 0.98 }
    }}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
  >
    {children}
  </motion.a>
);

export default MicroInteractions; 