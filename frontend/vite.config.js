import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set the base path to your GitHub Pages subpath
  base: '/',

  server: {
    proxy: {
      '/api': {
        target:  "https://quizgame-9.onrender.com", // Deployed frontend URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
