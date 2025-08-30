import React from 'react';
import resumeData from '@/data/resumeData.json';
import { safeJsonStringify } from '@/lib/json-serializer';

interface BlogPostJsonLdProps {
  post: {
    id: string;
    title: string;
    description: string;
    date: string;
    author: string;
    category?: string;
    tags?: string[];
    readTime?: string;
  };
}

export default function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.me/';
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${baseUrl}/images/${post.id}.png`,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: 'Data Analyst & AI Specialist',
      url: resumeData.personalInfo.website,
      sameAs: [
        resumeData.personalInfo.github,
        resumeData.personalInfo.linkedin
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hafida Belayd — Data Analyst & AI Specialist',
      url: resumeData.personalInfo.website,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.png`
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.id}`
    },
    articleSection: post.category || 'Technology',
    keywords: post.tags?.join(', ') || 'Data Science, Python, Machine Learning',
    wordCount: post.description.length * 5, // Estimate
    timeRequired: post.readTime || '5 min read',
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'h3', 'p']
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.id}`
      }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: post.title,
    description: post.description,
    url: `${baseUrl}/blog/${post.id}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Hafida Belayd — Data Analyst & AI Specialist Portfolio',
      url: baseUrl
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${baseUrl}/blog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${baseUrl}/blog/${post.id}`
        }
      ]
    },
    mainEntity: {
      '@type': 'Article',
      headline: post.title,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: 'Data Analyst & AI Specialist'
      },
      datePublished: post.date,
      dateModified: post.date
    }
  };

  return React.createElement('div', {}, [
    React.createElement('script', {
      key: 'article-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: safeJsonStringify(articleSchema) }
    }),
    React.createElement('script', {
      key: 'breadcrumb-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: safeJsonStringify(breadcrumbSchema) }
    }),
    React.createElement('script', {
      key: 'webpage-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: safeJsonStringify(webPageSchema) }
    })
  ]);
} 