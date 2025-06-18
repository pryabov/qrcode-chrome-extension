import { resolve } from 'path'
import { defineConfig } from 'vite'
import commonjs from '@rollup/plugin-commonjs';
import react from '@vitejs/plugin-react'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir: 'public',
  plugins: [
    commonjs(),
    react(),
  ],
  build: {
    outDir,
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup','index.html'),
        options: resolve(root, 'options','index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
