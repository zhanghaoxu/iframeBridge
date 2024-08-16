import { defineConfig } from 'father';
import pkg from './package.json';
export default defineConfig({
  esm: {},
  define: {
    'process.env.__VERSION__': JSON.stringify(pkg.version),
    'process.env.__DEV__': JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
