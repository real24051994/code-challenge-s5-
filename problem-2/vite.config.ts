import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep Vite's optimizer cache in the project directory, which is writable
  // even if node_modules was installed by a different user.
  cacheDir: '.vite-cache',
});
