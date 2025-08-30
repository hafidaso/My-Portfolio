import { dataScienceProjectsData } from '@/data/dataScienceProjects';
import { websitesData } from '@/data/websites';
import { graphicsData } from '@/data/graphics';
import resumeData from '@/data/resumeData.json';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Knowledge base interface
export interface KnowledgeItem {
  id: string;
  type: 'project' | 'website' | 'graphic' | 'experience' | 'education' | 'skill' | 'blog_post' | 'personal_info';
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

// Personal information and summary
const personalInfo: KnowledgeItem = {
  id: 'personal-info',
  type: 'personal_info',
  title: 'Hafida Belayd - Professional Summary',
  content: `
    I am Hafida Belayd, a multidisciplinary professional specializing in data science, graphic design, video production, and web development. 
    Based in Salé, Morocco, I have a comprehensive skill set that spans both creative and technical domains.

    Professional Background:
    - Data Scientist at Yma Digital (Jan 2022 - Present)
    - Software Engineering training through alx_africa
    - Extensive experience in graphic design and creative direction
    - Proven track record in web development and WordPress customization

    Core Expertise:
    - Data Science & Analytics: Python, Machine Learning, Statistical Analysis, Power BI, Tableau
    - Creative Design: Adobe Creative Suite, Video Production, Motion Graphics, 3D Modeling (Blender)
    - Web Development: React, Next.js, WordPress, HTML/CSS, JavaScript, TypeScript
    - Languages: Arabic (Native), French (Fluent), English (Professional)

    Contact Information:
    - Email: hafidabelaidagnaoui@gmail.com
    - LinkedIn: https://www.linkedin.com/in/hafida-belayd
    - GitHub: https://github.com/hafidaso
    - Portfolio: https://hafida-belayd.me/

    I am passionate about using data-driven insights to solve real-world problems while creating visually compelling and user-friendly solutions.
  `,
  metadata: {
    location: 'Salé, Morocco',
    email: 'hafidabelaidagnaoui@gmail.com',
    linkedin: 'https://www.linkedin.com/in/hafida-belayd',
    github: 'https://github.com/hafidaso',
    website: 'https://hafida-belayd.me/',
    languages: ['Arabic', 'French', 'English']
  }
};

// Build comprehensive knowledge base
export function buildKnowledgeBase(): KnowledgeItem[] {
  const knowledgeItems: KnowledgeItem[] = [personalInfo];

  // Add data science projects
  dataScienceProjectsData.forEach(project => {
    knowledgeItems.push({
      id: `ds-project-${project.id}`,
      type: 'project',
      title: project.title,
      content: `
        Project: ${project.title}
        Category: ${project.category}
        Year: ${project.year}
        Description: ${project.description}
        Technologies: ${project.technologies.join(', ')}
        ${project.keyFindings ? `Key Findings: ${project.keyFindings.join(', ')}` : ''}
        ${project.visualizations ? `Visualizations: ${project.visualizations.join(', ')}` : ''}
        ${project.datasetSize ? `Dataset: ${project.datasetSize}` : ''}
        ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}
        ${project.liveUrl ? `Live Demo: ${project.liveUrl}` : ''}
      `,
      metadata: {
        category: project.category,
        technologies: project.technologies,
        year: project.year,
        featured: project.featured,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl
      }
    });
  });

  // Add websites
  websitesData.forEach(website => {
    knowledgeItems.push({
      id: `website-${website.id}`,
      type: 'website',
      title: website.title,
      content: `
        Website Project: ${website.title}
        Category: ${website.category}
        Year: ${website.year}
        Description: ${website.description}
        Technologies: ${website.technologies.join(', ')}
        Live URL: ${website.liveUrl}
        ${website.githubUrl ? `GitHub: ${website.githubUrl}` : ''}
      `,
      metadata: {
        category: website.category,
        technologies: website.technologies,
        year: website.year,
        featured: website.featured,
        liveUrl: website.liveUrl,
        githubUrl: website.githubUrl
      }
    });
  });

  // Add graphic design projects
  graphicsData.forEach(graphic => {
    knowledgeItems.push({
      id: `graphic-${graphic.id}`,
      type: 'graphic',
      title: graphic.title,
      content: `
        Design Project: ${graphic.title}
        Category: ${graphic.category}
        Year: ${graphic.year}
        Description: ${graphic.description}
        Behance Portfolio: ${graphic.behanceUrl}
      `,
      metadata: {
        category: graphic.category,
        year: graphic.year,
        featured: graphic.featured,
        behanceUrl: graphic.behanceUrl
      }
    });
  });

  // Add work experience
  resumeData.experience.forEach((exp, index) => {
    knowledgeItems.push({
      id: `experience-${index}`,
      type: 'experience',
      title: `${exp.position} at ${exp.company}`,
      content: `
        Position: ${exp.position}
        Company: ${exp.company}
        Duration: ${exp.startDate} - ${exp.endDate}
        Location: ${exp.location}
        Description: ${exp.description}
        Technologies: ${exp.technologies.join(', ')}
      `,
      metadata: {
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        location: exp.location,
        technologies: exp.technologies
      }
    });
  });

  // Add education
  resumeData.education.forEach((edu, index) => {
    knowledgeItems.push({
      id: `education-${index}`,
      type: 'education',
      title: `${edu.degree} from ${edu.institution}`,
      content: `
        Degree: ${edu.degree}
        Institution: ${edu.institution}
        Duration: ${edu.startDate} - ${edu.endDate}
        Description: ${edu.description}
        Technologies: ${edu.technologies.join(', ')}
      `,
      metadata: {
        institution: edu.institution,
        degree: edu.degree,
        startDate: edu.startDate,
        endDate: edu.endDate,
        technologies: edu.technologies
      }
    });
  });

  // Add skills
  resumeData.skills.forEach(skill => {
    knowledgeItems.push({
      id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      type: 'skill',
      title: skill,
      content: `
        Skill: ${skill}
        Proficiency: Professional level
        Used in various projects and professional work
      `,
      metadata: {
        skill: skill,
        category: categorizeSkill(skill)
      }
    });
  });

  return knowledgeItems;
}

// Load blog posts from the posts directory
export function loadBlogPosts(): KnowledgeItem[] {
  const blogPosts: KnowledgeItem[] = [];
  
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          
          blogPosts.push({
            id: `blog-${fileName.replace('.md', '')}`,
            type: 'blog_post',
            title: data.title || fileName.replace('.md', ''),
            content: `
              Blog Post: ${data.title}
              Date: ${data.date}
              Author: ${data.author}
              Category: ${data.category}
              Tags: ${data.tags?.join(', ') || ''}
              Description: ${data.description}
              
              Content: ${content}
            `,
            metadata: {
              date: data.date,
              author: data.author,
              category: data.category,
              tags: data.tags || [],
              description: data.description,
              fileName: fileName
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
  
  return blogPosts;
}

// Categorize skills for better organization
function categorizeSkill(skill: string): string {
  const skillLower = skill.toLowerCase();
  
  if (['python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'html', 'css', 'php', 'c'].includes(skillLower)) {
    return 'programming';
  } else if (['mysql', 'sql', 'mongodb', 'postgresql'].includes(skillLower)) {
    return 'database';
  } else if (['machine learning', 'data analysis', 'statistics', 'power bi', 'tableau', 'excel', 'data visualization'].includes(skillLower)) {
    return 'data_science';
  } else if (['adobe creative suite', 'photoshop', 'illustrator', 'video editing', 'blender', 'figma'].includes(skillLower)) {
    return 'design';
  } else if (['wordpress', 'seo', 'git', 'github', 'vs code', 'docker'].includes(skillLower)) {
    return 'tools';
  } else {
    return 'other';
  }
}

// Search knowledge base for relevant content
export function searchKnowledgeBase(query: string, knowledgeBase: KnowledgeItem[], limit: number = 5): KnowledgeItem[] {
  const queryLower = query.toLowerCase();
  const scored = knowledgeBase
    .map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      // Title matches (higher weight)
      if (titleLower.includes(queryLower)) score += 10;
      
      // Content matches
      const words = queryLower.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          if (titleLower.includes(word)) score += 5;
          if (contentLower.includes(word)) score += 1;
        }
      });
      
      // Type-specific boosts
      if (queryLower.includes('project') && item.type === 'project') score += 3;
      if (queryLower.includes('website') && item.type === 'website') score += 3;
      if (queryLower.includes('design') && item.type === 'graphic') score += 3;
      if (queryLower.includes('experience') && item.type === 'experience') score += 3;
      if (queryLower.includes('education') && item.type === 'education') score += 3;
      if (queryLower.includes('skill') && item.type === 'skill') score += 3;
      if (queryLower.includes('blog') && item.type === 'blog_post') score += 3;
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
  
  return scored;
}

// Get comprehensive context for AI prompts
export function getComprehensiveContext(): string {
  const knowledgeBase = buildKnowledgeBase();
  const blogPosts = loadBlogPosts();
  const allItems = [...knowledgeBase, ...blogPosts];
  
  // Group by type for organized context
  const context = {
    personalInfo: allItems.filter(item => item.type === 'personal_info'),
    recentProjects: allItems.filter(item => item.type === 'project' && item.metadata.featured),
    skills: allItems.filter(item => item.type === 'skill'),
    experience: allItems.filter(item => item.type === 'experience').slice(0, 3), // Recent experience
    education: allItems.filter(item => item.type === 'education'),
    websites: allItems.filter(item => item.type === 'website' && item.metadata.featured),
    graphics: allItems.filter(item => item.type === 'graphic' && item.metadata.featured)
  };
  
  return `
COMPREHENSIVE PORTFOLIO CONTEXT FOR HAFIDA BELAYD:

=== PERSONAL INFORMATION ===
${context.personalInfo.map(item => item.content).join('\n')}

=== FEATURED DATA SCIENCE PROJECTS ===
${context.recentProjects.map(item => item.content).join('\n\n')}

=== RECENT WORK EXPERIENCE ===
${context.experience.map(item => item.content).join('\n\n')}

=== CORE SKILLS ===
${context.skills.slice(0, 20).map(item => item.title).join(', ')}

=== FEATURED WEBSITES ===
${context.websites.map(item => item.content).join('\n\n')}

=== FEATURED DESIGN WORK ===
${context.graphics.map(item => item.content).join('\n\n')}

=== EDUCATION ===
${context.education.map(item => item.content).join('\n\n')}
  `.trim();
}

// Get all knowledge base items
export function getAllKnowledgeItems(): KnowledgeItem[] {
  const knowledgeBase = buildKnowledgeBase();
  const blogPosts = loadBlogPosts();
  return [...knowledgeBase, ...blogPosts];
}
