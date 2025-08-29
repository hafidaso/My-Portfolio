import { getSortedPostsData } from '@/lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getSortedPostsData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.netlify.app';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hafida Belayd - Data Science & AI Blog</title>
    <description>Data Science, Python Programming, Machine Learning, and AI articles by Hafida Belayd</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${baseUrl}/og-image.png</url>
      <title>Hafida Belayd - Data Science & AI Blog</title>
      <link>${baseUrl}</link>
    </image>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/blog/${post.id}</link>
      <guid>${baseUrl}/blog/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category || 'Technology'}</category>
      ${post.tags ? post.tags.map(tag => `<category>${tag}</category>`).join('') : ''}
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 