import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 어여우라지 케이스 스터디. 플러스엑스 EQL 사례 배치를 옮겨 왔다. 포트 5195.
export default defineConfig({
  base: '/eoyeourazi-case/',
  plugins: [react()],
  server: { port: 5195, strictPort: true },
  preview: { port: 5195, strictPort: true },
  // 이 환경은 lightningcss 네이티브 바인딩이 없어 압축을 끈다(공통 지시).
  build: { minify: false },
});
