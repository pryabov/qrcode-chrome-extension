import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [svelte()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        temp: resolve(root, 'temp','index.html'),
        temp2: resolve(root, 'temp2','index.html'),
      }
    }
  }
})
