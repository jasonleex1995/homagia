import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served from https://jasonleex1995.github.io/homagia/
export default defineConfig({
  base: '/homagia/',
  plugins: [react(), tailwindcss()],
});
