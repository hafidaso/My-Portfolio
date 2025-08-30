import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 ${className}`}
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
        aria-label="Go to homepage"
      >
        <Home size={16} className="mr-1" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 