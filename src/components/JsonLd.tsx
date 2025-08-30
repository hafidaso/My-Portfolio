import React from 'react';
import { safeJsonStringify } from '@/lib/json-serializer';

interface PersonSchema {
  name: string;
  jobTitle: string;
  email: string;
  url: string;
  sameAs: string[];
  image: string;
  description: string;
  worksFor: {
    name: string;
    url: string;
  };
  knowsAbout: string[];
}

interface ArticleSchema {
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  publisher: {
    '@type': string;
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
}

interface WebsiteSchema {
  name: string;
  description: string;
  url: string;
  author: {
    '@type': string;
    name: string;
  };
}

interface JsonLdProps {
  type: 'person' | 'article' | 'website';
  data: PersonSchema | ArticleSchema | WebsiteSchema;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'person' ? 'Person' : type === 'article' ? 'Article' : 'WebSite',
  };

  const schema = {
    ...baseSchema,
    ...data,
  };

  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: safeJsonStringify(schema) }
  });
}

// Helper functions to create specific schemas
export function createPersonSchema(data: PersonSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    email: data.email,
    url: data.url,
    sameAs: data.sameAs,
    image: data.image,
    description: data.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Salé',
      addressCountry: 'Morocco'
    },
    worksFor: {
      '@type': 'Organization',
      name: data.worksFor.name,
      url: data.worksFor.url,
    },
    knowsAbout: data.knowsAbout,
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Data Analyst',
      occupationLocation: {
        '@type': 'City',
        name: 'Casablanca-Settat'
      }
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'University of the People',
        url: 'https://www.uopeople.edu'
      },
      {
        '@type': 'EducationalOrganization',
        name: 'ExploreAI Academy',
        url: 'https://exploreaiacademy.com'
      }
    ],
  };
}

export function createArticleSchema(data: ArticleSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: data.author,
    publisher: data.publisher,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    mainEntityOfPage: data.mainEntityOfPage,
  };
}

export function createWebsiteSchema(data: WebsiteSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    description: data.description,
    url: data.url,
    author: data.author,
  };
} 