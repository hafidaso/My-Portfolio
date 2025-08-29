import resumeData from '@/data/resumeData.json';

export interface ProjectRecommendation {
  project: any;
  score: number;
  reason: string;
  technologies: string[];
}

export interface TechnologyRecommendation {
  technology: string;
  score: number;
  reason: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'other';
}

// Project similarity scoring
function calculateProjectSimilarity(userQuery: string, project: any): number {
  const query = userQuery.toLowerCase();
  let score = 0;
  
  // Check project name
  if (project.name.toLowerCase().includes(query)) {
    score += 0.4;
  }
  
  // Check project description
  if (project.description.toLowerCase().includes(query)) {
    score += 0.3;
  }
  
  // Check technologies
  const techMatch = project.technologies.some((tech: string) => 
    tech.toLowerCase().includes(query)
  );
  if (techMatch) {
    score += 0.3;
  }
  
  return score;
}

// Technology similarity scoring
function calculateTechnologySimilarity(userQuery: string, technology: string): number {
  const query = userQuery.toLowerCase();
  const tech = technology.toLowerCase();
  
  if (tech.includes(query) || query.includes(tech)) {
    return 0.8;
  }
  
  // Check for related technologies
  const relatedTechs: { [key: string]: string[] } = {
    'react': ['next.js', 'vue', 'angular', 'svelte'],
    'next.js': ['react', 'vue', 'angular', 'svelte'],
    'node.js': ['express', 'fastify', 'koa', 'deno'],
    'python': ['django', 'flask', 'fastapi', 'pandas'],
    'javascript': ['typescript', 'react', 'vue', 'node.js'],
    'typescript': ['javascript', 'react', 'vue', 'node.js'],
    'mysql': ['postgresql', 'mongodb', 'sqlite', 'redis'],
    'mongodb': ['mysql', 'postgresql', 'sqlite', 'redis'],
    'docker': ['kubernetes', 'docker-compose', 'rancher'],
    'git': ['github', 'gitlab', 'bitbucket', 'gitflow'],
  };
  
  const related = relatedTechs[tech] || [];
  if (related.some(rt => rt.includes(query) || query.includes(rt))) {
    return 0.6;
  }
  
  return 0;
}

// Get project recommendations based on user query
export function getProjectRecommendations(userQuery: string, limit: number = 3): ProjectRecommendation[] {
  const projects = resumeData.projects;
  const recommendations: ProjectRecommendation[] = [];
  
  for (const project of projects) {
    const score = calculateProjectSimilarity(userQuery, project);
    
    if (score > 0) {
      let reason = '';
      if (project.name.toLowerCase().includes(userQuery.toLowerCase())) {
        reason = `Project name matches "${userQuery}"`;
      } else if (project.description.toLowerCase().includes(userQuery.toLowerCase())) {
        reason = `Project description mentions "${userQuery}"`;
      } else {
        reason = `Uses technologies related to "${userQuery}"`;
      }
      
      recommendations.push({
        project,
        score,
        reason,
        technologies: project.technologies
      });
    }
  }
  
  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get technology recommendations based on user query
export function getTechnologyRecommendations(userQuery: string, limit: number = 5): TechnologyRecommendation[] {
  const allTechnologies = resumeData.skills;
  const recommendations: TechnologyRecommendation[] = [];
  
  // Technology categories
  const categories: { [key: string]: 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'other' } = {
    'react': 'frontend',
    'next.js': 'frontend',
    'vue': 'frontend',
    'angular': 'frontend',
    'svelte': 'frontend',
    'html5': 'frontend',
    'css3': 'frontend',
    'tailwind css': 'frontend',
    'bootstrap': 'frontend',
    'javascript': 'frontend',
    'typescript': 'frontend',
    'node.js': 'backend',
    'express.js': 'backend',
    'php': 'backend',
    'laravel': 'backend',
    'python': 'backend',
    'django': 'backend',
    'flask': 'backend',
    'fastapi': 'backend',
    'mysql': 'database',
    'mongodb': 'database',
    'postgresql': 'database',
    'sqlite': 'database',
    'redis': 'database',
    'git': 'devops',
    'docker': 'devops',
    'kubernetes': 'devops',
    'ci/cd': 'devops',
    'jest': 'devops',
    'openai': 'ai',
    'langchain': 'ai',
    'tensorflow': 'ai',
    'pytorch': 'ai',
    'scikit-learn': 'ai',
  };
  
  for (const tech of allTechnologies) {
    const score = calculateTechnologySimilarity(userQuery, tech);
    
    if (score > 0) {
      const category = categories[tech.toLowerCase()] || 'other';
      let reason = '';
      
      if (tech.toLowerCase().includes(userQuery.toLowerCase())) {
        reason = `Direct match with "${userQuery}"`;
      } else {
        reason = `Related to "${userQuery}"`;
      }
      
      recommendations.push({
        technology: tech,
        score,
        reason,
        category
      });
    }
  }
  
  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get personalized recommendations based on user interaction history
export function getPersonalizedRecommendations(
  interactionHistory: string[], 
  userPreferences: string[] = []
): { projects: ProjectRecommendation[], technologies: TechnologyRecommendation[] } {
  const allInteractions = [...interactionHistory, ...userPreferences];
  const query = allInteractions.join(' ').toLowerCase();
  
  // Extract key terms from interactions
  const keyTerms = extractKeyTerms(allInteractions);
  
  const projectRecommendations: ProjectRecommendation[] = [];
  const technologyRecommendations: TechnologyRecommendation[] = [];
  
  // Get recommendations for each key term
  for (const term of keyTerms) {
    const projects = getProjectRecommendations(term, 2);
    const technologies = getTechnologyRecommendations(term, 3);
    
    projectRecommendations.push(...projects);
    technologyRecommendations.push(...technologies);
  }
  
  // Remove duplicates and sort
  const uniqueProjects = removeDuplicateProjects(projectRecommendations);
  const uniqueTechnologies = removeDuplicateTechnologies(technologyRecommendations);
  
  return {
    projects: uniqueProjects.slice(0, 3),
    technologies: uniqueTechnologies.slice(0, 5)
  };
}

// Extract key terms from user interactions
function extractKeyTerms(interactions: string[]): string[] {
  const terms = new Set<string>();
  
  for (const interaction of interactions) {
    const words = interaction.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (word.length > 2 && !isStopWord(word)) {
        terms.add(word);
      }
    }
  }
  
  return Array.from(terms);
}

// Check if a word is a stop word
function isStopWord(word: string): boolean {
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ];
  
  return stopWords.includes(word);
}

// Remove duplicate projects
function removeDuplicateProjects(recommendations: ProjectRecommendation[]): ProjectRecommendation[] {
  const seen = new Set<string>();
  return recommendations.filter(rec => {
    if (seen.has(rec.project.name)) {
      return false;
    }
    seen.add(rec.project.name);
    return true;
  });
}

// Remove duplicate technologies
function removeDuplicateTechnologies(recommendations: TechnologyRecommendation[]): TechnologyRecommendation[] {
  const seen = new Set<string>();
  return recommendations.filter(rec => {
    if (seen.has(rec.technology)) {
      return false;
    }
    seen.add(rec.technology);
    return true;
  });
} 