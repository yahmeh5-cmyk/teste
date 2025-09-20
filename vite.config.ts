import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        global: "globalThis"
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          process: "process/browser",
          stream: "stream-browserify",
          zlib: "browserify-zlib",
          util: 'util'
        }
      },
      optimizeDeps: {
        include: ['pdfjs-dist']
      },
      worker: {
        format: 'es'
      }
    };
});
