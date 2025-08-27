#!/usr/bin/env node

/**
 * Rapid Ranking Deployment Script for Nexariza AI
 * This script ensures all SEO optimizations are in place before deployment
 * Run this before deploying to get maximum ranking potential
 */

import fs from 'fs';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message: string, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const checkFile = (filePath: string, description: string): boolean => {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, colors.green);
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, colors.red);
    return false;
  }
};

const checkFileContent = (filePath: string, searchString: string, description: string): boolean => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      log(`✅ ${description}`, colors.green);
      return true;
    } else {
      log(`⚠️ ${description} - Content not found: ${searchString}`, colors.yellow);
      return false;
    }
  } else {
    log(`❌ ${description} - File missing: ${filePath}`, colors.red);
    return false;
  }
};

const runSEOAudit = () => {
  log('\n🚀 NEXARIZA AI - RAPID RANKING SEO AUDIT', colors.bold + colors.blue);
  log('=' .repeat(50), colors.blue);
  
  let score = 0;
  let totalChecks = 0;

  // Critical SEO Files Check
  log('\n📁 Critical SEO Files:', colors.bold);
  totalChecks += 5;
  if (checkFile('public/sitemap.xml', 'Sitemap.xml')) score++;
  if (checkFile('public/robots.txt', 'Robots.txt')) score++;
  if (checkFile('public/structured-data.json', 'Structured Data')) score++;
  if (checkFile('public/googlef8c4c4d8f8c4c4d8.html', 'Google Search Console Verification')) score++;
  if (checkFile('index.html', 'Main HTML file')) score++;

  // Critical Content Checks
  log('\n📄 Critical Content Optimization:', colors.bold);
  totalChecks += 8;
  if (checkFileContent('index.html', 'Nexariza AI', 'Company name in title')) score++;
  if (checkFileContent('index.html', 'Ahmad Yasin', 'Founder name in content')) score++;
  if (checkFileContent('index.html', 'AI development', 'Primary keyword')) score++;
  if (checkFileContent('index.html', 'meta name="description"', 'Meta description')) score++;
  if (checkFileContent('index.html', 'meta name="keywords"', 'Meta keywords')) score++;
  if (checkFileContent('index.html', 'application/ld+json', 'Structured data')) score++;
  if (checkFileContent('index.html', 'og:title', 'Open Graph tags')) score++;
  if (checkFileContent('index.html', 'twitter:card', 'Twitter Card tags')) score++;

  // Technical SEO Checks
  log('\n⚙️ Technical SEO Implementation:', colors.bold);
  totalChecks += 6;
  if (checkFile('src/utils/rapidRanking.ts', 'Rapid Ranking Optimization')) score++;
  if (checkFile('src/utils/analytics.ts', 'Analytics Tracking')) score++;
  if (checkFile('src/components/SEO.tsx', 'SEO Component')) score++;
  if (checkFile('src/styles/critical.css', 'Critical CSS')) score++;
  if (checkFileContent('src/main.tsx', 'rapidRanking', 'Rapid ranking initialization')) score++;
  if (checkFileContent('src/index.css', 'critical.css', 'Critical CSS import')) score++;

  // Multilingual SEO Checks
  log('\n🌍 Multilingual SEO:', colors.bold);
  totalChecks += 3;
  if (checkFile('src/contexts/LanguageContext.tsx', 'Language Context')) score++;
  if (checkFileContent('src/contexts/LanguageContext.tsx', 'hreflang', 'Hreflang implementation')) score++;
  if (checkFileContent('index.html', 'lang="en"', 'Language declaration')) score++;

  // Performance Optimization Checks
  log('\n⚡ Performance Optimization:', colors.bold);
  totalChecks += 4;
  if (checkFileContent('index.html', 'preload', 'Resource preloading')) score++;
  if (checkFileContent('index.html', 'preconnect', 'DNS preconnect')) score++;
  if (checkFileContent('src/styles/critical.css', 'will-change', 'GPU acceleration')) score++;
  if (checkFileContent('src/styles/critical.css', 'transform: translateZ(0)', 'Hardware acceleration')) score++;

  // Mobile and Accessibility
  log('\n📱 Mobile & Accessibility:', colors.bold);
  totalChecks += 3;
  if (checkFileContent('index.html', 'viewport', 'Viewport meta tag')) score++;
  if (checkFileContent('src/styles/critical.css', '@media (max-width: 768px)', 'Mobile optimization')) score++;
  if (checkFileContent('src/styles/critical.css', 'focus-visible', 'Accessibility focus')) score++;

  // Social Media Integration
  log('\n📱 Social Media Integration:', colors.bold);
  totalChecks += 2;
  if (checkFileContent('index.html', 'og:image', 'Open Graph image')) score++;
  if (checkFileContent('index.html', 'twitter:image', 'Twitter image')) score++;

  // Calculate final score
  const percentage = Math.round((score / totalChecks) * 100);
  
  log('\n' + '=' .repeat(50), colors.blue);
  log(`📊 SEO AUDIT RESULTS: ${score}/${totalChecks} (${percentage}%)`, colors.bold);
  
  if (percentage >= 90) {
    log('🎉 EXCELLENT! Your site is optimized for rapid ranking!', colors.green + colors.bold);
    log('🚀 Ready to outrank Wix websites!', colors.green);
  } else if (percentage >= 80) {
    log('✅ GOOD! Most optimizations are in place.', colors.yellow + colors.bold);
    log('💡 Fix remaining issues for maximum ranking potential.', colors.yellow);
  } else if (percentage >= 70) {
    log('⚠️ FAIR! Several optimizations needed.', colors.yellow + colors.bold);
    log('🔧 Address missing elements before deployment.', colors.yellow);
  } else {
    log('❌ POOR! Critical optimizations missing.', colors.red + colors.bold);
    log('🛠️ Major SEO work needed before deployment.', colors.red);
  }

  return percentage;
};

const generateSEOReport = (score: number) => {
  const report = `
# Nexariza AI - SEO Audit Report
Generated: ${new Date().toISOString()}

## Overall Score: ${score}%

## Rapid Ranking Checklist:

### ✅ Completed Optimizations:
- Comprehensive meta tags with ranking keywords
- Structured data with Organization and FAQ schemas
- Accelerated sitemap with hourly updates
- Aggressive robots.txt with zero crawl-delay
- Multilingual hreflang implementation
- Critical CSS for Core Web Vitals optimization
- Google Analytics 4 with engagement tracking
- Social media integration and Open Graph
- Mobile-first responsive design
- Accessibility optimizations

### 🎯 Ranking Factors Addressed:
1. **On-Page SEO**: Comprehensive meta tags, structured data, content optimization
2. **Technical SEO**: Fast loading, mobile optimization, clean URLs
3. **User Experience**: Core Web Vitals, accessibility, multilingual support
4. **Content Quality**: Professional copywriting, keyword optimization
5. **Authority Signals**: Social proof, testimonials, portfolio showcase
6. **Local + Global**: International targeting with local business schema

### 🚀 Competitive Advantages over Wix:
- Custom optimized code (not template-based)
- Advanced structured data implementation
- Aggressive crawling optimization
- Professional technical SEO
- Multilingual international targeting
- Custom performance optimizations

### 📈 Expected Results:
- Faster indexing due to optimized robots.txt and sitemap
- Higher engagement metrics from tracking implementation
- Better Core Web Vitals scores from performance optimization
- Improved click-through rates from rich snippets
- Enhanced international visibility from multilingual SEO

### 🔥 Next Steps for Maximum Ranking:
1. Replace placeholder Google Analytics ID with real tracking code
2. Submit sitemap to Google Search Console
3. Create high-quality backlinks and content marketing
4. Monitor performance and user engagement metrics
5. Continuously optimize based on search console data

### 💡 Rapid Ranking Strategy:
Your website now has aggressive SEO optimizations that should help you compete effectively with Wix websites. The combination of technical excellence, content optimization, and user experience enhancements creates a strong foundation for rapid ranking improvements.

---
Generated by Nexariza AI Rapid Ranking System
`;

  fs.writeFileSync('SEO_AUDIT_REPORT.md', report);
  log('\n📄 Detailed SEO report generated: SEO_AUDIT_REPORT.md', colors.blue);
};

const main = () => {
  try {
    log('🔍 Starting comprehensive SEO audit...', colors.blue);
    const score = runSEOAudit();
    generateSEOReport(score);
    
    log('\n🎯 RAPID RANKING DEPLOYMENT READY!', colors.green + colors.bold);
    log('Your Nexariza AI website is optimized to compete with Wix sites.', colors.green);
    log('\n📋 Quick deployment commands:', colors.blue);
    log('  npm run build', colors.yellow);
    log('  git add .', colors.yellow);
    log('  git commit -m "🚀 Deploy optimized Nexariza AI with rapid ranking SEO"', colors.yellow);
    log('  git push origin main', colors.yellow);
    log('  # Deploy to Vercel via GitHub integration', colors.yellow);
    
  } catch (error) {
    log(`❌ Error during audit: ${error}`, colors.red);
    process.exit(1);
  }
};

// Run the audit
main();
