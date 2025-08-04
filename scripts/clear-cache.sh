#!/bin/bash

# Clear all cache directories
echo "🧹 Clearing all cache directories..."

# Remove Next.js build cache
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Removed .next cache"
fi

# Remove static export directory
if [ -d "out" ]; then
    rm -rf out
    echo "✅ Removed out directory"
fi

# Remove node_modules cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Removed node_modules/.cache"
fi

# Remove any other potential cache directories
if [ -d ".cache" ]; then
    rm -rf .cache
    echo "✅ Removed .cache directory"
fi

# Clear npm cache (optional, uncomment if needed)
# npm cache clean --force
# echo "✅ Cleared npm cache"

echo "🎉 Cache clearing complete!" 