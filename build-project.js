#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Log function with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Main build function
function buildProject() {
  log('🚀 Starting build process...', 'cyan');
  
  try {
    // Clean previous build
    log('🧹 Cleaning previous build...', 'yellow');
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
    
    // Create directories
    log('📁 Creating directories...', 'yellow');
    fs.mkdirSync('dist', { recursive: true });
    fs.mkdirSync('dist/client', { recursive: true });
    fs.mkdirSync('dist/server', { recursive: true });
    
    // Build client
    log('🖥️  Building client...', 'blue');
    execSync('npm run build:client', { stdio: 'inherit' });
    
    // Build server
    log('🖥️  Building server...', 'blue');
    execSync('npm run build:server', { stdio: 'inherit' });
    
    // Copy package.json to dist
    log('📋 Copying package.json...', 'yellow');
    fs.copyFileSync('package.json', 'dist/package.json');
    
    // Create .env file for production
    log('🔧 Creating production environment file...', 'yellow');
    const envContent = `NODE_ENV=production
PORT=3000
MONGODB_URI=${process.env.MONGODB_URI || 'mongodb://localhost:27017/spendthrone'}
JWT_SECRET=${process.env.JWT_SECRET || 'your-secret-key'}
`;
    fs.writeFileSync('dist/.env', envContent);
    
    log('✅ Build completed successfully!', 'green');
    log('🎉 Your application is ready for deployment!', 'green');
    log('📦 To start the production server, run: npm start', 'cyan');
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the build
buildProject();