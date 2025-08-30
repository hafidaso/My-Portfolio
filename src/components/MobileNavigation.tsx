'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, BookOpen, Globe, Palette, Database, User, Github, Mail, Linkedin, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[MobileNavigation] Mounted');
  }, []);

  // Lock background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('[MobileNavigation] Menu opened');
    } else {
      document.body.style.overflow = '';
      console.log('[MobileNavigation] Menu closed');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounce toggle to prevent rapid state changes
  const handleToggle = () => {
    if (locked) {
      console.log('[MobileNavigation] Toggle locked, ignoring click');
      return;
    }
    setLocked(true);
    console.log('[MobileNavigation] handleToggle called, isOpen:', isOpen);
    onToggle();
    setTimeout(() => setLocked(false), 350); // match animation duration
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/websites', label: 'Websites', icon: Globe },
    { href: '/graphics', label: 'Graphics', icon: Palette },
    { href: '/data-science', label: 'MY PLANET IN DATA', icon: Database },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ];

  const socialLinks = [
    { href: 'https://github.com/hafidaso', label: 'GitHub', icon: Github },
    { href: 'mailto:hafidabelaidagnaoui@gmail.com', label: 'Email', icon: Mail },
    { href: 'https://linkedin.com/in/hafida-belayd', label: 'LinkedIn', icon: Linkedin },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 min-h-[48px] min-w-[48px] touch-manipulation"
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Toggle mobile menu"
        type="button"
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
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop for closing menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleToggle}
            aria-label="Close menu backdrop"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 z-50 md:hidden shadow-2xl border-l border-gray-200 dark:border-gray-600"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Menu
              </h2>
              <div className="flex items-center space-x-2">
                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={handleToggle}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-md"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-3 space-y-1" style={{ backgroundColor: 'rgb(249 115 21)' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    handleToggle();
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 min-h-[48px] touch-manipulation ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="px-3 py-2">
              <div className="border-t border-gray-200 dark:border-gray-600"></div>
            </div>

            {/* Social Links */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3 uppercase tracking-wide">
                Connect
              </h3>
              <div className="space-y-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleToggle}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                <p>© 2025 Hafida Belayd</p>
                <p className="text-xs mt-1 opacity-75">Data Analyst & AI Specialist</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;