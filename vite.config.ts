/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts'],
    // テストごとにモックや差し替えたグローバル変数を元に戻す
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
})
