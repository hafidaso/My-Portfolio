import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getAllTags } from '@/lib/markdown';
import BlogPostsList from '@/components/blog/BlogPostsList';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Tag as TagIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TagPageProps {
  params: { tag: string };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = params;
  const posts = await getSortedPostsData();
  const tagPosts = posts.filter(post => post.tags.includes(tag));
  
  if (tagPosts.length === 0) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `Articles tagged with "${tag}" - Hafida Belayd's Blog`,
    description: `Browse all articles tagged with "${tag}" on topics including programming, AI, data science, and technology.`,
    keywords: [tag, 'blog', 'articles', 'programming', 'AI', 'technology'],
    openGraph: {
      title: `Articles tagged with "${tag}"`,
      description: `Browse all articles tagged with "${tag}" on topics including programming, AI, data science, and technology.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Articles tagged with "${tag}"`,
      description: `Browse all articles tagged with "${tag}" on topics including programming, AI, data science, and technology.`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = params;
  const posts = await getSortedPostsData();
  const tagPosts = posts.filter(post => post.tags.includes(tag));
  
  if (tagPosts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[
          { label: "Blog", href: "/blog" },
          { label: `Tag: ${tag}` }
        ]} />
        
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-lg">Back to blog</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
            <TagIcon size={32} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Articles tagged with "{tag}"
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {tagPosts.length} article{tagPosts.length === 1 ? '' : 's'} found
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <BlogPostsList posts={tagPosts} />
        </div>

        {tagPosts.length > 0 && (
          <div className="text-center mt-16">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              View All Articles
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
