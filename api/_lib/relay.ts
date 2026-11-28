/**
 * 試験用 API へリクエストを中継する共通処理。
 *
 * ブラウザから直接 API を呼ぶと、リクエストヘッダーの API キーが誰にでも見えてしまう。
 * そこでサーバー側（Vercel Functions）でだけキーを付与し、ブラウザにはキーを渡さない。
 *
 * ファイル名・ディレクトリ名が `_` で始まるものは、Vercel では関数として公開されない。
 */
export const API_BASE_URL =
  'https://frontend-engineer-codecheck-api.mirai.yumemi.io'

/** 成功レスポンスを CDN にキャッシュさせる設定（データはほぼ更新されないため長めにする） */
const CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=604800'

export function jsonError(status: number, message: string): Response {
  return Response.json({ message, result: null }, { status })
}

export async function relayToUpstream(path: string): Promise<Response> {
  const apiKey = process.env.API_KEY
  if (!apiKey) {
    // キーの有無などサーバー内部の事情は、詳しくクライアントに返さない
    console.error('API_KEY is not set')
    return jsonError(500, 'Server configuration error')
  }

  let upstream: Response
  try {
    upstream = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'X-API-KEY': apiKey },
    })
  } catch (error) {
    console.error('Failed to reach upstream API', error)
    return jsonError(502, 'Bad Gateway')
  }

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
  })
  if (upstream.ok) {
    headers.set('Cache-Control', CACHE_CONTROL)
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers,
  })
}
