// GitHub Configuration
export const GITHUB_CONFIG = {
  // Your GitHub username - update this to your actual GitHub username
  USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'hafidaso',
  
  // GitHub API token (optional, for higher rate limits and private repo access)
  // Set this in your .env.local file as NEXT_PUBLIC_GITHUB_TOKEN
  TOKEN: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  
  // Number of repositories to fetch
  REPOS_PER_PAGE: 100,
  
  // Featured projects count (for homepage)
  FEATURED_PROJECTS_COUNT: 4,
  
  // Cache duration in milliseconds (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,
};

// Helper function to get GitHub username
export const getGitHubUsername = (): string => {
  return GITHUB_CONFIG.USERNAME;
};

// Helper function to get GitHub API token
export const getGitHubToken = (): string | undefined => {
  return GITHUB_CONFIG.TOKEN;
}; 