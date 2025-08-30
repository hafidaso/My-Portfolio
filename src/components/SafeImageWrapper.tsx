'use client';

import React, { Component, ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageWrapperProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string | null | undefined;
  fallbackSrc?: string;
  children?: ReactNode;
}

interface SafeImageState {
  hasError: boolean;
  imageSrc: string;
}

/**
 * Safe Image Wrapper Component that prevents React error #130 
 * by handling null/undefined values and providing fallbacks
 */
class SafeImageWrapper extends Component<SafeImageWrapperProps, SafeImageState> {
  constructor(props: SafeImageWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      imageSrc: String(props.src || props.fallbackSrc || '/images/default-post.png'),
    };
  }

  static getDerivedStateFromError(): SafeImageState | null {
    return { hasError: true, imageSrc: '/images/default-post.png' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SafeImageWrapper caught an error:', error, errorInfo);
  }

  handleImageError = () => {
    const { fallbackSrc } = this.props;
    const newSrc = fallbackSrc || '/images/default-post.png';
    
    if (this.state.imageSrc !== newSrc) {
      this.setState({ 
        hasError: false,
        imageSrc: newSrc
      });
    } else {
      this.setState({ hasError: true });
    }
  };

  render() {
    const { src, alt, fallbackSrc, children, ...imageProps } = this.props;
    const { hasError, imageSrc } = this.state;
    
    const safeAlt = String(alt || 'Image');
    
    if (hasError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      );
    }

    try {
      return (
        <Image
          {...imageProps}
          src={imageSrc}
          alt={safeAlt}
          onError={this.handleImageError}
        />
      );
    } catch (error) {
      console.error('Error rendering SafeImageWrapper:', error);
      return (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Image Error</span>
        </div>
      );
    }
  }
}

export default SafeImageWrapper;
