import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // ******************************************************
      // ** 最終修正：將 base 設為相對路徑 './' **
      // 這能確保所有 JS/CSS 資源相對於 index.html 檔案載入，
      // 徹底解決 GitHub Pages 的子目錄載入問題。
      base: './', 
      // ******************************************************
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // 保留 Gemini API Key 的設定
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        // 保留路徑別名設定
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});