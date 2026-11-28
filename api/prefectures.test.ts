// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from './prefectures.ts'

describe('GET /api/prefectures', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('API キーを付けて上流 API に中継する', async () => {
    vi.stubEnv('API_KEY', 'test-key')
    const body = JSON.stringify({
      message: null,
      result: [{ prefCode: 1, prefName: '北海道' }],
    })
    const fetchMock = vi.fn().mockResolvedValue(new Response(body))
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://frontend-engineer-codecheck-api.mirai.yumemi.io/api/v1/prefectures',
      { headers: { 'X-API-KEY': 'test-key' } },
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toContain('s-maxage')
    expect(await response.text()).toBe(body)
  })

  it('上流 API のエラーステータスをそのまま返し、キャッシュさせない', async () => {
    vi.stubEnv('API_KEY', 'test-key')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 403 })),
    )

    const response = await GET()

    expect(response.status).toBe(403)
    expect(response.headers.get('Cache-Control')).toBeNull()
  })

  it('API キーが未設定なら上流を呼ばずに 500 を返す', async () => {
    vi.stubEnv('API_KEY', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET()

    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('上流 API に接続できなければ 502 を返す', async () => {
    vi.stubEnv('API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')))

    const response = await GET()

    expect(response.status).toBe(502)
  })
})
