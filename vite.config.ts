import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Modern Tailwind v4 Vite integration
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Seamlessly hooks Tailwind v4 right into Vite
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    // Forces the underlying esbuild compiler to safely handle modern JavaScript features
    target: 'es2022',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: false,
    // Forces the rollup compiler target to match esbuild and prevent structural parsing errors
    target: 'es2022', 
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
