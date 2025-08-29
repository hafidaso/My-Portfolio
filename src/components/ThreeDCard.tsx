'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const ThreeDCard: React.FC<ThreeDCardProps> = ({ 
  children, 
  className = '', 
  intensity = 0.1 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -intensity;
      const rotateY = (mouseX / (rect.width / 2)) * intensity;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setRotation({ x: 0, y: 0 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, intensity]);

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-xl"
          animate={{
            opacity: isHovered ? 0.8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Main content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeDCard; 