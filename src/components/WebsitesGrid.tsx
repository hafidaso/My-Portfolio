"use client"

import React, { useState } from 'react';
import { ExternalLink, Github, Globe, Search, Filter } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';
import { websitesData, type Website } from '@/data/websites';

const WebsitesGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'recent'>('recent');

  const categories = [
    { value: 'All', label: 'All Categories' },
    { value: 'personal', label: 'Personal' },
    { value: 'client', label: 'Client' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'e-commerce', label: 'E-Commerce' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'luxury-brand', label: 'Luxury Brand' },
    { value: 'travel', label: 'Travel' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'non-profit', label: 'Non-Profit' }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'personal': 'bg-blue-500',
      'client': 'bg-green-500',
      'portfolio': 'bg-purple-500',
      'e-commerce': 'bg-orange-500',
      'real-estate': 'bg-red-500',
      'restaurant': 'bg-pink-500',
      'luxury-brand': 'bg-indigo-500',
      'travel': 'bg-teal-500',
      'business': 'bg-cyan-500',
      'entertainment': 'bg-yellow-500',
      'automotive': 'bg-gray-500',
      'jewelry': 'bg-amber-500',
      'education': 'bg-emerald-500',
      'healthcare': 'bg-rose-500',
      'non-profit': 'bg-lime-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredWebsites = websitesData
    .filter(website => {
      const matchesSearch = website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           website.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           website.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || 
                             website.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured ? 1 : -1;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'recent':
          return b.year - a.year;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'name' | 'recent')}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      {/* Websites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebsites.map((website) => (
          <div
            key={website.id}
            className={`group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
              website.featured ? 'ring-2 ring-orange-500/20' : ''
            }`}
          >
            {/* Featured Badge */}
            {website.featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`${getCategoryColor(website.category)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                {categories.find(cat => cat.value === website.category)?.label || website.category}
              </span>
            </div>

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
              {website.image ? (
                <img
                  src={website.image}
                  alt={website.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${website.image ? 'hidden' : ''}`}>
                <Globe className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              {/* Year Badge */}
              <div className="absolute bottom-2 right-2">
                <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {website.year}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                {website.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {website.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {website.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-2">
                <a
                  href={website.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                
                {website.githubUrl && (
                  <a
                    href={website.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredWebsites.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No websites found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default WebsitesGrid;