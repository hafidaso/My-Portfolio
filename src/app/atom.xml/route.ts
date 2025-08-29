import { getSortedPostsData } from '@/lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getSortedPostsData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.netlify.app';

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Hafida Belayd - Data Science & AI Blog</title>
  <subtitle>Data Science, Python Programming, Machine Learning, and AI articles by Hafida Belayd</subtitle>
  <link href="${baseUrl}" />
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${baseUrl}/atom.xml</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Hafida Belayd</name>
    <email>${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@hafida-belayd.netlify.app'}</email>
  </author>
  <icon>${baseUrl}/icons/icon-192x192.png</icon>
  <logo>${baseUrl}/og-image.png</logo>
  ${posts.map(post => `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${baseUrl}/blog/${post.id}" />
    <id>${baseUrl}/blog/${post.id}</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary><![CDATA[${post.description}]]></summary>
    <category term="${post.category || 'Technology'}" />
    ${post.tags ? post.tags.map(tag => `<category term="${tag}" />`).join('') : ''}
    <author>
      <name>Hafida Belayd</name>
    </author>
  </entry>
  `).join('')}
</feed>`;

  return new NextResponse(atom, {
    headers: {
      'Content-Type': 'application/atom+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 