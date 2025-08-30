"use client";

import React from "react";
import Image from "next/image";

interface ArticleImageProps {
  postData: {
    id: string;
    title: string;
    image?: string;
  };
}

export default function ArticleImage({ postData }: ArticleImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string>("");
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Define possible image sources in order of priority
  const imageSources = React.useMemo(() => {
    const sources = [];
    
    // 1. Use explicit image from frontmatter if available
    if (postData.image) {
      sources.push(postData.image);
    }
    
    // 2. Try common image formats based on post ID
    sources.push(
      `/images/${postData.id}.png`,
      `/images/${postData.id}.jpg`,
      `/images/${postData.id}.jpeg`,
      `/images/${postData.id}.webp`,
      `/images/${postData.id}.gif`
    );
    
    console.log(`ArticleImage: Available sources for ${postData.id}:`, sources);
    return sources;
  }, [postData.image, postData.id]);
  
  // Initialize with first available source
  React.useEffect(() => {
    if (imageSources.length > 0 && !currentSrc) {
      console.log(`ArticleImage: Setting initial source to: ${imageSources[0]}`);
      setCurrentSrc(imageSources[0]);
    }
  }, [imageSources, currentSrc]);
  
  const handleImageError = () => {
    const currentIndex = imageSources.indexOf(currentSrc);
    const nextIndex = currentIndex + 1;
    
    console.log(`ArticleImage: Error loading ${currentSrc}, trying next source (${nextIndex}/${imageSources.length})`);
    
    if (nextIndex < imageSources.length) {
      // Try next image source
      setCurrentSrc(imageSources[nextIndex]);
      setIsLoading(true);
      setImageError(false);
    } else {
      // No more sources to try
      console.log(`ArticleImage: All sources failed for ${postData.id}`);
      setImageError(true);
      setIsLoading(false);
    }
  };
  
  const handleImageLoad = () => {
    console.log(`ArticleImage: Successfully loaded ${currentSrc}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  // Show a placeholder or fallback when all images fail
  if (!currentSrc || (imageError && imageSources.indexOf(currentSrc) >= imageSources.length - 1)) {
    console.log(`ArticleImage: No image available for ${postData.id}, showing fallback`);
    return (
      <div className="relative mb-8">
        <div className="w-full h-[400px] bg-gradient-to-r from-orange-100 to-purple-100 dark:from-orange-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium">{postData.title}</p>
            <p className="text-xs mt-1 opacity-70">Featured Image</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative mb-8">
      {isLoading && (
        <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-sm mt-2">Loading image...</p>
          </div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={postData.title}
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px"
        className={`rounded-lg object-cover w-full h-[400px] transition-opacity duration-300 ${
          isLoading ? 'opacity-0 absolute' : 'opacity-100'
        }`}
        priority={true}
        quality={85}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={false}
      />
      
      {/* Image caption */}
      {!isLoading && !imageError && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {postData.title}
        </p>
      )}
    </div>
  );
} 