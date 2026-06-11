import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npx, ['tsx', join(__dirname, 'src/index.ts')], {
  stdio: 'inherit',
  cwd: __dirname,
});

child.on('exit', (code) => process.exit(code ?? 1));
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
