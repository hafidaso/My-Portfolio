import React from 'react';
import { safeJsonStringify } from '@/lib/json-serializer';

interface ProjectJsonLdProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    githubUrl?: string;
    liveUrl?: string;
    technologies: string[];
    category: string;
    year?: number;
  };
}

export default function ProjectJsonLd({ project }: ProjectJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": project.liveUrl || project.githubUrl,
    "image": project.image ? `https://hafida-belayd.me/${project.image}` : undefined,
    "author": {
      "@type": "Person",
      "name": "Hafida Belayd",
      "url": "https://hafida-belayd.me/",
      "sameAs": [
        "https://github.com/hafidaso",
        "https://linkedin.com/in/hafida-belayd"
      ]
    },
    "dateCreated": project.year ? `${project.year}-01-01` : undefined,
    "keywords": project.technologies.join(", "),
    "genre": project.category,
    "programmingLanguage": project.technologies.filter(tech => 
      ['Python', 'JavaScript', 'TypeScript', 'SQL', 'R', 'Java', 'C++', 'HTML', 'CSS'].includes(tech)
    ),
    "runtimePlatform": project.technologies.filter(tech => 
      ['Next.js', 'React', 'Node.js', 'Django', 'Flask', 'TensorFlow', 'PyTorch'].includes(tech)
    ),
    "codeRepository": project.githubUrl,
    "applicationCategory": "DataVisualizationApplication"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
    />
  );
}
