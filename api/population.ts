import { jsonError, relayToUpstream } from './_lib/relay.js'

const MIN_PREF_CODE = 1
const MAX_PREF_CODE = 47

/**
 * GET /api/population?prefCode={1-47}
 * 指定した都道府県の人口構成を返す
 * （試験用 API の /api/v1/population/composition/perYear を中継）。
 */
export function GET(request: Request): Promise<Response> {
  const prefCode = new URL(request.url).searchParams.get('prefCode')

  // 受け取った値をそのまま上流に渡さず、想定どおりの値かを先に検証する
  if (!isValidPrefCode(prefCode)) {
    return Promise.resolve(jsonError(400, 'Invalid prefCode'))
  }

  return relayToUpstream(
    `/api/v1/population/composition/perYear?prefCode=${prefCode}`,
  )
}

function isValidPrefCode(value: string | null): value is string {
  if (value === null || !/^\d{1,2}$/.test(value)) {
    return false
  }
  const code = Number(value)
  return code >= MIN_PREF_CODE && code <= MAX_PREF_CODE
}
