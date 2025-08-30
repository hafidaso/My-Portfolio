"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Calendar, Clock, Tag } from 'lucide-react';
import { PostData } from '@/lib/markdown';
import SafeImageWrapper from '../SafeImageWrapper';

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
      {displayedPosts.map((post, index) => {
        // Sanitize post data to prevent React error #130
        const safePost = {
          id: String(post?.id || `post-${index}`),
          title: String(post?.title || 'Untitled Post'),
          description: String(post?.description || 'No description available'),
          date: String(post?.date || new Date().toISOString().split('T')[0]),
          readTime: String(post?.readTime || '0 min read'),
          category: String(post?.category || 'Uncategorized'),
          image: post?.image ? String(post.image) : null
        };
        
        return (
          <Link href={`/blog/${safePost.id}`} key={`blog-post-${safePost.id}-${index}`} className="group">
            <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48 w-full">
                <PostImage post={safePost} />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                  {safePost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                  {safePost.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    {safePost.date}
                  </span>
                  <span className="flex items-center mr-4">
                    <Clock size={14} className="mr-1" />
                    {safePost.readTime}
                  </span>
                  <span className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    {safePost.category}
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
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  
  // Ensure post has valid properties
  const postId = String(post?.id || 'unknown');
  const postTitle = String(post?.title || 'Untitled Post');
  const postImage = post?.image ? String(post.image) : null;
  
  const extensions = [
    postImage || `/images/${postId}.png`,
    `/images/${postId}.jpg`,
    `/images/${postId}.jpeg`,
    `/images/${postId}.webp`,
    `/images/${postId}.gif`,
  ].filter(Boolean);
  
  const currentSrc = extensions[srcIndex] || "/images/default-post.png";
  
  console.log(`PostImage: Trying source ${srcIndex + 1}/${extensions.length} for ${postId}: ${currentSrc}`);
  
  const handleImageError = () => {
    console.log(`PostImage: Error loading ${currentSrc} for ${postId}`);
    if (srcIndex < extensions.length - 1) {
      setSrcIndex(srcIndex + 1);
      setImageLoaded(false);
      setHasError(false);
    } else {
      console.log(`PostImage: All sources failed for ${postId}, showing fallback`);
      setHasError(true);
    }
  };
  
  const handleImageLoad = () => {
    console.log(`PostImage: Successfully loaded ${currentSrc} for ${postId}`);
    setImageLoaded(true);
    setHasError(false);
  };
  
  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-medium">{postTitle}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      )}
      <SafeImageWrapper
        src={currentSrc}
        alt={postTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        className={`transition-all duration-300 group-hover:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={false}
        quality={85}
        onError={handleImageError}
        onLoad={handleImageLoad}
        fallbackSrc="/images/default-post.png"
      />
    </>
  );
} 