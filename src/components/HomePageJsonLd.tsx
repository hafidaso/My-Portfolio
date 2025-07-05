import React from 'react';
import resumeData from '@/data/resumeData.json';

export default function HomePageJsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resumeData.personalInfo.name,
    jobTitle: resumeData.personalInfo.title,
    email: resumeData.personalInfo.email,
    url: resumeData.personalInfo.website,
    sameAs: [
      resumeData.personalInfo.github,
      resumeData.personalInfo.linkedin
    ],
    image: resumeData.personalInfo.image,
    description: resumeData.personalInfo.summary,
    worksFor: {
      '@type': 'Organization',
      name: 'ePhilos AG',
      url: 'https://ephilos.de'
    },
    knowsAbout: resumeData.skills,
    address: {
      '@type': 'PostalAddress',
      addressLocality: resumeData.personalInfo.location
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${resumeData.personalInfo.name} - Portfolio`,
    description: resumeData.personalInfo.summary,
    url: resumeData.personalInfo.website,
    author: {
      '@type': 'Person',
      name: resumeData.personalInfo.name
    }
  };

  return React.createElement('div', {}, [
    React.createElement('script', {
      key: 'person-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(personSchema) }
    }),
    React.createElement('script', {
      key: 'website-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(websiteSchema) }
    })
  ]);
} 