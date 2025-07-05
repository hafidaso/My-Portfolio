// Fallback GitHub data when token is not available
export const fallbackGitHubData = {
  user: {
    login: "hafidaso",
    name: "Hafida Belayd",
    bio: "Data analyst passionate about creating innovative data solutions",
    public_repos: 15,
    followers: 25,
    following: 30,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: new Date().toISOString(),
    avatar_url: "https://github.com/hafidaso.png",
    html_url: "https://github.com/hafidaso",
    location: "Morocco",
    company: null,
    blog: "https://hafidaso.dev",
    email: "hafidabelaidagnaoui@gmail.com"
  },
  
  repositories: [
    {
      id: 1,
      name: "smart-portfolio",
      full_name: "hafidaso/smart-portfolio",
      description: "AI-powered portfolio website with interactive features",
      html_url: "https://github.com/hafidaso/smart-portfolio",
      stargazers_count: 12,
      forks_count: 3,
      language: "TypeScript",
      topics: ["nextjs", "react", "ai", "portfolio"],
      updated_at: "2024-01-15T10:30:00Z",
      created_at: "2023-12-01T00:00:00Z",
      private: false,
      fork: false,
      archived: false,
      disabled: false,
      license: { name: "MIT" },
      default_branch: "main"
    },
    {
      id: 2,
      name: "ai-chatbot",
      full_name: "hafidaso/ai-chatbot",
      description: "Intelligent chatbot with natural language processing",
      html_url: "https://github.com/hafidaso/ai-chatbot",
      stargazers_count: 15,
      forks_count: 5,
      language: "Python",
      topics: ["ai", "chatbot", "nlp", "machine-learning"],
      updated_at: "2024-01-05T09:15:00Z",
      created_at: "2023-10-20T00:00:00Z",
      private: false,
      fork: false,
      archived: false,
      disabled: false,
      license: { name: "MIT" },
      default_branch: "main"
    },
    {
      id: 3,
      name: "ecommerce-platform",
      full_name: "hafidaso/ecommerce-platform",
      description: "Full-stack e-commerce platform with modern UI/UX",
      html_url: "https://github.com/hafidaso/ecommerce-platform",
      stargazers_count: 20,
      forks_count: 7,
      language: "JavaScript",
      topics: ["ecommerce", "react", "nodejs", "mongodb"],
      updated_at: "2023-12-20T16:45:00Z",
      created_at: "2023-09-10T00:00:00Z",
      private: false,
      fork: false,
      archived: false,
      disabled: false,
      license: { name: "MIT" },
      default_branch: "main"
    },
    {
      id: 4,
      name: "task-management-app",
      full_name: "hafidaso/task-management-app",
      description: "Collaborative task management application with real-time updates",
      html_url: "https://github.com/hafidaso/task-management-app",
      stargazers_count: 18,
      forks_count: 4,
      language: "TypeScript",
      topics: ["task-management", "collaboration", "real-time", "typescript"],
      updated_at: "2023-12-15T11:30:00Z",
      created_at: "2023-08-25T00:00:00Z",
      private: false,
      fork: false,
      archived: false,
      disabled: false,
      license: { name: "MIT" },
      default_branch: "main"
    },
    {
      id: 5,
      name: "portfolio-website",
      full_name: "hafidaso/portfolio-website",
      description: "Modern portfolio website with AI integration and responsive design",
      html_url: "https://github.com/hafidaso/portfolio-website",
      stargazers_count: 10,
      forks_count: 3,
      language: "TypeScript",
      topics: ["portfolio", "nextjs", "react", "ai", "responsive"],
      updated_at: "2024-01-20T12:00:00Z",
      created_at: "2023-12-01T00:00:00Z",
      private: false,
      fork: false,
      archived: false,
      disabled: false,
      license: { name: "MIT" },
      default_branch: "main"
    }
  ],
  
  commits: [
    {
      sha: "abc123",
      commit: {
        author: {
          name: "Hafida Belayd",
          email: "hafidabelaidagnaoui@gmail.com",
          date: "2024-01-15T10:30:00Z"
        },
        message: "feat: Add AI-powered chatbot integration"
      }
    },
    {
      sha: "def456",
      commit: {
        author: {
          name: "Hafida Belayd",
          email: "hafidabelaidagnaoui@gmail.com",
          date: "2024-01-14T15:20:00Z"
        },
        message: "fix: Resolve responsive design issues"
      }
    },
    {
      sha: "ghi789",
      commit: {
        author: {
          name: "Hafida Belayd",
          email: "hafidabelaidagnaoui@gmail.com",
          date: "2024-01-13T09:45:00Z"
        },
        message: "docs: Update README with setup instructions"
      }
    }
  ],
  
  languages: {
    TypeScript: 45,
    JavaScript: 30,
    Python: 15,
    HTML: 5,
    CSS: 5
  },
  
  contributionStats: {
    totalCommits: 150,
    totalRepositories: 15,
    totalStars: 75,
    totalForks: 25,
    averageCommitsPerWeek: 8,
    mostActiveDay: "Wednesday",
    longestStreak: 14
  }
};

// Mock GitHub API responses
export const createMockResponse = <T>(data: T) => ({
  data,
  status: 200 as const,
  headers: {},
  url: "https://api.github.com/mock"
} as any);

// Fallback service methods
export const fallbackService = {
  getUserData: () => Promise.resolve(createMockResponse(fallbackGitHubData.user)),
  
  getRepositories: (options: any = {}) => {
    let repos = [...fallbackGitHubData.repositories];
    
    // Apply sorting
    if (options.sort === 'stars') {
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (options.sort === 'updated') {
      repos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    
    // Apply pagination
    if (options.per_page) {
      repos = repos.slice(0, options.per_page);
    }
    
    return Promise.resolve(createMockResponse(repos));
  },
  
  getRepositoryCommits: () => Promise.resolve(createMockResponse(fallbackGitHubData.commits)),
  
  isAuthenticated: () => false,
  
  isTokenValid: () => Promise.resolve(false)
}; 