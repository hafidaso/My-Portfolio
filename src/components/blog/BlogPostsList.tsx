"use client";

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag } from 'lucide-react';
import { PostData } from '@/lib/markdown';

interface BlogPostsListProps {
  posts: PostData[];
}

export default function BlogPostsList({ posts }: BlogPostsListProps) {
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>(posts);

  // Update displayed posts when parent component filters
  React.useEffect(() => {
    setDisplayedPosts(posts);
  }, [posts]);

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          No articles found matching your criteria.
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Try adjusting your search terms or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {displayedPosts.map((post) => {
        // Determine image source
        let imageSrc = post.image;
        if (!imageSrc) {
          imageSrc = `/images/${post.id}.png`;
        }
        // Try .jpg if .png doesn't exist, then .gif
        // Note: In a real app, you'd check file existence dynamically or at build time.
        // Here, we can use a client-side fallback with onError, or just try .png, .jpg, .gif in order.
        // We'll use a small trick: set up an array of possible extensions and use state to swap on error.
        // For simplicity, let's use a component for this logic:
        return (
          <Link href={`/blog/${post.id}`} key={post.id} className="group">
            <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48 w-full">
                <PostImage post={post} />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center mr-4">
                    <Clock size={14} className="mr-1" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    {post.category}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}

function PostImage({ post }: { post: any }) {
  const [srcIndex, setSrcIndex] = React.useState(0);
  const extensions = [
    post.image ? null : `/images/${post.id}.png`,
    `/images/${post.id}.jpg`,
    `/images/${post.id}.gif`,
  ];
  let src = post.image || extensions[srcIndex];
  // Fallback image if all fail
  const fallback = "/images/default.png";
  return (
    <Image
      src={src}
      alt={post.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: "cover" }}
      className="transition-transform duration-300 group-hover:scale-105"
      priority={false}
      quality={85}
      onError={() => {
        if (srcIndex < extensions.length - 1) setSrcIndex(srcIndex + 1);
        else if (src !== fallback) setSrcIndex(extensions.length); // fallback
      }}
    />
  );
} 