import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteDevPlugin } from './build/plugins/viteForElectronDevPlugin.js';
/** @type {import('vite').UserConfig} */
export default defineConfig({
  server: {
    host: '127.0.0.1'
  },
  plugins: [viteDevPlugin(), vue()],
  build: {
    target: ['chrome112']
  }
})
