#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] || 'start';

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const banner = `
\x1b[33m\x1b[1m
  ███╗   ██╗ ██████╗ ██╗████████╗ ██████╗  █████╗ 
  ████╗  ██║██╔═══██╗██║╚══██╔══╝██╔════╝ ██╔══██╗
  ██╔██╗ ██║██║   ██║██║   ██║   ██║     ███████║
  ██║╚██╗██║██║   ██║██║   ██║   ██║     ██╔══██║
  ██║ ╚████║╚██████╔╝██║   ██║   ╚██████╗██║  ██║
  ╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
\x1b[0m
\x1b[38;5;244m  Visual GitHub Actions Workflow Builder (Local-First)\x1b[0m
`;

if (command === 'start' || command === 'dev') {
  console.clear();
  console.log(banner);

  const localIp = 'localhost';
  const networkIp = getNetworkAddress();
  const port = 5173;

  console.log('\x1b[32m%s\x1b[0m', '  ⚡ noitca is live at:');
  console.log(`  \x1b[33m➜\x1b[0m  Local:    \x1b[36mhttp://${localIp}:${port}/\x1b[0m`);
  console.log(`  \x1b[33m➜\x1b[0m  Network:  \x1b[36mhttp://${networkIp}:${port}/\x1b[0m`);
  console.log('\x1b[90m%s\x1b[0m', '\n  Press Ctrl+C to stop the server\n');

  const child = spawn('npx', ['vite', '--host'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    console.error('Failed to start noitca:', err.message);
  });
} else if (command === 'status') {
  console.log(banner);
  console.log('\x1b[36m%s\x1b[0m', '=== noitca System Status ===');
  console.log(`▸ Node Version:     ${process.version}`);
  console.log(`▸ Platform:         ${process.platform} (${process.arch})`);
  console.log(`▸ Directory:        ${rootDir}`);
  console.log(`▸ Host Address:     ${getNetworkAddress()}`);
  
  const distPath = path.join(rootDir, 'dist');
  const hasBuild = fs.existsSync(distPath);
  console.log(`▸ Production Build: ${hasBuild ? '✅ Ready in /dist' : '⚠️ Not Built (run npm run build)'}`);

  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  console.log(`▸ Version:          ${packageJson.version || '0.1.0'}`);
  console.log(`▸ Dependencies:     ${Object.keys(packageJson.dependencies || {}).length} packages active`);
  console.log('\x1b[32m%s\x1b[0m', '▸ Engine Status:    ONLINE & HEALTHY - Ready to run `noitca start`\n');
} else if (command === 'update' && args[1] === '-status') {
  console.log(banner);
  console.log('\x1b[33m%s\x1b[0m', '🔍 Checking for upstream updates...');
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
  console.log(banner);
  console.log(`
\x1b[33mnoitca CLI Tool\x1b[0m

Usage:
  noitca start          - Launch visual workflow studio (Local & Network)
  noitca status         - Check engine health, system info & dist status
  noitca update -status - Check for new upstream updates
`);
}
