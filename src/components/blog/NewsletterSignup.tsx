"use client";

import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For production, you would integrate with a newsletter service here
      // Examples: Mailchimp, ConvertKit, Substack, etc.
      
      setStatus('success');
      setMessage('Welcome to the newsletter! Check your email for confirmation.');
      setEmail('');
      setName('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="newsletter" className={`bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-4">
          <Mail size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Stay Updated
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Get notified about new articles, tutorials, and insights delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Mail size={16} />
              <span>Subscribe to Newsletter</span>
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
          <Check size={16} className="text-green-500" />
          <span className="text-green-700 dark:text-green-300 text-sm">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-red-700 dark:text-red-300 text-sm">{message}</span>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        No spam, unsubscribe at any time. We respect your privacy.
      </p>
    </div>
  );
} 