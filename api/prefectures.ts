import { relayToUpstream } from './_lib/relay.js'

/**
 * GET /api/prefectures
 * 都道府県一覧を返す（試験用 API の /api/v1/prefectures を中継）。
 */
export function GET(): Promise<Response> {
  return relayToUpstream('/api/v1/prefectures')
}
