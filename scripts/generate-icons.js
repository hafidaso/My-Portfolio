#!/usr/bin/env node

/**
 * Icon Generation Script
 * 
 * This script provides guidance on creating the missing icon files for your portfolio.
 * 
 * MISSING ICONS TO CREATE:
 * - /public/icons/icon-16x16.png
 * - /public/icons/icon-32x32.png  
 * - /public/icons/icon-72x72.png
 * - /public/icons/icon-96x96.png
 * - /public/icons/icon-128x128.png
 * - /public/icons/icon-144x144.png
 * - /public/icons/icon-152x152.png
 * - /public/icons/icon-192x192.png
 * - /public/icons/icon-384x384.png
 * - /public/icons/icon-512x512.png
 * 
 * HOW TO CREATE ICONS:
 * 
 * Option 1: Use Online Icon Generators
 * - https://favicon.io/ (recommended)
 * - https://realfavicongenerator.net/
 * - https://www.favicon-generator.org/
 * 
 * Option 2: Use Design Software
 * - Figma (free)
 * - Canva (free)
 * - Adobe Illustrator
 * - GIMP (free)
 * 
 * Option 3: Use Command Line Tools
 * - ImageMagick: convert logo.png -resize 16x16 icon-16x16.png
 * - GraphicsMagick: gm convert logo.png -resize 16x16 icon-16x16.png
 * 
 * ICON DESIGN TIPS:
 * - Use your initials "HB" or a simple logo
 * - Keep it simple and recognizable at small sizes
 * - Use high contrast colors
 * - Test how it looks at 16x16 pixels
 * - Ensure it's readable on both light and dark backgrounds
 * 
 * RECOMMENDED ICON CONTENT:
 * - Your initials "HB" in a modern font
 * - A simple geometric shape with your initials
 * - Your logo if you have one
 * - A data/tech related symbol (graphs, charts, etc.)
 */

const fs = require('fs');
const path = require('path');

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

console.log('🎨 Icon Generation Guide for Hafida Belayd Portfolio');
console.log('==================================================\n');

// Check which icons are missing
console.log('📋 Missing Icon Files:');
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  if (!fs.existsSync(iconPath)) {
    console.log(`   ❌ icon-${size}x${size}.png`);
  } else {
    console.log(`   ✅ icon-${size}x${size}.png`);
  }
});

console.log('\n🚀 Quick Start Options:');
console.log('1. Visit https://favicon.io/ and upload your logo');
console.log('2. Download the generated icon pack');
console.log('3. Place the PNG files in /public/icons/ directory');
console.log('4. Restart your development server');

console.log('\n💡 Alternative: Use your existing favicon.ico');
console.log('   - Copy favicon.ico to /public/icons/icon-16x16.png');
console.log('   - Copy favicon.ico to /public/icons/icon-32x32.png');
console.log('   - And so on for other sizes...');

console.log('\n🔧 After creating icons:');
console.log('   npm run dev-clean');
console.log('   # or');
console.log('   npm run clear-cache && npm run dev');

console.log('\n✨ Your portfolio will look much more professional with proper icons!'); 