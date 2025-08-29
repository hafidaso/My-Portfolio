"use client";

import React from 'react';
import { 
  BookOpen, 
  Download, 
  ArrowRight, 
  Star,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface BlogCTAsProps {
  category?: string;
  tags?: string[];
}

export default function BlogCTAs({ category, tags = [] }: BlogCTAsProps) {
  const getRelatedCTA = () => {
    if (category === 'Programming & AI') {
      return {
        title: "Master AI Development",
        description: "Get hands-on with our comprehensive AI tutorials and projects",
        action: "Explore AI Projects",
        href: "/projects",
        icon: BookOpen,
        color: "bg-blue-500 hover:bg-blue-600"
      };
    }
    
    if (category === 'Data Science') {
      return {
        title: "Level Up Your Data Skills",
        description: "Access our data science projects and analysis tools",
        action: "View Data Projects",
        href: "/data-science",
        icon: BookOpen,
        color: "bg-purple-500 hover:bg-purple-600"
      };
    }
    
    if (category === 'Web Development') {
      return {
        title: "Build Amazing Websites",
        description: "Check out our web development portfolio and templates",
        action: "See Web Projects",
        href: "/websites",
        icon: BookOpen,
        color: "bg-green-500 hover:bg-green-600"
      };
    }
    
    // Default CTA
    return {
      title: "Explore More Content",
      description: "Discover related articles and projects in our portfolio",
      action: "Browse Portfolio",
      href: "/",
      icon: BookOpen,
      color: "bg-orange-500 hover:bg-orange-600"
    };
  };

  const cta = getRelatedCTA();
  const IconComponent = cta.icon;

  return (
    <div className="space-y-6 my-12">
      {/* Main CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {cta.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            {cta.description}
          </p>
          <Link
            href={cta.href}
            className={`inline-flex items-center px-6 py-3 ${cta.color} text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            {cta.action}
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>



      {/* Inline CTA for specific content types */}

      {tags.includes('Python') && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center mb-3">
            <BookOpen size={20} className="text-green-500 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Python Learning Path
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Master Python programming with our step-by-step tutorials and hands-on projects.
          </p>
          <a
            href="https://pll.harvard.edu/course/cs50s-introduction-programming-python"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            Start Learning Python with Harvard CS50
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      )}
    </div>
  );
}
