import { githubService } from './github';
import resumeData from '@/data/resumeData.json';

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  githubInsights: GitHubInsights;
  skillGaps: SkillGap[];
  improvementAreas: ImprovementArea[];
}

export interface GitHubInsights {
  totalRepositories: number;
  totalCommits: number;
  totalStars: number;
  totalForks: number;
  languages: LanguageStats[];
  contributionTrend: ContributionTrend;
  topRepositories: RepositoryStats[];
  activityLevel: 'high' | 'medium' | 'low';
}

export interface LanguageStats {
  language: string;
  percentage: number;
  repositories: number;
}

export interface ContributionTrend {
  recentActivity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastCommitDate: string;
  commitFrequency: number; // commits per week
}

export interface RepositoryStats {
  name: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  lastUpdated: string;
}

export interface SkillGap {
  skill: string;
  demand: 'high' | 'medium' | 'low';
  reason: string;
  learningPath: string[];
}

export interface ImprovementArea {
  category: string;
  currentLevel: string;
  targetLevel: string;
  actionItems: string[];
  timeline: string;
}

// Analyze GitHub profile and contributions
export async function analyzeGitHubProfile(username: string): Promise<GitHubInsights> {
  try {
    // Get user data
    const userData = await githubService.getUserData(username);
    
    // Get repositories
    const repos = await githubService.getRepositories(username, {
      sort: 'updated',
      per_page: 100
    });
    
    // Calculate language statistics
    const languageStats = calculateLanguageStats(repos.data);
    
    // Calculate contribution trend
    const contributionTrend = await calculateContributionTrend(username, repos.data);
    
    // Get top repositories
    const topRepositories = getTopRepositories(repos.data);
    
    // Determine activity level
    const activityLevel = determineActivityLevel(contributionTrend.commitFrequency);
    
    return {
      totalRepositories: repos.data.length,
      totalCommits: userData.data.public_repos * 50, // Estimate
      totalStars: repos.data.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      totalForks: repos.data.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
      languages: languageStats,
      contributionTrend,
      topRepositories,
      activityLevel
    };
  } catch (error) {
    console.error('Error analyzing GitHub profile:', error);
    throw error;
  }
}

// Calculate language statistics from repositories
function calculateLanguageStats(repos: any[]): LanguageStats[] {
  const languageCount: { [key: string]: number } = {};
  const languageRepos: { [key: string]: Set<string> } = {};
  
  for (const repo of repos) {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      if (!languageRepos[repo.language]) {
        languageRepos[repo.language] = new Set();
      }
      languageRepos[repo.language].add(repo.name);
    }
  }
  
  const total = Object.values(languageCount).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(languageCount)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
      repositories: languageRepos[language].size
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);
}

// Calculate contribution trend
async function calculateContributionTrend(username: string, repos: any[]): Promise<ContributionTrend> {
  try {
    // Get recent commits from top repositories
    const recentCommits = [];
    const topRepos = repos.slice(0, 5);
    
    for (const repo of topRepos) {
      try {
        const commits = await githubService.getRepositoryCommits(repo.owner.login, repo.name, {
          per_page: 10
        });
        recentCommits.push(...commits.data);
      } catch (error) {
        console.warn(`Could not fetch commits for ${repo.name}:`, error);
      }
    }
    
    // Calculate commit frequency (commits per week)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentCommitsCount = recentCommits.filter(commit => {
      const author = commit.commit?.author;
      return author && author.date && new Date(author.date) > oneWeekAgo;
    }).length;
    
    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentCommitsCount > 10) {
      trend = 'increasing';
    } else if (recentCommitsCount < 3) {
      trend = 'decreasing';
    }
    
    const lastCommit = recentCommits[0];
    const lastCommitDate = lastCommit?.commit?.author?.date || new Date().toISOString();
    
    return {
      recentActivity: recentCommitsCount,
      trend,
      lastCommitDate,
      commitFrequency: recentCommitsCount
    };
  } catch (error) {
    console.error('Error calculating contribution trend:', error);
    return {
      recentActivity: 0,
      trend: 'stable',
      lastCommitDate: new Date().toISOString(),
      commitFrequency: 0
    };
  }
}

// Get top repositories by stars and forks
function getTopRepositories(repos: any[]): RepositoryStats[] {
  return repos
    .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
    .slice(0, 5)
    .map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Unknown',
      description: repo.description || 'No description',
      lastUpdated: repo.updated_at
    }));
}

// Determine activity level based on commit frequency
function determineActivityLevel(commitFrequency: number): 'high' | 'medium' | 'low' {
  if (commitFrequency >= 10) return 'high';
  if (commitFrequency >= 3) return 'medium';
  return 'low';
}

// Analyze resume and provide comprehensive insights
export async function analyzeResume(username: string): Promise<ResumeAnalysis> {
  try {
    // Get GitHub insights
    const githubInsights = await analyzeGitHubProfile(username);
    
    // Analyze current skills vs market demand
    const skillGaps = analyzeSkillGaps();
    
    // Identify improvement areas
    const improvementAreas = identifyImprovementAreas(githubInsights);
    
    // Calculate overall score
    const overallScore = calculateOverallScore(githubInsights, skillGaps, improvementAreas);
    
    // Identify strengths and weaknesses
    const strengths = identifyStrengths(githubInsights, resumeData);
    const weaknesses = identifyWeaknesses(githubInsights, skillGaps);
    
    // Generate recommendations
    const recommendations = generateRecommendations(githubInsights, skillGaps, improvementAreas);
    
    return {
      overallScore,
      strengths,
      weaknesses,
      recommendations,
      githubInsights,
      skillGaps,
      improvementAreas
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

// Analyze skill gaps based on current market demand
function analyzeSkillGaps(): SkillGap[] {
  const currentSkills = new Set(resumeData.skills.map(skill => skill.toLowerCase()));
  const highDemandSkills = [
    'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
    'graphql', 'apollo', 'prisma', 'typeorm', 'nestjs', 'fastapi',
    'react native', 'flutter', 'swift', 'kotlin', 'rust', 'go',
    'machine learning', 'tensorflow', 'pytorch', 'data science', 'pandas',
    'microservices', 'serverless', 'event-driven architecture'
  ];
  
  const skillGaps: SkillGap[] = [];
  
  for (const skill of highDemandSkills) {
    if (!currentSkills.has(skill)) {
      skillGaps.push({
        skill,
        demand: 'high',
        reason: 'High market demand and competitive advantage',
        learningPath: generateLearningPath(skill)
      });
    }
  }
  
  return skillGaps.slice(0, 5); // Return top 5 skill gaps
}

// Generate learning path for a skill
function generateLearningPath(skill: string): string[] {
  const learningPaths: { [key: string]: string[] } = {
    'kubernetes': [
      'Learn Docker fundamentals',
      'Study Kubernetes architecture',
      'Practice with minikube',
      'Deploy applications to clusters',
      'Learn Helm charts'
    ],
    'aws': [
      'Complete AWS Cloud Practitioner',
      'Learn EC2, S3, and RDS',
      'Study serverless with Lambda',
      'Practice with AWS CLI',
      'Get AWS Solutions Architect certification'
    ],
    'machine learning': [
      'Learn Python fundamentals',
      'Study statistics and mathematics',
      'Learn pandas and numpy',
      'Practice with scikit-learn',
      'Explore deep learning with TensorFlow'
    ],
    'react native': [
      'Master React fundamentals',
      'Learn mobile development concepts',
      'Study React Native components',
      'Practice with Expo',
      'Build and deploy mobile apps'
    ]
  };
  
  return learningPaths[skill] || [
    'Research the technology',
    'Find online courses',
    'Practice with tutorials',
    'Build sample projects',
    'Contribute to open source'
  ];
}

// Identify improvement areas
function identifyImprovementAreas(githubInsights: GitHubInsights): ImprovementArea[] {
  const areas: ImprovementArea[] = [];
  
  // GitHub activity improvement
  if (githubInsights.activityLevel === 'low') {
    areas.push({
      category: 'GitHub Activity',
      currentLevel: 'Low',
      targetLevel: 'Medium',
      actionItems: [
        'Commit code daily',
        'Contribute to open source projects',
        'Create and maintain personal projects',
        'Write technical blog posts'
      ],
      timeline: '3-6 months'
    });
  }
  
  // Repository quality improvement
  if (githubInsights.totalStars < 10) {
    areas.push({
      category: 'Repository Quality',
      currentLevel: 'Basic',
      targetLevel: 'Professional',
      actionItems: [
        'Add comprehensive README files',
        'Include proper documentation',
        'Add tests to projects',
        'Optimize code quality'
      ],
      timeline: '2-4 months'
    });
  }
  
  // Technology diversity
  if (githubInsights.languages.length < 3) {
    areas.push({
      category: 'Technology Diversity',
      currentLevel: 'Limited',
      targetLevel: 'Diverse',
      actionItems: [
        'Learn a new programming language',
        'Explore different frameworks',
        'Try new technologies',
        'Build projects with different stacks'
      ],
      timeline: '6-12 months'
    });
  }
  
  return areas;
}

// Calculate overall resume score
function calculateOverallScore(
  githubInsights: GitHubInsights,
  skillGaps: SkillGap[],
  improvementAreas: ImprovementArea[]
): number {
  let score = 70; // Base score
  
  // GitHub activity bonus
  if (githubInsights.activityLevel === 'high') score += 15;
  else if (githubInsights.activityLevel === 'medium') score += 10;
  
  // Repository quality bonus
  if (githubInsights.totalStars > 50) score += 10;
  else if (githubInsights.totalStars > 10) score += 5;
  
  // Technology diversity bonus
  if (githubInsights.languages.length > 5) score += 5;
  else if (githubInsights.languages.length > 3) score += 3;
  
  // Penalty for skill gaps
  score -= skillGaps.length * 2;
  
  // Penalty for improvement areas
  score -= improvementAreas.length * 3;
  
  return Math.max(0, Math.min(100, score));
}

// Identify strengths
function identifyStrengths(githubInsights: GitHubInsights, resumeData: any): string[] {
  const strengths: string[] = [];
  
  if (githubInsights.activityLevel === 'high') {
    strengths.push('Consistent GitHub activity and contributions');
  }
  
  if (githubInsights.totalStars > 20) {
    strengths.push('Projects with community recognition');
  }
  
  if (githubInsights.languages.length > 3) {
    strengths.push('Diverse technology stack');
  }
  
  if (resumeData.skills.length > 15) {
    strengths.push('Comprehensive skill set');
  }
  
  if (resumeData.experience.length > 2) {
    strengths.push('Solid work experience');
  }
  
  return strengths;
}

// Identify weaknesses
function identifyWeaknesses(githubInsights: GitHubInsights, skillGaps: SkillGap[]): string[] {
  const weaknesses: string[] = [];
  
  if (githubInsights.activityLevel === 'low') {
    weaknesses.push('Limited recent GitHub activity');
  }
  
  if (githubInsights.totalStars < 5) {
    weaknesses.push('Projects lack community engagement');
  }
  
  if (skillGaps.length > 3) {
    weaknesses.push('Missing high-demand skills');
  }
  
  if (githubInsights.languages.length < 3) {
    weaknesses.push('Limited technology diversity');
  }
  
  return weaknesses;
}

// Generate recommendations
function generateRecommendations(
  githubInsights: GitHubInsights,
  skillGaps: SkillGap[],
  improvementAreas: ImprovementArea[]
): string[] {
  const recommendations: string[] = [];
  
  // GitHub activity recommendations
  if (githubInsights.activityLevel === 'low') {
    recommendations.push('Increase GitHub activity by committing code regularly and contributing to open source projects');
  }
  
  // Skill gap recommendations
  if (skillGaps.length > 0) {
    const topSkill = skillGaps[0];
    recommendations.push(`Learn ${topSkill.skill} to improve market competitiveness`);
  }
  
  // Repository quality recommendations
  if (githubInsights.totalStars < 10) {
    recommendations.push('Improve repository quality with better documentation and README files');
  }
  
  // Technology diversity recommendations
  if (githubInsights.languages.length < 3) {
    recommendations.push('Expand technology stack by learning new programming languages or frameworks');
  }
  
  return recommendations.slice(0, 5);
} 