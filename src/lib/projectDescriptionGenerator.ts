import { githubService } from './github';
import { PromptTemplate } from "@langchain/core/prompts";
import { getOllamaModel, generateResponse } from "@/lib/freeAIService";

export interface GeneratedProjectDescription {
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  highlights: string[];
  readme: string;
}

export interface RepositoryAnalysis {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  readme: string;
  files: string[];
  dependencies: string[];
  lastUpdated: string;
}

// Analyze a GitHub repository to extract information
export async function analyzeRepository(owner: string, repoName: string): Promise<RepositoryAnalysis> {
  try {
    // Get repository data
    const repo = await githubService.octokit.repos.get({ owner, repo: repoName });
    const repoData = repo.data;
    
    // Get repository topics
    const topics = await githubService.octokit.repos.getAllTopics({ owner, repo: repoName });
    
    // Get README content
    let readme = '';
    try {
      const readmeResponse = await githubService.octokit.repos.getReadme({ owner, repo: repoName });
      readme = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.warn(`No README found for ${owner}/${repoName}`);
    }
    
         // Get repository files (top level)
     let files: string[] = [];
     try {
       const contents = await githubService.octokit.repos.getContent({ owner, repo: repoName, path: '' });
       if (Array.isArray(contents.data)) {
         files = contents.data.map(item => item.name);
       }
     } catch (error) {
       console.warn(`Could not fetch files for ${owner}/${repoName}`);
     }
    
    // Extract dependencies from package.json if it exists
    let dependencies: string[] = [];
    if (files.includes('package.json')) {
      try {
        const packageJson = await githubService.octokit.repos.getContent({ 
          owner, 
          repo: repoName, 
          path: 'package.json' 
        });
                 if (!Array.isArray(packageJson.data) && 'content' in packageJson.data) {
           const content = Buffer.from(packageJson.data.content, 'base64').toString('utf-8');
           const pkg = JSON.parse(content);
           dependencies = [
             ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
             ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : [])
           ];
         }
      } catch (error) {
        console.warn(`Could not parse package.json for ${owner}/${repoName}`);
      }
    }
    
    return {
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      topics: topics.data.names || [],
      readme,
      files,
      dependencies,
      lastUpdated: repoData.updated_at
    };
  } catch (error) {
    console.error(`Error analyzing repository ${owner}/${repoName}:`, error);
    throw error;
  }
}

// Generate project description using AI
export async function generateProjectDescription(
  repositoryAnalysis: RepositoryAnalysis,
  targetLanguage: string = 'en'
): Promise<GeneratedProjectDescription> {
  try {
    const model = getOllamaModel();
    
    if (model) {
      const promptTemplate = PromptTemplate.fromTemplate(`
        You are an expert technical writer and developer. Generate a comprehensive project description for a GitHub repository.
        
        ## Repository Information:
        - Name: {name}
        - Description: {description}
        - Primary Language: {language}
        - Stars: {stars}
        - Forks: {forks}
        - Topics: {topics}
        - Files: {files}
        - Dependencies: {dependencies}
        - README Content: {readme}
        
        ## Requirements:
        1. Generate a compelling project title (max 60 characters)
        2. Write a detailed description (2-3 sentences)
        3. List 3-5 key features
        4. Identify the main technologies used
        5. Highlight 2-3 impressive aspects
        6. Create a professional README section
        
        ## Guidelines:
        - Be professional and engaging
        - Focus on the value and functionality
        - Use technical but accessible language
        - Highlight unique aspects
        - Make it appealing to potential employers or collaborators
        
        ## Output Format (JSON):
        {{
          "title": "Project Title",
          "description": "Detailed project description...",
          "features": ["Feature 1", "Feature 2", "Feature 3"],
          "technologies": ["Tech 1", "Tech 2", "Tech 3"],
          "highlights": ["Highlight 1", "Highlight 2"],
          "readme": "Professional README content..."
        }}
        
        Generate the response in {targetLanguage} language.
      `);

      const chain = promptTemplate.pipe(model);
      
      const response = await chain.invoke({
        name: repositoryAnalysis.name,
        description: repositoryAnalysis.description,
        language: repositoryAnalysis.language,
        stars: repositoryAnalysis.stars,
        forks: repositoryAnalysis.forks,
        topics: repositoryAnalysis.topics.join(', '),
        files: repositoryAnalysis.files.join(', '),
        dependencies: repositoryAnalysis.dependencies.join(', '),
        readme: repositoryAnalysis.readme.substring(0, 1000), // Limit README content
        targetLanguage
      });

      // Parse the JSON response
      const content = response.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    // Fallback if model is not available or JSON parsing fails
    return {
      title: repositoryAnalysis.name,
      description: repositoryAnalysis.description || `A ${repositoryAnalysis.language} project with ${repositoryAnalysis.stars} stars and ${repositoryAnalysis.forks} forks.`,
      features: ['Feature extraction failed'],
      technologies: [repositoryAnalysis.language],
      highlights: [`${repositoryAnalysis.stars} stars on GitHub`],
      readme: 'README generation failed'
    };
  } catch (error) {
    console.error('Error generating project description:', error);
    
    // Fallback description
    return {
      title: repositoryAnalysis.name,
      description: repositoryAnalysis.description || `A ${repositoryAnalysis.language} project with ${repositoryAnalysis.stars} stars and ${repositoryAnalysis.forks} forks.`,
      features: ['Feature extraction failed'],
      technologies: [repositoryAnalysis.language],
      highlights: [`${repositoryAnalysis.stars} stars on GitHub`],
      readme: 'README generation failed'
    };
  }
}

// Generate descriptions for multiple repositories
export async function generateMultipleProjectDescriptions(
  repositories: Array<{ owner: string; name: string }>,
  targetLanguage: string = 'en'
): Promise<GeneratedProjectDescription[]> {
  const descriptions: GeneratedProjectDescription[] = [];
  
  for (const repo of repositories) {
    try {
      const analysis = await analyzeRepository(repo.owner, repo.name);
      const description = await generateProjectDescription(analysis, targetLanguage);
      descriptions.push(description);
    } catch (error) {
      console.error(`Failed to generate description for ${repo.owner}/${repo.name}:`, error);
    }
  }
  
  return descriptions;
}

// Generate portfolio-ready project descriptions
export async function generatePortfolioDescriptions(
  username: string,
  targetLanguage: string = 'en'
): Promise<GeneratedProjectDescription[]> {
  try {
    // Get user's repositories
    const repos = await githubService.getRepositories(username, {
      sort: 'stars',
      per_page: 10
    });
    
         // Filter repositories with some activity
     const activeRepos = repos.data.filter(repo => 
       (repo.stargazers_count || 0) > 0 || (repo.forks_count || 0) > 0 || repo.description
     );
    
    // Generate descriptions for top repositories
    const descriptions = await generateMultipleProjectDescriptions(
      activeRepos.map(repo => ({ owner: username, name: repo.name })),
      targetLanguage
    );
    
    return descriptions;
  } catch (error) {
    console.error('Error generating portfolio descriptions:', error);
    return [];
  }
}

// Enhance existing project descriptions
export async function enhanceProjectDescription(
  existingDescription: string,
  repositoryAnalysis: RepositoryAnalysis,
  targetLanguage: string = 'en'
): Promise<string> {
  try {
    const model = getOllamaModel();
    
    if (model) {
      const promptTemplate = PromptTemplate.fromTemplate(`
        You are an expert technical writer. Enhance the following project description with additional insights from the repository analysis.
        
        ## Current Description:
        {existingDescription}
        
        ## Repository Analysis:
        - Language: {language}
        - Stars: {stars}
        - Forks: {forks}
        - Topics: {topics}
        - Dependencies: {dependencies}
        - Recent Activity: {lastUpdated}
        
        ## Task:
        Enhance the description by:
        1. Adding technical details about the implementation
        2. Highlighting community engagement (stars/forks)
        3. Mentioning key technologies and dependencies
        4. Making it more compelling for potential employers
        5. Keeping the original tone and style
        
        Write the enhanced description in {targetLanguage} language.
      `);

      const chain = promptTemplate.pipe(model);
      
      const response = await chain.invoke({
        existingDescription,
        language: repositoryAnalysis.language,
        stars: repositoryAnalysis.stars,
        forks: repositoryAnalysis.forks,
        topics: repositoryAnalysis.topics.join(', '),
        dependencies: repositoryAnalysis.dependencies.join(', '),
        lastUpdated: repositoryAnalysis.lastUpdated,
        targetLanguage
      });

      return response.content as string;
    }
    
    // Fallback to original description if model is not available
    return existingDescription;
  } catch (error) {
    console.error('Error enhancing project description:', error);
    return existingDescription; // Return original if enhancement fails
  }
} 