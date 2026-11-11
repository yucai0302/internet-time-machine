import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 生产构建部署在 GitHub Pages 的项目子路径下，开发服务器仍用根路径
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/internet-time-machine/' : '/',
  plugins: [react()],
  server: { port: 5173, host: true },
}))
