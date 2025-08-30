"use client"

import React, { useState } from 'react';
import { ExternalLink, Palette, Search, Filter, Eye } from 'lucide-react';
import { graphicsData, type GraphicProject } from '@/data/graphics';

const GraphicsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'year'>('year');

  const categories = [
    { value: 'All', label: 'All Categories' },
    { value: 'branding', label: 'Branding' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'print', label: 'Print Design' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: '3d', label: '3D Design' },
    { value: 'animation', label: 'Animation' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'video', label: 'Video' }
  ];

  const filteredGraphics = graphicsData
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured ? 1 : -1;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

  const getCategoryColor = (category: string) => {
    const colors = {
      'branding': 'bg-blue-500',
      'ui-ux': 'bg-green-500',
      'illustration': 'bg-purple-500',
      'print': 'bg-orange-500',
      'digital-art': 'bg-pink-500',
      '3d': 'bg-indigo-500',
      'animation': 'bg-teal-500',
      'web-design': 'bg-cyan-500',
      'social-media': 'bg-red-500',
      'video': 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search graphic projects..."
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
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'name' | 'year')}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* Graphics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGraphics.map((project) => (
          <div
            key={project.id}
            className={`group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
              project.featured ? 'ring-2 ring-orange-500/20' : ''
            }`}
          >
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`${getCategoryColor(project.category)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                {categories.find(cat => cat.value === project.category)?.label}
              </span>
            </div>

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`Graphic design project: ${project.title} - ${project.category.replace('-', ' ')} design from ${project.year}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${project.image ? 'hidden' : ''}`}>
                <Palette className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
              {/* Year Badge */}
              <div className="absolute bottom-2 right-2">
                <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* View on Behance Button */}
              <a
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
              >
                <Eye className="w-4 h-4" />
                View on Behance
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredGraphics.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Palette className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No graphic projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default GraphicsGrid;