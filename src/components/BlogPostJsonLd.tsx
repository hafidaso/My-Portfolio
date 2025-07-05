import React from 'react';
import resumeData from '@/data/resumeData.json';

interface BlogPostJsonLdProps {
  post: {
    id: string;
    title: string;
    description: string;
    date: string;
    author: string;
  };
}

export default function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medevs.xyz';
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${baseUrl}/images/${post.id}.png`,
    author: {
      '@type': 'Person',
      name: post.author,
      url: resumeData.personalInfo.website
    },
    publisher: {
      '@type': 'Organization',
      name: resumeData.personalInfo.name,
      url: resumeData.personalInfo.website
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.id}`
    }
  };

  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(articleSchema) }
  });
} 