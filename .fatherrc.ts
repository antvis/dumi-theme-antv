import { defineConfig } from 'father';
import { version } from './package.json';

export default defineConfig({
  plugins: ['father-plugin-dumi-theme'],
  define: ({
    '__PACKAGE_VERSION__': JSON.stringify(version),
  })
});
