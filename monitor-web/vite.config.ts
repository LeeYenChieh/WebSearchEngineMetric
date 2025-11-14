import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),],
  server: {
    port: 3000, // 這裡改成你想要的 port
    host: true, // 監聽所有網卡，讓局域網可訪問
    allowedHosts: true,
    proxy: {
      // proxy 給 22225
      '/crawler': {
        target: 'http://ws2.csie.ntu.edu.tw:22225',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/crawler/, '')
      },
      // proxy 給 22222
      '/typesense': {
        target: 'http://ws2.csie.ntu.edu.tw:22222',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/typesense/, '')
      }
    }
  },
})
