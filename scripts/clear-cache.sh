#!/bin/bash

echo "🧹 Clearing Next.js cache and build artifacts..."

# Remove Next.js build directories
rm -rf .next
rm -rf out
rm -rf dist

# Remove node_modules (optional - uncomment if needed)
# echo "⚠️  Removing node_modules (this will require npm install after)"
# rm -rf node_modules

# Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force

# Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
npx next clear

echo "✅ Cache cleared successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm install (if you removed node_modules)"
echo "2. Run: npm run dev"
echo ""
echo "💡 If issues persist, try:"
echo "   - Restart your development server"
echo "   - Check browser console for errors"
echo "   - Verify all dependencies are properly installed" 