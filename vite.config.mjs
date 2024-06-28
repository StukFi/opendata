import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
/// <reference types="vitest" />

const packageJSON = fs.readFileSync('./package.json')
const version = JSON.parse(packageJSON).version || 'unknown'

const filename = fileURLToPath(import.meta.url)
const pathSegments = path.dirname(filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(pathSegments, './src'),
    },
    extensions: ['.mjs', '.js', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/styles/variables.scss";
        `,
      },
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(version),
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    global: {}
  },
  build: {
    rollupOptions: {
      output: {
        // Splits plotly.js to its own chunk
        manualChunks(id) {
          if (id.includes('node_modules') && id.includes('plotly.js')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
    chunkSizeWarningLimit: 1100, // Suppresses warning for large plotly.js chunk
  },
  test: {
    environment: 'jsdom',
    silent: true // supresses useless warning(s), for example warning of
                 // [Vue warn]: Failed to resolve component: base-radio-button while testing settings panel
  },
});
