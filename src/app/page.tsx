import React from 'react';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import LatestPosts from '@/components/LatestPosts';
import GitHubStats from '@/components/GitHubStats';
import Timeline from '@/components/Timeline';
import Languages from '@/components/Languages';
import Hobbies from '@/components/Hobbies';
import HomePageJsonLd from '@/components/HomePageJsonLd';

const HomePage: React.FC = () => {
  return (
    <>
      <HomePageJsonLd />
      <main className="min-h-screen p-2 max-w-7xl mx-auto space-y-2">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="md:col-span-2 lg:col-span-2">
          <AboutMe />
        </div>
        <div className="md:col-span-2 lg:col-span-1 md:order-2 lg:order-1">
          <GitHubStats />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Featured Projects - Spans 2 columns */}
        <div className="md:col-span-2 lg:col-span-2">
          <FeaturedProjects />
        </div>

        {/* Technologies Stack */}
        <div className="md:col-span-2 lg:col-span-1 md:order-2 lg:order-1">
          <Technologies />
        </div>

        {/* Timeline - Spans full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Timeline />
        </div>

        {/* Latest Posts */}
        <div className="md:col-span-2 lg:col-span-2">
          <LatestPosts />
        </div>

        {/* Languages */}
        <div className="md:col-span-2 lg:col-span-1 md:order-2 lg:order-1">
          <Languages />
        </div>

        {/* Hobbies */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Hobbies />
        </div>
      </div>
    </main>
    </>
  );
};

export default HomePage;