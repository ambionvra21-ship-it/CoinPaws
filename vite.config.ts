import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // FIX: Forces the compiler to output relative paths (e.g., assets/main.js instead of /assets/main.js)
})
