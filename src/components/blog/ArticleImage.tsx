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
    
    return sources;
  }, [postData.image, postData.id]);
  
  // Initialize with first available source
  React.useEffect(() => {
    if (imageSources.length > 0 && !currentSrc) {
      setCurrentSrc(imageSources[0]);
    }
  }, [imageSources, currentSrc]);
  
  const handleImageError = () => {
    const currentIndex = imageSources.indexOf(currentSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < imageSources.length) {
      // Try next image source
      setCurrentSrc(imageSources[nextIndex]);
      setIsLoading(true);
    } else {
      // No more sources to try
      setImageError(true);
      setIsLoading(false);
    }
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };
  
  // Don't render anything if no image sources or all failed
  if (!currentSrc || imageError) {
    return null;
  }
  
  return (
    <div className="relative mb-8">
      {isLoading && (
        <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading image...</div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={postData.title}
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px"
        className={`rounded-lg object-cover w-full h-[400px] transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={true}
        quality={85}
        onError={handleImageError}
        onLoad={handleImageLoad}
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