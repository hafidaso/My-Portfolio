import { MetadataRoute } from 'next';
import { getSortedPostsData, PostData } from '@/lib/markdown';

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.netlify.app';
  
  // Get all blog posts
  const posts = await getSortedPostsData();
  
  // Static pages with improved priorities and change frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/data-science`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/websites`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/graphics`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Blog post pages with improved priorities
  const blogPages = posts.map((post: PostData) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Additional important URLs
  const additionalPages = [
    {
      url: `${baseUrl}/rss.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/atom.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/manifest.json`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.1,
    },
  ];

  return [...staticPages, ...blogPages, ...additionalPages];
} 