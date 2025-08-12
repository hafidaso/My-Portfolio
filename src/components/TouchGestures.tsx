'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  className?: string;
  threshold?: number;
  velocity?: number;
}

const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  className = '',
  threshold = 50,
  velocity = 500
}) => {
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastTapTimeRef = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;
    
    if (timeSinceLastTap < 300) {
      // Double tap detected
      setTapCount(0);
      onDoubleTap?.();
    } else {
      // Single tap
      setTapCount(prev => prev + 1);
      tapTimeoutRef.current = setTimeout(() => {
        if (tapCount === 0) {
          onTap?.();
        }
        setTapCount(0);
      }, 300);
    }
    
    lastTapTimeRef.current = now;
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity: dragVelocity } = info;
    const { x, y } = offset;
    const { x: vx, y: vy } = dragVelocity;

    // Check if swipe meets threshold and velocity requirements
    if (Math.abs(x) > threshold && Math.abs(vx) > velocity) {
      if (x > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    if (Math.abs(y) > threshold && Math.abs(vy) > velocity) {
      if (y > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={className}
      onTap={handleTap}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Hook for detecting device type
export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Hook for touch gestures
export const useTouchGestures = () => {
  const [gesture, setGesture] = useState<string>('');

  const handleSwipeLeft = () => setGesture('swipe-left');
  const handleSwipeRight = () => setGesture('swipe-right');
  const handleSwipeUp = () => setGesture('swipe-up');
  const handleSwipeDown = () => setGesture('swipe-down');
  const handleTap = () => setGesture('tap');
  const handleDoubleTap = () => setGesture('double-tap');

  useEffect(() => {
    if (gesture) {
      const timer = setTimeout(() => setGesture(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [gesture]);

  return {
    gesture,
    handlers: {
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight,
      onSwipeUp: handleSwipeUp,
      onSwipeDown: handleSwipeDown,
      onTap: handleTap,
      onDoubleTap: handleDoubleTap
    }
  };
};

export default TouchGestures; 