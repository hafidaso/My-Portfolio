'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  // Memoize resize function to prevent unnecessary re-renders
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Memoize particle initialization with seeded random for consistent hydration
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use seeded random function for consistent initial state
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 30 : 100;
    const particleCount = Math.min(baseCount, Math.floor((canvas.width * canvas.height) / 10000));
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: seededRandom(i) * canvas.width,
        y: seededRandom(i + 1000) * canvas.height,
        vx: (seededRandom(i + 2000) - 0.5) * 0.5,
        vy: (seededRandom(i + 3000) - 0.5) * 0.5,
        size: seededRandom(i + 4000) * 2 + 1,
        opacity: seededRandom(i + 5000) * 0.5 + 0.1,
      });
    }
    
    setParticles(newParticles);
    particlesRef.current = newParticles;
  }, []);

  // Memoize mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    initParticles();

    // Mouse move handler
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop - optimized to prevent unnecessary re-renders
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles without triggering re-renders
      const updatedParticles = particlesRef.current.map(particle => {
        const newParticle = { ...particle };
        
        // Update position
        newParticle.x += newParticle.vx;
        newParticle.y += newParticle.vy;

        // Bounce off edges with proper boundary checking
        if (newParticle.x <= 0 || newParticle.x >= canvas.width) {
          newParticle.vx *= -1;
          newParticle.x = Math.max(0, Math.min(canvas.width, newParticle.x));
        }
        if (newParticle.y <= 0 || newParticle.y >= canvas.height) {
          newParticle.vy *= -1;
          newParticle.y = Math.max(0, Math.min(canvas.height, newParticle.y));
        }

        return newParticle;
      });

      // Draw all particles efficiently
      updatedParticles.forEach(particle => {
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${particle.opacity})`;
        ctx.fill();

        // Draw connections (optimized to avoid duplicate connections)
        updatedParticles.forEach(otherParticle => {
          if (particle.id >= otherParticle.id) return; // Avoid duplicate connections
          
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 165, 0, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Mouse interaction with particles
      updatedParticles.forEach(particle => {
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mousePosition.x, 2) + 
          Math.pow(particle.y - mousePosition.y, 2)
        );

        if (mouseDistance < 50) {
          // Attract particles to mouse
          const attraction = 0.02;
          particle.vx += (mousePosition.x - particle.x) * attraction;
          particle.vy += (mousePosition.y - particle.y) * attraction;
          
          // Limit velocity
          particle.vx = Math.max(-2, Math.min(2, particle.vx));
          particle.vy = Math.max(-2, Math.min(2, particle.vy));
        }
      });

      // Update particles ref for next frame
      particlesRef.current = updatedParticles;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, resizeCanvas, initParticles, handleMouseMove]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 2 }}
    />
  );
};

export default ParticleBackground; 