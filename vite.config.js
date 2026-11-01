import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const proxyApi = {
  '/api': 'http://127.0.0.1:3001',
}

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: proxyApi,
  },
  preview: {
    proxy: proxyApi,
  },
})
