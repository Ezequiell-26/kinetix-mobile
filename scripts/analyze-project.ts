#!/usr/bin/env node

/**
 * Project Analysis Script for AI Contributors
 * Analyzes the Kinetix monorepo structure and provides insights
 * 
 * Usage: npx ts-node scripts/analyze-project.ts
 * Or:    node scripts/analyze-project.js
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileCount {
  [key: string]: number;
}

interface AnalysisResult {
  timestamp: string;
  rootPath: string;
  appsMobile: {
    files: number;
    directories: number;
    largestComponent: string;
  };
  appsWeb: {
    files: number;
    directories: number;
  };
  packagesShared: {
    exists: boolean;
    isEmpty: boolean;
  };
  statistics: {
    totalFiles: number;
    totalDirs: number;
    filesByType: FileCount;
    tsFiles: number;
    tsxFiles: number;
    cssFiles: number;
    testFiles: number;
  };
  keyFiles: {
    packageJson: boolean;
    tsconfigBase: boolean;
    prisma: boolean;
    monorepoMd: boolean;
    contributionGuide: boolean;
  };
  recommendations: string[];
}

function countFilesInDir(dir: string, extensions: string[] = []): { files: number; dirs: number } {
  try {
    if (!fs.existsSync(dir)) {
      return { files: 0, dirs: 0 };
    }

    let files = 0;
    let dirs = 0;

    const walk = (currentPath: string) => {
      try {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            dirs++;
            walk(fullPath);
          } else if (stat.isFile()) {
            if (extensions.length === 0) {
              files++;
            } else {
              const ext = path.extname(item);
              if (extensions.includes(ext)) {
                files++;
              }
            }
          }
        }
      } catch (err) {
        // Skip directories we can't read
      }
    };

    walk(currentPath);
    return { files, dirs };
  } catch (err) {
    return { files: 0, dirs: 0 };
  }
}

function getFilesByType(dir: string): FileCount {
  const counts: FileCount = {};

  const walk = (currentPath: string) => {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item) || 'no-extension';
          counts[ext] = (counts[ext] || 0) + 1;
        }
      }
    } catch (err) {
      // Skip
    }
  };

  walk(dir);
  return counts;
}

function getLargestFile(dir: string, extensions: string[] = ['.tsx', '.ts']): string {
  let largest = { size: 0, path: '' };

  const walk = (currentPath: string) => {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext) && stat.size > largest.size) {
            largest = { size: stat.size, path: fullPath.replace(currentPath, '.') };
          }
        }
      }
    } catch (err) {
      // Skip
    }
  };

  walk(dir);
  return largest.path || 'N/A';
}

function analyzeProject(): AnalysisResult {
  const rootPath = process.cwd();

  const appsMobileFiles = countFilesInDir(path.join(rootPath, 'apps/mobile'));
  const appsWebFiles = countFilesInDir(path.join(rootPath, 'apps/web'));
  const allFiles = getFilesByType(rootPath);

  const keyFiles = {
    packageJson: fs.existsSync(path.join(rootPath, 'package.json')),
    tsconfigBase: fs.existsSync(path.join(rootPath, 'tsconfig.base.json')),
    prisma: fs.existsSync(path.join(rootPath, 'apps/mobile/prisma/schema.prisma')),
    monorepoMd: fs.existsSync(path.join(rootPath, 'MONOREPO.md')),
    contributionGuide: fs.existsSync(path.join(rootPath, 'AI_CONTRIBUTION_GUIDE.md')),
  };

  const packagesSharedPath = path.join(rootPath, 'packages/shared');
  const packagesSharedEmpty =
    !fs.existsSync(packagesSharedPath) ||
    (fs.existsSync(packagesSharedPath) &&
      fs.readdirSync(packagesSharedPath).filter((f) => f !== '.gitkeep').length === 0);

  const tsFiles = (allFiles['.ts'] || 0) + (allFiles['.tsx'] || 0);
  const totalFiles = Object.values(allFiles).reduce((a, b) => a + b, 0);
  const totalDirs = appsMobileFiles.dirs + appsWebFiles.dirs;

  const recommendations: string[] = [];

  // Generate recommendations
  if (packagesSharedEmpty) {
    recommendations.push(
      '📦 packages/shared is empty - Consider consolidating shared components and utilities'
    );
  }

  if ((allFiles['.any'] || 0) > 5) {
    recommendations.push('⚠️ Found multiple `any` types - Consider adding stricter TypeScript types');
  }

  if ((allFiles['.test.ts'] || 0) < tsFiles / 20) {
    recommendations.push('🧪 Test coverage seems low - Add more unit tests for core logic');
  }

  if (!keyFiles.contributionGuide) {
    recommendations.push('📝 AI_CONTRIBUTION_GUIDE.md missing - Add guidelines for AI contributors');
  }

  recommendations.push('🔍 Run: npx depcheck for finding unused dependencies');
  recommendations.push('📊 Run: npm run build to validate TypeScript compilation');

  const analysis: AnalysisResult = {
    timestamp: new Date().toISOString(),
    rootPath,
    appsMobile: {
      files: appsMobileFiles.files,
      directories: appsMobileFiles.dirs,
      largestComponent: getLargestFile(path.join(rootPath, 'apps/mobile/src/components')),
    },
    appsWeb: {
      files: appsWebFiles.files,
      directories: appsWebFiles.dirs,
    },
    packagesShared: {
      exists: fs.existsSync(packagesSharedPath),
      isEmpty: packagesSharedEmpty,
    },
    statistics: {
      totalFiles,
      totalDirs,
      filesByType: allFiles,
      tsFiles,
      tsxFiles: allFiles['.tsx'] || 0,
      cssFiles: allFiles['.css'] || 0,
      testFiles: Object.values(allFiles).reduce((sum, _, key) => {
        return key.includes('.test') ? sum + (allFiles[key] || 0) : sum;
      }, 0),
    },
    keyFiles,
    recommendations,
  };

  return analysis;
}

function printAnalysis(analysis: AnalysisResult) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 KINETIX PROJECT ANALYSIS');
  console.log('='.repeat(70) + '\n');

  console.log(`📁 Project Root: ${analysis.rootPath}`);
  console.log(`⏰ Analysis Time: ${new Date(analysis.timestamp).toLocaleString()}\n`);

  console.log('━'.repeat(70));
  console.log('📱 APPS/MOBILE (Client App)');
  console.log('━'.repeat(70));
  console.log(`   Files: ${analysis.appsMobile.files}`);
  console.log(`   Directories: ${analysis.appsMobile.directories}`);
  console.log(`   Largest Component (src/components): ${analysis.appsMobile.largestComponent}\n`);

  console.log('━'.repeat(70));
  console.log('🌐 APPS/WEB (Trainer Dashboard)');
  console.log('━'.repeat(70));
  console.log(`   Files: ${analysis.appsWeb.files}`);
  console.log(`   Directories: ${analysis.appsWeb.directories}\n`);

  console.log('━'.repeat(70));
  console.log('📦 PACKAGES/SHARED (Shared Code)');
  console.log('━'.repeat(70));
  console.log(`   Exists: ${analysis.packagesShared.exists ? '✅' : '❌'}`);
  console.log(`   Empty: ${analysis.packagesShared.isEmpty ? '⚠️ YES' : '✅ Has content'}\n`);

  console.log('━'.repeat(70));
  console.log('📊 OVERALL STATISTICS');
  console.log('━'.repeat(70));
  console.log(`   Total Files: ${analysis.statistics.totalFiles}`);
  console.log(`   Total Directories: ${analysis.statistics.totalDirs}`);
  console.log(`   TypeScript Files (.ts): ${analysis.statistics.tsFiles}`);
  console.log(`   TypeScript JSX (.tsx): ${analysis.statistics.tsxFiles}`);
  console.log(`   CSS Files: ${analysis.statistics.cssFiles}`);
  console.log(`   Test Files: ${analysis.statistics.testFiles}\n`);

  console.log('━'.repeat(70));
  console.log('✅ KEY FILES STATUS');
  console.log('━'.repeat(70));
  Object.entries(analysis.keyFiles).forEach(([key, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${key}`);
  });
  console.log();

  console.log('━'.repeat(70));
  console.log('💡 RECOMMENDATIONS FOR AI CONTRIBUTORS');
  console.log('━'.repeat(70));
  analysis.recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  console.log();

  console.log('━'.repeat(70));
  console.log('📈 FILE TYPE DISTRIBUTION');
  console.log('━'.repeat(70));
  const sortedTypes = Object.entries(analysis.statistics.filesByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedTypes.forEach(([type, count]) => {
    const bar = '█'.repeat(Math.ceil(count / 10));
    console.log(`   ${type.padEnd(12)} ${bar} ${count}`);
  });
  console.log();

  console.log('━'.repeat(70));
  console.log('🎯 NEXT STEPS FOR AI CONTRIBUTORS');
  console.log('━'.repeat(70));
  console.log(`   1. Read: ${analysis.rootPath}/AI_CONTRIBUTION_GUIDE.md`);
  console.log(`   2. Read: ${analysis.rootPath}/MONOREPO.md`);
  console.log('   3. Pick a small refactor (< 300 lines)');
  console.log('   4. Create feature branch: git checkout -b feature/your-improvement');
  console.log('   5. Make changes in ONE app or packages/shared');
  console.log('   6. Test: npm run build && npm run test');
  console.log('   7. Commit with clear message');
  console.log('   8. Push and create PR');
  console.log();

  console.log('='.repeat(70) + '\n');
}

// Main execution
try {
  const analysis = analyzeProject();
  printAnalysis(analysis);

  // Optionally save to JSON for programmatic access
  const outputPath = path.join(process.cwd(), '.project-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`✅ Analysis saved to: ${outputPath}\n`);
} catch (error) {
  console.error('❌ Error during analysis:', error);
  process.exit(1);
}
