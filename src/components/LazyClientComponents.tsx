'use client';

import React, { Suspense } from 'react';
import { LazyOnScroll } from './LazyComponent';

// Lazy load components on the client side
const GitHubStats = React.lazy(() => import('./GitHubStats'));
const Timeline = React.lazy(() => import('./Timeline'));
const LatestPosts = React.lazy(() => import('./LatestPosts'));
const Languages = React.lazy(() => import('./Languages'));
const Hobbies = React.lazy(() => import('./Hobbies'));

const LoadingFallback = ({ height = "200px" }: { height?: string }) => (
  <div className="flex justify-center items-center" style={{ minHeight: height }}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Client-side lazy components
export const LazyGitHubStats = () => (
  <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
    <Suspense fallback={<LoadingFallback height="300px" />}>
      <GitHubStats />
    </Suspense>
  </LazyOnScroll>
);

export const LazyTimeline = () => (
  <LazyOnScroll fallback={<LoadingFallback height="400px" />}>
    <Suspense fallback={<LoadingFallback height="400px" />}>
      <Timeline />
    </Suspense>
  </LazyOnScroll>
);

export const LazyLatestPosts = ({ posts }: { posts: any[] }) => {
  // Comprehensive data sanitization to prevent React error #130
  const safePost = (post: any) => {
    if (!post || typeof post !== 'object') {
      return null;
    }
    
    try {
      // Convert all values to safe types
      const sanitized = {
        id: post.id != null ? String(post.id) : `post-${Date.now()}`,
        title: post.title != null ? String(post.title) : 'Untitled Post',
        description: post.description != null ? String(post.description) : 'No description available',
        date: post.date != null ? String(post.date) : new Date().toISOString().split('T')[0],
        readTime: post.readTime != null ? String(post.readTime) : '0 min read',
        category: post.category != null ? String(post.category) : 'Uncategorized',
        tags: Array.isArray(post.tags) 
          ? post.tags.map((tag: any) => tag != null ? String(tag) : '').filter(Boolean)
          : [],
        author: post.author != null ? String(post.author) : 'Anonymous',
        image: post.image != null ? String(post.image) : undefined,
        excerpt: post.excerpt != null ? String(post.excerpt) : ''
      };
      
      // Double-check all values are serializable
      JSON.stringify(sanitized);
      return sanitized;
    } catch (error) {
      console.error('Error sanitizing post:', post, error);
      return null;
    }
  };

  const safePosts = React.useMemo(() => {
    if (!Array.isArray(posts)) {
      console.warn('LazyLatestPosts: posts is not an array:', posts);
      return [];
    }
    
    return posts
      .map(safePost)
      .filter((post): post is NonNullable<typeof post> => post !== null);
  }, [posts]);

  return (
    <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
      <Suspense fallback={<LoadingFallback height="300px" />}>
        <LatestPosts posts={safePosts} />
      </Suspense>
    </LazyOnScroll>
  );
};

export const LazyLanguages = () => (
  <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
    <Suspense fallback={<LoadingFallback height="300px" />}>
      <Languages />
    </Suspense>
  </LazyOnScroll>
);

export const LazyHobbies = () => (
  <LazyOnScroll fallback={<LoadingFallback height="250px" />}>
    <Suspense fallback={<LoadingFallback height="250px" />}>
      <Hobbies />
    </Suspense>
  </LazyOnScroll>
);
