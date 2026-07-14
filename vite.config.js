import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// API ปลายทางเดิม — เปลี่ยนเป็น mock (http://localhost:3001) ได้ผ่าน env VITE_API_TARGET
const API_TARGET = process.env.VITE_API_TARGET || 'http://10.10.10.164'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
    // ไดรฟ์ที่ map/network ตัว file watcher ปกติของ Vite มักจับการเปลี่ยนไฟล์ไม่ได้
    // เปิด polling เพื่อให้ hot-reload ทำงาน (แก้ไฟล์แล้วเห็นผลทันที)
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
