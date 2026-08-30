import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 监听所有地址（支持 127.0.0.1, localhost, 局域网 IP）
    port: 5173,
    strictPort: false
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  }
});
