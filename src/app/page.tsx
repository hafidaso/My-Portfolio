import React from 'react';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import {
  LazyGitHubStats,
  LazyTimeline,
  LazyLatestPosts,
  LazyLanguages,
  LazyHobbies
} from '@/components/LazyClientComponents';
import HomePageJsonLd from '@/components/HomePageJsonLd';
import { getSortedPostsData } from '@/lib/markdown';

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
            <LazyGitHubStats />
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
            <LazyTimeline />
          </div>

          {/* Latest Posts */}
          <div className="lg:col-span-2">
            <LazyLatestPosts posts={latestPosts} />
          </div>

          {/* Languages */}
          <div>
            <LazyLanguages />
          </div>

          {/* Hobbies */}
          <div className="lg:col-span-3">
            <LazyHobbies />
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
            <LazyGitHubStats />
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
            <LazyTimeline />
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
            <LazyLanguages />
          </div>

          {/* Hobbies */}
          <div className="lg:col-span-3">
            <LazyHobbies />
          </div>
        </div>
      </main>
      </>
    );
  }
};

export default HomePage;