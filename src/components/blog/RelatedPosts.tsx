"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { PostData } from '@/lib/markdown';

interface RelatedPostsProps {
  currentPost: PostData;
  allPosts: PostData[];
  maxPosts?: number;
}

export default function RelatedPosts({ currentPost, allPosts, maxPosts = 4 }: RelatedPostsProps) {
  const relatedPosts = useMemo(() => {
    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // Calculate similarity scores
    const postsWithScores = otherPosts.map(post => {
      let score = 0;
      
      // Category match (highest weight)
      if (post.category === currentPost.category) {
        score += 10;
      }
      
      // Tag matches
      const commonTags = currentPost.tags.filter(tag => post.tags.includes(tag));
      score += commonTags.length * 3;
      
      // Title similarity (simple keyword matching)
      const currentTitleWords = currentPost.title.toLowerCase().split(' ');
      const postTitleWords = post.title.toLowerCase().split(' ');
      const commonWords = currentTitleWords.filter(word => 
        postTitleWords.includes(word) && word.length > 3
      );
      score += commonWords.length * 2;
      
      return { post, score };
    });
    
    // Sort by score and return top posts
    // If no posts have a good score (>0), include recent posts anyway
    const sortedPosts = postsWithScores.sort((a, b) => b.score - a.score);
    const topPosts = sortedPosts.slice(0, maxPosts);
    
    // If we don't have enough high-scoring posts, add more recent posts
    if (topPosts.length < maxPosts && topPosts.every(item => item.score === 0)) {
      const recentPosts = otherPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, maxPosts);
      return recentPosts;
    }
    
    return topPosts.map(item => item.post);
  }, [currentPost, allPosts, maxPosts]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Related Articles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.id}`}
            className="group block"
          >
            <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={`/images/${post.id}.png`}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                  quality={85}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
} 