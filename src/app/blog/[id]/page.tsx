import { getSortedPostsData, getPostData } from '@/lib/markdown';

// export const dynamic = 'force-static'

// Generate static params for all blog posts
import { getAllPostIds } from '@/lib/markdown';

export async function generateStaticParams() {
  try {
    const postIds = await getAllPostIds();
    console.log('generateStaticParams: Generated post IDs:', postIds);
    return postIds;
  } catch (error) {
    console.error('generateStaticParams: Error generating post IDs:', error);
    return [];
  }
}

import BlogCTAs from '@/components/blog/BlogCTAs';
import BackToTop from '@/components/blog/BackToTop';

import Image from "next/image";
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import BlogPostJsonLd from '@/components/BlogPostJsonLd';
import ReadingProgress from '@/components/blog/ReadingProgress';
import RelatedPosts from '@/components/blog/RelatedPosts';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import heroImage from "@/assets/hafida.jpeg";
import ArticleImage from '@/components/blog/ArticleImage';

// Use the same params type for metadata generation
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const { id } = params;
  const postData = await getPostData(id);
  
  if (!postData) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: postData.title,
    description: postData.description,
    keywords: [
      ...postData.tags || [],
      "Data Science",
      "Python",
      "Machine Learning",
      "AI",
      "Data Analysis",
      "Blog Post",
      "Hafida Belayd"
    ],
    authors: [{ name: postData.author }],
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: 'article',
      url: `https://hafida-belayd.netlify.app/blog/${id}`,
      images: [
        {
          url: `/images/${id}.png`,
          width: 1200,
          height: 630,
          alt: postData.title,
        },
      ],
      publishedTime: postData.date,
      modifiedTime: postData.date,
      authors: [postData.author],
      siteName: 'Hafida Belayd Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.description,
      images: [`/images/${id}.png`],
      creator: '@hafidaso',
    },
  };
}

async function getAllPostsForRelated(currentPostId: string) {
  try {
    const allPosts = await getSortedPostsData();
    // Return all posts except the current one - let RelatedPosts component handle the logic
    return allPosts.filter(post => post.id !== currentPostId);
  } catch (error) {
    console.error('Error getting posts for related articles:', error);
    return [];
  }
}

// Add searchParams parameter to match Next.js expectations
export default async function BlogPost({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams?: Record<string, string | string[]>
}) {
  try {
    const { id } = params;
    console.log(`Attempting to load post with ID: ${id}`);
    
    const postData = await getPostData(id);
    console.log(`Post data loaded:`, postData ? 'Success' : 'Failed');

    if (!postData) {
      console.error(`Post data not found for ID: ${id}`);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The blog post you're looking for doesn't exist.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      );
    }

    console.log(`Post title: ${postData.title}`);
    console.log(`Post category: ${postData.category}`);
    console.log(`Post tags: ${postData.tags.join(', ')}`);

    const allPostsForRelated = await getAllPostsForRelated(id);
    console.log(`Posts available for related articles: ${allPostsForRelated.length} posts`);

  return (
    <>
      <ReadingProgress />
      <BlogPostJsonLd post={postData} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: "Blog", href: "/blog" },
          { label: postData.title }
        ]} />
      <Link href="/blog" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 transition-colors duration-200">
        <ArrowLeft size={20} className="mr-2" />
        <span className="text-lg">Back to blog</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div className="max-w-3xl mx-auto lg:mx-0 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">{postData.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-8 space-x-4">
            <span className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {postData.date}
            </span>
            <span className="flex items-center">
              <Clock size={16} className="mr-2" />
              {postData.readTime}
            </span>
            <span className="flex items-center">
              <Tag size={16} className="mr-2" />
              {postData.category}
            </span>
            <span className="flex items-center">
              <User size={16} className="mr-2" />
              {postData.author}
            </span>
          </div>
          {/* Article Image */}
          <ArticleImage postData={postData} />
          
          {/* Table of Contents - Mobile and tablet only */}
          <div className="block lg:hidden mb-8">
            <TableOfContents className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm" />
          </div>
          
          <article className="overflow-hidden">
            <MarkdownContent content={postData.content} />



            {/* Strategic CTAs */}
            <BlogCTAs 
              category={postData.category}
              tags={postData.tags}
            />

            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-12">
                {postData.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors duration-200 cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <RelatedPosts currentPost={postData} allPosts={allPostsForRelated} />
            </div>
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">About the Author</h3>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <Image
                  src={heroImage}
                  alt={postData.author}
                  width={80}
                  height={80}
                  sizes="80px"
                  className="rounded-full mr-6"
                  quality={85}
                />
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{postData.author}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    A passionate Data Analyst and technologist exploring the intersections of data and creativity.
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16">
              <NewsletterSignup />
            </div>
          </article>
        </div>
        
        {/* Sidebar with Table of Contents - Desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm" />
          </div>
        </aside>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
    </>
  );
  } catch (error) {
    console.error(`Error rendering blog post:`, error);
    // Return a more graceful error page instead of throwing
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're having trouble loading this blog post. Please try again later.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}