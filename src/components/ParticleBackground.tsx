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

  // Memoize particle initialization
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 30 : 100;
    const particleCount = Math.min(baseCount, Math.floor((canvas.width * canvas.height) / 10000));
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
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

        if (mouseDistance < 150) {
          const angle = Math.atan2(mousePosition.y - particle.y, mousePosition.x - particle.x);
          const force = (150 - mouseDistance) / 150;
          particle.vx -= Math.cos(angle) * force * 0.1;
          particle.vy -= Math.sin(angle) * force * 0.1;
        }
      });

      // Update state only when mouse position changes significantly (prevents excessive re-renders)
      if (Math.abs(mousePosition.x - lastMousePosition.current.x) > 10 || 
          Math.abs(mousePosition.y - lastMousePosition.current.y) > 10) {
        setParticles(updatedParticles);
        particlesRef.current = updatedParticles;
        lastMousePosition.current = mousePosition;
      } else {
        // Update ref without triggering re-render
        particlesRef.current = updatedParticles;
      }

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
  }, [resizeCanvas, initParticles, handleMouseMove]);

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