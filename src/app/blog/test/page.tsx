export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Blog Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is a test page to verify blog routing is working.
        </p>
        <a 
          href="/blog" 
          className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Back to Blog
        </a>
      </div>
    </div>
  );
}
