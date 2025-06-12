import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { features } from 'process';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      '@pages': path.resolve(__dirname, 'src/pages'),
      "@routes": path.resolve(__dirname, "./src/routes"),
      '@assets': path.resolve(__dirname, 'src/assets'),
      "@services": path.resolve(__dirname, "./src/services"),
      '@redux': path.resolve(__dirname, './src/store/slices'),
      "@data": path.resolve(__dirname, "./src/data"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
  server: {
    port: 3000,
  },
});
