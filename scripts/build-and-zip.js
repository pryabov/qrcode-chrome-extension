#!/usr/bin/env node

import { execSync } from 'child_process';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipDir = path.join(rootDir, 'releases');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = packageJson.version || '1.0.0';

// Generate timestamp for unique builds
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
const zipFileName = `qr-chrome-extension-v${version}-${timestamp}.zip`;
const zipPath = path.join(zipDir, zipFileName);

console.log('🚀 Building QR Chrome Extension...\n');

try {
  // Step 1: Clean previous builds
  console.log('📁 Cleaning previous builds...');
  if (fs.existsSync(distDir)) {
    execSync('yarn rimraf dist', { cwd: rootDir, stdio: 'inherit' });
  }

  // Step 2: Build the project
  console.log('🔨 Building project...');
  execSync('yarn vite build', { cwd: rootDir, stdio: 'inherit' });

  // Step 3: Validate build output
  console.log('✅ Validating build output...');
  const requiredFiles = [
    'popup/index.html',
    'options/index.html',
    'manifest.json'
  ];

  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(distDir, file))
  );

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    process.exit(1);
  }

  // Step 4: Create releases directory
  if (!fs.existsSync(zipDir)) {
    fs.mkdirSync(zipDir, { recursive: true });
  }

  // Step 5: Create zip file
  console.log('📦 Creating zip archive...');
  
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  output.on('close', () => {
    const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`\n✅ Build completed successfully!`);
    console.log(`📦 Archive: ${zipFileName}`);
    console.log(`📏 Size: ${sizeInMB} MB`);
    console.log(`📍 Location: ${zipPath}`);
    console.log(`\n🎉 Ready for Chrome Web Store upload!`);
  });

  output.on('error', (err) => {
    console.error('❌ Error creating zip:', err);
    process.exit(1);
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('⚠️ Warning:', err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    console.error('❌ Archive error:', err);
    process.exit(1);
  });

  archive.pipe(output);

  // Add all files from dist directory to zip
  archive.directory(distDir, false);

  // Finalize the archive
  await archive.finalize();

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 