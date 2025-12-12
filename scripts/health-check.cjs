
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting SpendThrone Health Check...');

const results = {
  checks: [],
  status: 'passed'
};

function runCheck(name, command) {
  console.log(`\nChecking: ${name}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name}: PASSED`);
    results.checks.push({ name, status: 'passed' });
  } catch (error) {
    console.error(`❌ ${name}: FAILED`);
    results.checks.push({ name, status: 'failed', error: error.message });
    results.status = 'failed';
  }
}

// 1. Lint Check
runCheck('Linting', 'npm run lint');

// 2. Type Check
runCheck('Type Safety', 'npm run type-check');

// 3. Test Check (Unit)
runCheck('Unit Tests', 'npm test -- --run');

// 4. Bundle Size Check (Rough estimate via build)
console.log('\nChecking: Bundle Size...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  const distPath = path.join(__dirname, '..', 'dist', 'assets', 'js');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    let largeFiles = [];
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const stats = fs.statSync(path.join(distPath, file));
        const sizeInMB = stats.size / (1024 * 1024);
        if (sizeInMB > 0.5) { // Warning if > 500KB
           largeFiles.push({ file, size: sizeInMB.toFixed(2) + ' MB' });
        }
      }
    });
    
    if (largeFiles.length > 0) {
      console.warn('⚠️  Large chunks detected (> 500KB):');
      largeFiles.forEach(f => console.warn(`   - ${f.file}: ${f.size}`));
      // We don't fail the build, just warn
      results.checks.push({ name: 'Bundle Size', status: 'warning', details: largeFiles });
    } else {
      console.log('✅ Bundle Size: PASSED (All chunks < 500KB)');
      results.checks.push({ name: 'Bundle Size', status: 'passed' });
    }
  }
} catch (error) {
  console.error('❌ Build failed during bundle check');
  results.status = 'failed';
}

console.log('\n=== Health Check Summary ===');
console.table(results.checks);

if (results.status === 'failed') {
  console.error('Health check failed. Please fix issues before deploying.');
  process.exit(1);
} else {
  console.log('All systems operational. Ready for deployment. 🚀');
  process.exit(0);
}
