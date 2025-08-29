import React from 'react';
import Head from 'next/head';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

export default function SEOOptimizer({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
}: SEOOptimizerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.netlify.app';
  const defaultImage = `${baseUrl}/og-image.png`;
  const defaultTitle = 'Hafida Belayd - Data Analyst & AI Specialist';
  const defaultDescription = 'Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization.';

  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url || baseUrl;
  const metaCanonical = canonical || metaUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author || 'Hafida Belayd'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaCanonical} />
      
      {/* Robots Meta */}
      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {!noindex && !nofollow && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Hafida Belayd Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:creator" content="@hafidaso" />
      <meta name="twitter:site" content="@hafidaso" />
      
      {/* Article Specific Meta Tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#f97316" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Hafida Portfolio" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Structured Data for Rich Snippets */}
      {type === 'article' && publishedTime && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metaTitle,
              description: metaDescription,
              image: metaImage,
              author: {
                '@type': 'Person',
                name: author || 'Hafida Belayd',
                url: baseUrl
              },
              publisher: {
                '@type': 'Organization',
                name: 'Hafida Belayd Portfolio',
                url: baseUrl
              },
              datePublished: publishedTime,
              dateModified: modifiedTime || publishedTime,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': metaUrl
              }
            })
          }}
        />
      )}
    </Head>
  );
} 