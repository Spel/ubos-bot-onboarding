import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make sure PostCSS is enabled for Tailwind CSS
  css: {
    postcss: {}
  },
  // Base path for GitHub Pages
  base: '/ubos-bot-onboarding/'
})
