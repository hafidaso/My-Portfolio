'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { githubService } from '@/lib/github';
import { getGitHubUsername, GITHUB_CONFIG } from '@/config/github';
import { GithubIcon, ExternalLink, Loader } from 'lucide-react';
import { 
  SiNextdotjs, SiOpenai, SiReact, SiTypescript, 
  SiTailwindcss, SiNodedotjs, SiMongodb,
  SiLaravel, SiPhp, SiMysql, SiDocker
} from 'react-icons/si';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type GitHubRepo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

// Memoize tech icons to prevent recreation on every render
const techIcons: { [key: string]: React.ReactNode } = {
  'Next.js': <SiNextdotjs className="w-4 h-4" />,
  'OpenAI': <SiOpenai className="w-4 h-4" />,
  'React': <SiReact className="w-4 h-4" />,
  'TypeScript': <SiTypescript className="w-4 h-4" />,
  'TailwindCSS': <SiTailwindcss className="w-4 h-4" />,
  'Node.js': <SiNodedotjs className="w-4 h-4" />,
  'MongoDB': <SiMongodb className="w-4 h-4" />,
  'Laravel': <SiLaravel className="w-4 h-4" />,
  'PHP': <SiPhp className="w-4 h-4" />,
  'MySQL': <SiMysql className="w-4 h-4" />,
  'Docker': <SiDocker className="w-4 h-4" />
};

// Memoized project card component to prevent unnecessary re-renders
const ProjectCard = React.memo<{ project: GitHubRepo }>(({ project }) => (
  <div
    className="bg-gray-50 dark:bg-gradient-to-br dark:from-[#1E1E2E] dark:to-[#2D2D44] rounded-lg p-3 flex flex-col justify-between border border-gray-200 dark:border-gray-800/50 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-colors will-change-transform"
    style={{ contain: 'layout style paint' }}
  >
    <div>
      <h3 className="text-lg font-semibold mb-1 line-clamp-1">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {project.description}
        </p>
      )}
    </div>
    
    <div className="flex items-center justify-between mt-auto pt-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ⭐ {project.stargazers_count || 0}
          </span>
        </div>
        {project.language && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {project.language}
          </span>
        )}
      </div>
      
      <div className="flex space-x-1">
        <a
          href={project.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={`View ${project.name} on GitHub`}
        >
          <GithubIcon className="w-4 h-4" />
        </a>
        {project.homepage && (
          <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`View ${project.name} live demo`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the sorting function to prevent recreation
  const sortRepos = useCallback((repos: GitHubRepo[]) => {
    return repos.sort((a, b) => {
      // First compare by stars
      const starsA = a.stargazers_count || 0;
      const starsB = b.stargazers_count || 0;
      if (starsB !== starsA) {
        return starsB - starsA;
      }
      // If stars are equal, sort by update date
      const dateA = new Date(a.updated_at || 0).getTime();
      const dateB = new Date(b.updated_at || 0).getTime();
      return dateB - dateA;
    });
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const username = getGitHubUsername();
      const { data: repos } = await githubService.getRepositories(username, {
        per_page: GITHUB_CONFIG.REPOS_PER_PAGE,
        type: 'owner'
      });

      const sortedRepos = sortRepos(repos);
      setProjects(sortedRepos.slice(0, GITHUB_CONFIG.FEATURED_PROJECTS_COUNT));
    } catch (err) {
      setError('Error fetching featured projects');
      console.error('Error fetching featured projects:', err);
    } finally {
      setLoading(false);
    }
  }, [sortRepos]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Memoize the loading state component
  const LoadingState = useMemo(() => (
    <div className="flex justify-center items-center h-64">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  ), []);

  // Memoize the error state component
  const ErrorState = useMemo(() => (
    <div className="text-red-500 text-center py-4">
      {error}
    </div>
  ), [error]);

  if (loading) return LoadingState;
  if (error) return ErrorState;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-3 h-full transition-colors">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-4">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[calc(100%-3rem)]">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FeaturedProjects);