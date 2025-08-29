"use client";

import React from 'react';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  Copy,
  Check
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  hashtags?: string[];
}

export default function SocialShare({ title, url, description, hashtags = [] }: SocialShareProps) {
  const [copied, setCopied] = React.useState(false);
  
  // Debug: Log the URL to console for troubleshooting
  React.useEffect(() => {
    console.log('SocialShare URL:', url);
    console.log('SocialShare Title:', title);
  }, [url, title]);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Provide user feedback even if copying fails
      alert('Unable to copy link. Please copy it manually: ' + url);
    }
  };

  const shareData = {
    title,
    text: description || title,
    url,
  };

  const handleNativeShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const shareUrls = React.useMemo(() => ({
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}${hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }), [title, url, hashtags]);
  
  // Simple direct sharing function without preventDefault
  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const shareUrl = shareUrls[platform];
    if (typeof window !== 'undefined') {
      // Try popup first
      try {
        const popup = window.open(shareUrl, `${platform}-share`, 'width=600,height=400,scrollbars=no,resizable=yes');
        // If popup is blocked or fails, fallback to new tab
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        // Final fallback - direct navigation
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Share this article
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} className="mr-2" />
          Twitter
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} className="mr-2" />
          Facebook
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} className="mr-2" />
          LinkedIn
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check size={18} className="mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2" />
              Copy Link
            </>
          )}
        </button>

        {/* Native Share (Mobile) */}
        {typeof window !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
            aria-label="Share"
          >
            <LinkIcon size={18} className="mr-2" />
            Share
          </button>
        )}
        
        {/* Debug: Show URLs in development */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => {
              console.log('Share URLs:', shareUrls);
              alert(`URLs:\nTwitter: ${shareUrls.twitter}\nFacebook: ${shareUrls.facebook}\nLinkedIn: ${shareUrls.linkedin}`);
            }}
            className="inline-flex items-center px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors duration-200"
            aria-label="Debug URLs"
          >
            Debug
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
        Help others discover this content by sharing it on your favorite platform!
      </p>
    </div>
  );
}
