import React from 'react';
import resumeData from '@/data/resumeData.json';

export default function HomePageJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.me/';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resumeData.personalInfo.name,
    jobTitle: 'Data Analyst & AI Specialist',
    email: resumeData.personalInfo.email,
    url: resumeData.personalInfo.website,
    sameAs: [
      resumeData.personalInfo.github,
      resumeData.personalInfo.linkedin
    ],
    image: resumeData.personalInfo.image,
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
    worksFor: {
      '@type': 'Organization',
      name: 'ePhilos AG',
      url: 'https://ephilos.de'
    },
    knowsAbout: resumeData.skills,
    address: {
      '@type': 'PostalAddress',
      addressLocality: resumeData.personalInfo.location,
      addressCountry: 'MA'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'University',
      url: 'https://university.edu'
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Data Analyst & AI Specialist',
      occupationLocation: {
        '@type': 'Place',
        name: 'Morocco'
      }
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hafida Belayd — Data Analyst & AI Specialist Portfolio',
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
    url: resumeData.personalInfo.website,
    author: {
      '@type': 'Person',
      name: resumeData.personalInfo.name
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hafida Belayd — Data Analyst & AI Specialist Portfolio',
    url: baseUrl,
    logo: `${baseUrl}/icons/icon-512x512.png`,
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
    founder: {
      '@type': 'Person',
      name: resumeData.personalInfo.name
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: resumeData.personalInfo.email
    },
    sameAs: [
      resumeData.personalInfo.github,
      resumeData.personalInfo.linkedin
    ]
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
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Hafida Belayd offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hafida Belayd offers data analysis, machine learning, AI development, Power BI dashboards, and data visualization services as a Data Analyst & AI Specialist.'
        }
      },
      {
        '@type': 'Question',
        name: 'What technologies does Hafida Belayd work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Python, Machine Learning, Power BI, SQL, React, Next.js, and various data science and AI frameworks.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is Hafida Belayd located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hafida Belayd is based in Morocco and works with clients globally.'
        }
      }
    ]
  };

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Hafida Belayd — Data Analyst & AI Specialist Portfolio',
    author: {
      '@type': 'Person',
      name: resumeData.personalInfo.name
    },
    dateCreated: '2024',
    dateModified: new Date().toISOString(),
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
    genre: 'Portfolio',
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/'
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
    }),
    React.createElement('script', {
      key: 'organization-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(organizationSchema) }
    }),
    React.createElement('script', {
      key: 'breadcrumb-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(breadcrumbSchema) }
    }),
    React.createElement('script', {
      key: 'faq-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(faqSchema) }
    }),
    React.createElement('script', {
      key: 'creative-work-schema',
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(creativeWorkSchema) }
    })
  ]);
} 