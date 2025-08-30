'use client';

import React, { Suspense } from 'react';
import LoadingAnimation from './LoadingAnimation';
import { LazyOnScroll } from './LazyComponent';

// Lazy load components on the client side
const GitHubStats = React.lazy(() => import('./GitHubStats'));
const Timeline = React.lazy(() => import('./Timeline'));
const LatestPosts = React.lazy(() => import('./LatestPosts'));
const Languages = React.lazy(() => import('./Languages'));
const Hobbies = React.lazy(() => import('./Hobbies'));

const LoadingFallback = ({ height = "200px" }: { height?: string }) => (
  <div className="flex justify-center items-center" style={{ minHeight: height }}>
    <LoadingAnimation type="spinner" size="md" color="primary" />
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

export const LazyLatestPosts = ({ posts }: { posts: any[] }) => (
  <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
    <Suspense fallback={<LoadingFallback height="300px" />}>
      <LatestPosts posts={posts} />
    </Suspense>
  </LazyOnScroll>
);

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
