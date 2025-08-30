import React, { memo, useMemo } from 'react';
import { Github, ExternalLink, Star, GitFork } from 'lucide-react';
import * as Si from 'react-icons/si';
import ThreeDCard from './ThreeDCard';
import { safeObjectKeys } from '../lib/safeUtils';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: Array<{
    name: string;
    icon: string;
    color?: string;
  }>;
  githubLink: string;
  liveLink?: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

const ProjectCard = memo<ProjectCardProps>(({
  title,
  description,
  technologies,
  githubLink,
  liveLink,
  stars,
  forks,
  lastUpdated
}) => {
  // Sanitize props to prevent React error #130
  const safeTitle = String(title || 'Untitled Project');
  const safeDescription = String(description || 'No description available');
  const safeTechnologies = Array.isArray(technologies) ? technologies : [];
  const safeGithubLink = String(githubLink || '');
  const safeLiveLink = liveLink ? String(liveLink) : undefined;
  const safeStars = typeof stars === 'number' ? stars : 0;
  const safeForks = typeof forks === 'number' ? forks : 0;
  const safeLastUpdated = String(lastUpdated || new Date().toISOString());
  // Memoize icon components mapping
  const iconComponents = useMemo(() => {
    const components: { [key: string]: React.ElementType } = {};
    const iconKeys = safeObjectKeys(Si);
    iconKeys.forEach(key => {
      components[key] = (Si as any)[key];
    });
    return components;
  }, []);

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    try {
      const date = new Date(safeLastUpdated);
      return isNaN(date.getTime()) 
        ? 'Invalid date'
        : date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
    } catch {
      return 'Invalid date';
    }
  }, [safeLastUpdated]);

  return (
    <ThreeDCard intensity={0.05} className="group relative overflow-hidden rounded-xl p-1 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl flex-grow">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-75 transition-all duration-500 group-hover:opacity-100"></div>
      <div className="relative h-full rounded-lg bg-white p-6 dark:bg-gray-800 transition-all duration-500 dark:bg-opacity-80 backdrop-blur-sm flex flex-col">
        <h3 className="mb-3 text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{safeTitle}</h3>
        <p className="mb-4 text-sm md:text-base text-gray-600 dark:text-gray-300 flex-grow">{safeDescription}</p>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.isArray(safeTechnologies) && safeTechnologies.map((tech, index) => {
              // Ensure tech is a valid object with required properties
              if (!tech || typeof tech !== 'object' || !tech.name) {
                return null;
              }
              
              const IconComponent = iconComponents[tech.icon];
              const techName = String(tech.name || '');
              const techColor = String(tech.color || '#6e7681');
              
              return IconComponent ? (
                <div
                  key={`tech-${techName}-${index}`}
                  className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 mr-2"
                >
                  <div 
                    className="w-4 h-4 mr-1"
                    style={{ color: techColor }}
                  >
                    <IconComponent className="w-full h-full" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {techName}
                  </span>
                </div>
              ) : (
                <div
                  key={`tech-${techName}-${index}`}
                  className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 mr-2"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {techName}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Star size={16} className="mr-1" />
                <span>{safeStars}</span>
              </span>
              <span className="flex items-center">
                <GitFork size={16} className="mr-1" />
                <span>{safeForks}</span>
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <a
              href={safeGithubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300"
            >
              <Github className="mr-1" size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            {safeLiveLink && (
              <a
                href={safeLiveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300"
              >
                <ExternalLink className="mr-1" size={20} />
                <span className="text-sm">Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </ThreeDCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;