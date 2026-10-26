import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: './', // FIX: Forces Vite to use relative paths (./) instead of absolute paths (/) so Android can find the CSS and JS bundles
})
