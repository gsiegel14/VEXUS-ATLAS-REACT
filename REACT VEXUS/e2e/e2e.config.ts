import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

export default {
  targets: [{
    name: 'chromium',
    engine: web(),
    app: {
      url: 'http://127.0.0.1:0',
      command: {
        executable: 'node',
        args: ['../node_modules/vite/bin/vite.js', '..', '--host', '127.0.0.1', '--port', '{port}', '--strictPort'],
        log: '.e2e/logs/vite.log',
      },
    },
  }],
  workers: 2,
} satisfies E2EConfig;
