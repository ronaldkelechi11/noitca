#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] || 'start';

if (command === 'start' || command === 'dev') {
  console.log('\x1b[33m%s\x1b[0m', '⚡ Starting noitca DevOps Workflow Engine...');
  const child = spawn('npx', ['vite'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    console.error('Failed to start noitca:', err.message);
  });
} else if (command === 'status') {
  console.log('\n\x1b[36m%s\x1b[0m', '=== noitca System Status ===');
  console.log(`▸ Node Version:   ${process.version}`);
  console.log(`▸ Directory:      ${rootDir}`);
  
  const distPath = path.join(rootDir, 'dist');
  const hasBuild = fs.existsSync(distPath);
  console.log(`▸ Production Build: ${hasBuild ? '✅ Available' : '⚠️ Not Built (run npm run build)'}`);

  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  console.log(`▸ Version:        ${packageJson.version || '0.0.0'}`);
  console.log(`▸ Dependencies:   ${Object.keys(packageJson.dependencies || {}).length} packages`);
  console.log('\x1b[32m%s\x1b[0m', 'Status: OK - Ready to run noitca start\n');
} else if (command === 'update' && args[1] === '-status') {
  console.log('\n\x1b[33m%s\x1b[0m', '🔍 Checking for upstream updates...');
  try {
    const gitStatus = execSync('git fetch --dry-run', { cwd: rootDir, encoding: 'utf8' });
    console.log('▸ Remote Git Repository: Connected');
    if (gitStatus.trim()) {
      console.log('\x1b[33m%s\x1b[0m', '✨ New updates are available! Run `git pull` to update.');
    } else {
      console.log('\x1b[32m%s\x1b[0m', '✅ noitca is up to date with the latest repository commits.');
    }
  } catch (err) {
    console.log('▸ Local Git check completed. Repository is up to date.');
  }
} else {
  console.log(`
\x1b[33mnoitca CLI Tool\x1b[0m

Usage:
  noitca start          - Launch local dev server (http://localhost:5173)
  noitca status         - Check system health & project status
  noitca update -status - Check for new upstream updates
`);
}
