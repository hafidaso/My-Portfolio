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
  disabled?: boolean; // Add disabled prop to prevent interference
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
  velocity = 500,
  disabled = false
}) => {
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastTapTimeRef = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    const checkTouchDevice = () => {
      const isTouch = (typeof window !== 'undefined') && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsTouchDevice(isTouch);
      return isTouch;
    };

    checkTouchDevice();
  }, []);

  const handleTap = () => {
    if (disabled) return;
    
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
    if (disabled) return;
    
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

  // Don't apply touch gestures if disabled or not a touch device
  if (disabled || !isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      onTap={handleTap}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </motion.div>
  );
};

export default TouchGestures; 