import React, { Suspense } from 'react';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import HomePageJsonLd from '@/components/HomePageJsonLd';
import { getSortedPostsData } from '@/lib/markdown';

// Lazy load heavy components to reduce initial bundle size
const FeaturedProjects = React.lazy(() => import('@/components/FeaturedProjects'));
const LatestPosts = React.lazy(() => import('@/components/LatestPosts'));
const Timeline = React.lazy(() => import('@/components/Timeline'));
const Languages = React.lazy(() => import('@/components/Languages'));
const Hobbies = React.lazy(() => import('@/components/Hobbies'));
const GitHubStats = React.lazy(() => import('@/components/GitHubStats'));

// Loading fallback component with better performance
const ComponentLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  }>
    {children}
  </Suspense>
);

const HomePage: React.FC = async () => {
  try {
    const allPosts = await getSortedPostsData();
    console.log('HomePage: All posts loaded:', allPosts);
    
    const latestPosts = allPosts.slice(0, 3);
    console.log('HomePage: Latest posts for display:', latestPosts);
    
    return (
      <>
        <HomePageJsonLd />
        <main className="min-h-screen p-2 max-w-7xl mx-auto space-y-2">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <AboutMe />
          </div>
          <div>
            <ComponentLoader>
              <GitHubStats />
            </ComponentLoader>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Featured Projects - Spans 2 columns */}
          <div className="lg:col-span-2">
            <ComponentLoader>
              <FeaturedProjects />
            </ComponentLoader>
          </div>

          {/* Technologies Stack */}
          <div>
            <Technologies />
          </div>

          {/* Timeline - Spans full width */}
          <div className="lg:col-span-3">
            <ComponentLoader>
              <Timeline />
            </ComponentLoader>
          </div>

          {/* Latest Posts and Languages - Side by side */}
          <div className="lg:col-span-2">
            <ComponentLoader>
              <LatestPosts posts={latestPosts} />
            </ComponentLoader>
          </div>

          <div>
            <ComponentLoader>
              <Languages />
            </ComponentLoader>
          </div>

          {/* Hobbies - Full width */}
          <div className="lg:col-span-3">
            <ComponentLoader>
              <Hobbies />
            </ComponentLoader>
          </div>
        </div>
        </main>
      </>
    );
  } catch (error) {
    console.error('Error loading HomePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
};

export default HomePage;