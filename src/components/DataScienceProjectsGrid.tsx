"use client"

import React, { useState } from 'react';
import { ExternalLink, Github, Search, Filter, Database, BarChart3, Brain, TrendingUp } from 'lucide-react';
import { dataScienceProjectsData, type DataScienceProject } from '@/data/dataScienceProjects';

const DataScienceProjectsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'recent'>('recent');

  const categories = [
    { value: 'All', label: 'All Categories' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'data-visualization', label: 'Data Visualization' },
    { value: 'statistical-analysis', label: 'Statistical Analysis' },
    { value: 'predictive-modeling', label: 'Predictive Modeling' },
    { value: 'nlp', label: 'Natural Language Processing' },
    { value: 'computer-vision', label: 'Computer Vision' },
    { value: 'time-series', label: 'Time Series' },
    { value: 'clustering', label: 'Clustering' },
    { value: 'regression', label: 'Regression' }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'data-analysis': 'bg-blue-500',
      'machine-learning': 'bg-green-500',
      'data-visualization': 'bg-purple-500',
      'statistical-analysis': 'bg-orange-500',
      'predictive-modeling': 'bg-pink-500',
      'nlp': 'bg-indigo-500',
      'computer-vision': 'bg-teal-500',
      'time-series': 'bg-cyan-500',
      'clustering': 'bg-red-500',
      'regression': 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'data-analysis': Database,
      'machine-learning': Brain,
      'data-visualization': BarChart3,
      'statistical-analysis': TrendingUp,
      'predictive-modeling': Brain,
      'nlp': Brain,
      'computer-vision': Brain,
      'time-series': TrendingUp,
      'clustering': Database,
      'regression': TrendingUp
    };
    return icons[category as keyof typeof icons] || Database;
  };

  const filteredProjects = dataScienceProjectsData
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || 
                             project.category === selectedCategory;
      
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
            placeholder="Search data science projects..."
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const CategoryIcon = getCategoryIcon(project.category);
          return (
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
                <span className={`${getCategoryColor(project.category)} text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1`}>
                  <CategoryIcon className="w-3 h-3" />
                  {categories.find(cat => cat.value === project.category)?.label || project.category}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
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
                  <Database className="w-16 h-16 text-gray-400 dark:text-gray-500" />
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
                  {project.shortDescription}
                </p>

                {/* Dataset Size */}
                {project.datasetSize && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                      <Database className="w-3 h-3" />
                      {project.datasetSize}
                    </span>
                  </div>
                )}

                {/* Key Findings */}
                {project.keyFindings && project.keyFindings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Findings:</h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {project.keyFindings.slice(0, 2).map((finding, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                      {project.keyFindings.length > 2 && (
                        <li className="text-gray-500 italic">+{project.keyFindings.length - 2} more findings</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
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
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View Project
                  </a>
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Database className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No data science projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default DataScienceProjectsGrid; 