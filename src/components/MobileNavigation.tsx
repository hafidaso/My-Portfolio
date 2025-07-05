'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, BookOpen, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TouchGestures from './TouchGestures';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ];

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.href === pathname);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [pathname]);

  const handleSwipeLeft = () => {
    if (activeIndex < navItems.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleSwipeUp = () => {
    onToggle(); // Close menu
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <TouchGestures
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSwipeUp={handleSwipeUp}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Navigation
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Swipe to navigate
                </p>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-hidden">
                <motion.div
                  className="h-full flex"
                  animate={{ x: -activeIndex * 100 + '%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  {navItems.map((item, index) => (
                    <div
                      key={item.href}
                      className="w-full flex-shrink-0 p-6"
                      style={{ width: '100%' }}
                    >
                      <Link
                        href={item.href}
                        onClick={onToggle}
                        className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                          pathname === item.href
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Pagination Dots */}
              <div className="p-6 flex justify-center space-x-2">
                {navItems.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeIndex
                        ? 'bg-orange-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    animate={{
                      scale: index === activeIndex ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Swipe left/right to navigate</p>
                  <p>Swipe up to close</p>
                </div>
              </div>
            </TouchGestures>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation; 