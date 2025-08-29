"use client";

import { useState } from 'react';
import BlogSearch from "@/components/blog/BlogSearch";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import BlogPostsList from "@/components/blog/BlogPostsList";
import { PostData } from '@/lib/markdown';

interface BlogContentProps {
  posts: PostData[];
  categories: string[];
  tags: string[];
}

export default function BlogContent({ posts, categories, tags }: BlogContentProps) {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleFilterChange = (newFilteredPosts: PostData[]) => {
    setFilteredPosts(newFilteredPosts);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div>
        <BlogSearch 
          posts={posts} 
          onFilterChange={handleFilterChange} 
          categories={categories} 
          tags={tags} 
        />
        <BlogPostsList posts={filteredPosts} />
      </div>
      <aside className="space-y-6">
        {/* Popular Tags */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <a
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-800 dark:hover:text-orange-200 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                {tag}
              </a>
            ))}
          </div>
          {tags.length > 15 && (
            <div className="mt-4 text-center">
              <a
                href="/blog"
                className="text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                View all tags →
              </a>
            </div>
          )}
        </div>
        
        <NewsletterSignup />
      </aside>
    </div>
  );
} 