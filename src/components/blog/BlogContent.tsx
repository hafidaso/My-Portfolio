"use client";

import { useState } from 'react';
import BlogSearch from "@/components/blog/BlogSearch";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import BlogPostsList from "@/components/blog/BlogPostsList";
import { PostData } from '../../../utils/markdown';

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
        <NewsletterSignup />
      </aside>
    </div>
  );
} 