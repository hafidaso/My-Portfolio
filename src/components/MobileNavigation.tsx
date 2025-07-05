'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, BookOpen, User, Github, Mail, Linkedin, Moon, Sun } from 'lucide-react';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
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
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
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



      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 z-50 md:hidden shadow-2xl border-l border-gray-200 dark:border-gray-700"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <div className="flex items-center space-x-1">
                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onToggle}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="px-3 py-2">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Social Links */}
            <div className="p-3">
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
                    onClick={onToggle}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                <p>© 2024 Hafida Belayd</p>
                <p className="text-xs mt-1">Data Analyst & AI Specialist</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation; 