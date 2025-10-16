
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    origin: 'http://127.0.0.1:3000',
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      port: 3000,
      clientPort: 3000,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});