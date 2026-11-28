/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

const API_BASE_URL = 'https://frontend-engineer-codecheck-api.mirai.yumemi.io'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 第 3 引数を '' にすると、VITE_ で始まらない変数も読み込める。
  // ここで読んだ値は開発サーバー（Node.js）の中だけで使い、ブラウザには渡らない。
  const env = loadEnv(mode, process.cwd(), '')

  // 社内ネットワークなどで外部への通信にプロキシが必要な場合だけ使う
  const outboundProxy = env.HTTPS_PROXY || env.https_proxy

  /**
   * 開発中に /api/* へのリクエストを試験用 API に中継する。
   * 本番の Vercel Functions（api/ ディレクトリ）と同じ URL・同じ動きにそろえている。
   */
  const relay = (upstreamPath: string): ProxyOptions => ({
    target: API_BASE_URL,
    changeOrigin: true,
    headers: { 'X-API-KEY': env.API_KEY ?? '' },
    agent: outboundProxy ? new HttpsProxyAgent(outboundProxy) : undefined,
    // /api/population?prefCode=1 → /api/v1/population/composition/perYear?prefCode=1
    rewrite: (path) => path.replace(/^\/api\/[a-z]+/, upstreamPath),
  })

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/prefectures': relay('/api/v1/prefectures'),
        '/api/population': relay('/api/v1/population/composition/perYear'),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts'],
      // テストごとにモックや差し替えたグローバル変数を元に戻す
      restoreMocks: true,
      unstubGlobals: true,
      unstubEnvs: true,
    },
  }
})
