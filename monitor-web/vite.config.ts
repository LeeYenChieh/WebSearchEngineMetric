import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),],
  server: {
    port: 3000, // 這裡改成你想要的 port
  },
})
