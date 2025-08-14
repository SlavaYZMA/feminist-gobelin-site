import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  base: '/',
  css: {
    preprocessorOptions: {
      css: {
        charset: false // Убедитесь, что кодировка не вызывает проблем
      }
    }
  }
});
