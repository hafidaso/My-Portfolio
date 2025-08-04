#!/usr/bin/env node

/**
 * Icon Generation Script
 * 
 * This script creates placeholder icon files for the PWA manifest.
 * In a real implementation, you would generate proper icons from your logo.
 */

const fs = require('fs');
const path = require('path');

const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 150, name: 'icon-150x150.png' },
  { size: 310, name: 'icon-310x310.png' }
];

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon as placeholder
const createSVGIcon = (size) => {
  const color = '#f97316'; // Orange color matching the theme
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.1}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">HB</text>
</svg>`;
};

// Generate icons
iconSizes.forEach(({ size, name }) => {
  const svgContent = createSVGIcon(size);
  const filePath = path.join(iconsDir, name.replace('.png', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Generated ${name.replace('.png', '.svg')} (${size}x${size})`);
});

console.log('\n🎉 Icon generation complete!');
console.log('📝 Note: These are placeholder SVG icons. For production, replace with proper PNG icons.');
console.log('💡 You can use tools like https://realfavicongenerator.net/ to generate proper icons from your logo.'); 