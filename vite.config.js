import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from 'rollup-plugin-copy'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir: 'public',
  plugins: [
    // https://www.npmjs.com/package/rollup-plugin-copy
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'assets/images/**/*', dest: 'dist/assets/images' }
      ]
    }),
    svelte(),
  ],
  build: {
    outDir,
    emptyOutDir: true,
    publicDir: 'dist2',
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup','popup.html'),
        temp2: resolve(root, 'temp2','index.html'),
      }
    }
  }
})
