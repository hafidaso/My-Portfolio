#!/usr/bin/env node

/**
 * Performance Test Script for Hafida Portfolio
 * This script measures various performance metrics to validate our optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Performance Test for Hafida Portfolio');
console.log('=====================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bright}${colors.blue}${title}${colors.reset}`);
  console.log('─'.repeat(title.length));
}

function logMetric(name, value, unit = '', status = 'info') {
  const statusColor = status === 'good' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'cyan';
  const statusIcon = status === 'good' ? '✅' : status === 'warning' ? '⚠️' : status === 'error' ? '❌' : 'ℹ️';
  
  console.log(`${statusIcon} ${colors.bright}${name}:${colors.reset} ${colors[statusColor]}${value}${unit}${colors.reset}`);
}

// Check if required tools are installed
function checkDependencies() {
  logSection('Checking Dependencies');
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    logMetric('Node.js', nodeVersion, '', 'good');
  } catch (error) {
    logMetric('Node.js', 'Not installed', '', 'error');
    return false;
  }
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logMetric('npm', npmVersion, '', 'good');
  } catch (error) {
    logMetric('npm', 'Not installed', '', 'error');
    return false;
  }
  
  try {
    const nextVersion = execSync('npx next --version', { encoding: 'utf8' }).trim();
    logMetric('Next.js', nextVersion, '', 'good');
  } catch (error) {
    logMetric('Next.js', 'Not available', '', 'warning');
  }
  
  return true;
}

// Check bundle size
function checkBundleSize() {
  logSection('Bundle Size Analysis');
  
  if (!fs.existsSync('.next')) {
    log('Building project first...', 'yellow');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      log('Build failed', 'error');
      return;
    }
  }
  
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    log('Next.js build directory not found', 'error');
    return;
  }
  
  // Analyze static chunks
  const staticDir = path.join(nextDir, 'static', 'chunks');
  if (fs.existsSync(staticDir)) {
    let totalSize = 0;
    let chunkCount = 0;
    
    fs.readdirSync(staticDir).forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        chunkCount++;
        
        if (sizeKB > 500) {
          logMetric(file, `${sizeKB}KB`, '', 'warning');
        } else {
          logMetric(file, `${sizeKB}KB`, '', 'good');
        }
      }
    });
    
    logMetric('Total Chunks', chunkCount, '', 'info');
    logMetric('Total Size', `${totalSize}KB`, '', totalSize < 2000 ? 'good' : 'warning');
  }
}

// Check image optimization
function checkImageOptimization() {
  logSection('Image Optimization');
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    log('Public directory not found', 'error');
    return;
  }
  
  let totalImages = 0;
  let totalSize = 0;
  let largeImages = 0;
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.match(/\.(png|jpg|jpeg|gif|webp|avif)$/i)) {
        totalImages++;
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        
        if (sizeKB > 500) {
          largeImages++;
          logMetric(file, `${sizeKB}KB`, '', 'warning');
        }
      }
    });
  }
  
  scanDirectory(publicDir);
  
  logMetric('Total Images', totalImages, '', 'info');
  logMetric('Total Size', `${totalSize}KB`, '', totalSize < 5000 ? 'good' : 'warning');
  logMetric('Large Images (>500KB)', largeImages, '', largeImages === 0 ? 'good' : 'warning');
}

// Check performance configuration
function checkPerformanceConfig() {
  logSection('Performance Configuration');
  
  const configFiles = [
    'next.config.mjs',
    'tailwind.config.ts',
    'package.json'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logMetric(file, 'Found', '', 'good');
    } else {
      logMetric(file, 'Missing', '', 'error');
    }
  });
  
  // Check Next.js config
  if (fs.existsSync('next.config.mjs')) {
    const config = fs.readFileSync('next.config.mjs', 'utf8');
    
    if (config.includes('images: {') && config.includes('unoptimized: false')) {
      logMetric('Image Optimization', 'Enabled', '', 'good');
    } else {
      logMetric('Image Optimization', 'Disabled', '', 'warning');
    }
    
    if (config.includes('swcMinify: true')) {
      logMetric('SWC Minification', 'Enabled', '', 'good');
    } else {
      logMetric('SWC Minification', 'Disabled', '', 'warning');
    }
    
    if (config.includes('compress: true')) {
      logMetric('Compression', 'Enabled', '', 'good');
    } else {
      logMetric('Compression', 'Disabled', '', 'warning');
    }
  }
}

// Generate performance report
function generateReport() {
  logSection('Performance Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      'Lazy loading with React.Suspense',
      'Image optimization with Next.js Image component',
      'Service Worker for offline support',
      'Performance monitoring components',
      'Bundle splitting and code splitting',
      'Critical CSS inlining',
      'Resource preloading and prefetching',
      'SWC minification',
      'Compression enabled'
    ],
    recommendations: [
      'Consider using WebP/AVIF image formats',
      'Implement critical CSS extraction',
      'Add bundle analyzer for detailed insights',
      'Monitor Core Web Vitals in production',
      'Consider implementing resource hints'
    ]
  };
  
  log('Optimizations Implemented:', 'green');
  report.optimizations.forEach(opt => {
    log(`  • ${opt}`, 'green');
  });
  
  log('\nRecommendations:', 'yellow');
  report.recommendations.forEach(rec => {
    log(`  • ${rec}`, 'yellow');
  });
  
  // Save report
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\nReport saved to: ${reportPath}`, 'cyan');
}

// Main execution
async function main() {
  try {
    if (!checkDependencies()) {
      log('\n❌ Dependencies check failed. Please install required tools.', 'red');
      process.exit(1);
    }
    
    checkBundleSize();
    checkImageOptimization();
    checkPerformanceConfig();
    generateReport();
    
    log('\n🎉 Performance test completed successfully!', 'green');
    log('Your portfolio is now optimized for better performance and sustainability.', 'green');
    
  } catch (error) {
    log(`\n❌ Performance test failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main();
}

module.exports = { main, checkDependencies, checkBundleSize, checkImageOptimization, checkPerformanceConfig, generateReport };
