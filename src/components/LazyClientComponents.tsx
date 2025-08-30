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
      return {
        id: String(post.id || ''),
        title: String(post.title || ''),
        description: String(post.description || ''),
        date: String(post.date || ''),
        readTime: String(post.readTime || ''),
        category: String(post.category || ''),
        tags: Array.isArray(post.tags) 
          ? post.tags.map((tag: any) => String(tag)) 
          : [],
        author: String(post.author || ''),
        image: post.image ? String(post.image) : undefined
      };
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
      .filter(post => post !== null);
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
