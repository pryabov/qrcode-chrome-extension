import { resolve } from 'path'
import { defineConfig } from 'vite'
import commonjs from '@rollup/plugin-commonjs';
import react from '@vitejs/plugin-react-swc'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir: 'public',
  mode: 'development',
  plugins: [
    commonjs(),
    react(),
  ],
  build: {
    minify: false,
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup','index.html'),
        options: resolve(root, 'options','index.html'),
      }
    }
  }
})
