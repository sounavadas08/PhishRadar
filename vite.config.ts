import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/scan': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/report': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/reports': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
});

