"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PostData } from '@/lib/markdown';

interface BlogSearchProps {
  posts: PostData[];
  onFilterChange: (filteredPosts: PostData[]) => void;
  categories: string[];
  tags: string[];
}

export default function BlogSearch({ posts, onFilterChange, categories, tags }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' || post.category === selectedCategory;

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [posts, searchTerm, selectedCategory, selectedTags]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilterChange(filteredPosts);
  }, [filteredPosts, onFilterChange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTags.length > 0;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {selectedTags.length + (selectedCategory ? 1 : 0) + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  title={`Click to filter by ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count and Tag Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPosts.length} of {posts.length} articles
        </div>
        
        {/* Show tag links when tags are selected */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">View all posts with:</span>
            {selectedTags.map(tag => (
              <a
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors duration-200"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 