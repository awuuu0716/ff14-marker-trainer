import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 引入插件

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 加入這裡
  ],
  server: {
    port: 3010, // 確保是在 3010 端口
  }
})