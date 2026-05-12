import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Served at https://mizcausevic-dev.github.io/kinetic-gain-visualizer/ as a
// GitHub Pages project page. Local dev runs at /.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/kinetic-gain-visualizer/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  server: { port: 3001, host: '0.0.0.0' },
});
