import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // 💡 This tells the bundler to ignore minor syntax warnings and pack your real app files!
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
    },
    // Prevent TypeScript warnings from halting production output
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      ignoreAnnotations: true
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
