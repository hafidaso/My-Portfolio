import React, { Suspense } from 'react';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import LoadingAnimation from '@/components/LoadingAnimation';
import { LazyOnScroll } from '@/components/LazyComponent';
import HomePageJsonLd from '@/components/HomePageJsonLd';
import { getSortedPostsData } from '@/lib/markdown';

// Lazy load non-critical components
const LatestPosts = React.lazy(() => import('@/components/LatestPosts'));
const GitHubStats = React.lazy(() => import('@/components/GitHubStats'));
const Timeline = React.lazy(() => import('@/components/Timeline'));
const Languages = React.lazy(() => import('@/components/Languages'));
const Hobbies = React.lazy(() => import('@/components/Hobbies'));

const LoadingFallback = ({ height = "200px" }: { height?: string }) => (
  <div className="flex justify-center items-center" style={{ minHeight: height }}>
    <LoadingAnimation type="spinner" size="md" color="primary" />
  </div>
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
            <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
              <Suspense fallback={<LoadingFallback height="300px" />}>
                <GitHubStats />
              </Suspense>
            </LazyOnScroll>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Featured Projects - Spans 2 columns */}
          <div className="lg:col-span-2">
            <FeaturedProjects />
          </div>

          {/* Technologies Stack */}
          <div>
            <Technologies />
          </div>

          {/* Timeline - Spans full width */}
          <div className="lg:col-span-3">
            <LazyOnScroll fallback={<LoadingFallback height="400px" />}>
              <Suspense fallback={<LoadingFallback height="400px" />}>
                <Timeline />
              </Suspense>
            </LazyOnScroll>
          </div>

          {/* Latest Posts */}
          <div className="lg:col-span-2">
            <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
              <Suspense fallback={<LoadingFallback height="300px" />}>
                <LatestPosts posts={latestPosts} />
              </Suspense>
            </LazyOnScroll>
          </div>

          {/* Languages */}
          <div>
            <LazyOnScroll fallback={<LoadingFallback height="300px" />}>
              <Suspense fallback={<LoadingFallback height="300px" />}>
                <Languages />
              </Suspense>
            </LazyOnScroll>
          </div>

          {/* Hobbies */}
          <div className="lg:col-span-3">
            <LazyOnScroll fallback={<LoadingFallback height="250px" />}>
              <Suspense fallback={<LoadingFallback height="250px" />}>
                <Hobbies />
              </Suspense>
            </LazyOnScroll>
          </div>
        </div>
      </main>
      </>
    );
  } catch (error) {
    console.error('HomePage: Error loading posts:', error);
    
    // Fallback without posts
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
            <GitHubStats />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Featured Projects - Spans 2 columns */}
          <div className="lg:col-span-2">
            <FeaturedProjects />
          </div>

          {/* Technologies Stack */}
          <div>
            <Technologies />
          </div>

          {/* Timeline - Spans full width */}
          <div className="lg:col-span-3">
            <Timeline />
          </div>

          {/* Latest Posts - Show error state */}
          <div className="lg:col-span-2">
            <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-6">
                Latest Posts
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Unable to load posts at the moment.</p>
                <a 
                  href="/blog" 
                  className="inline-flex items-center text-sm px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/20 transition-all"
                >
                  Visit Blog
                </a>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <Languages />
          </div>

          {/* Hobbies */}
          <div className="lg:col-span-3">
            <Hobbies />
          </div>
        </div>
      </main>
      </>
    );
  }
};

export default HomePage;