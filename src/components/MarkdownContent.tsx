"use client"

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';
import Image from 'next/image';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Add IDs to headings for the table of contents
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      if (!heading.id) {
        const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
        heading.id = id;
      }
    });
  }, [content]);

  const components: Components = {
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className || !match;
      
      return isInline ? (
        <code className="bg-gray-800 text-gray-200 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      ) : (
        <div className="my-4 rounded-md overflow-auto max-w-full">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
            <code className={`language-${match[1]}`} {...props}>
              {String(children).replace(/\n$/, '')}
            </code>
          </pre>
        </div>
      );
    },
    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-6" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-5" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-4" {...props} />,
    p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-orange-600 hover:underline" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    pre: ({ node, ...props }) => (
      <pre className="my-4 bg-transparent" {...props} />
    ),
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="px-4 py-3 whitespace-nowrap" {...props} />
    ),
    img: ({ node, src, alt, ...props }) => {
      if (!src) return null;
      
      // Convert relative paths to absolute paths for public images
      const imageSrc = src.startsWith('/') ? src : `/images/${src}`;
      
      return (
        <div className="my-6 text-center">
          <Image
            src={imageSrc}
            alt={alt || ''}
            width={800}
            height={450}
            className="rounded-lg shadow-lg mx-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      );
    },
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;