// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './population.ts'

const requestFor = (query: string) =>
  new Request(`https://example.com/api/population${query}`)

describe('GET /api/population', () => {
  beforeEach(() => {
    vi.stubEnv('API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('prefCode を付けて上流 API に中継する', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"message":null,"result":{}}'))
    vi.stubGlobal('fetch', fetchMock)

    const response = await GET(requestFor('?prefCode=13'))

    expect(fetchMock).toHaveBeenCalledWith(
      'https://frontend-engineer-codecheck-api.mirai.yumemi.io/api/v1/population/composition/perYear?prefCode=13',
      { headers: { 'X-API-KEY': 'test-key' } },
    )
    expect(response.status).toBe(200)
  })

  it.each(['', '?prefCode=', '?prefCode=0', '?prefCode=48', '?prefCode=abc'])(
    '不正な prefCode（%s）は上流を呼ばずに 400 を返す',
    async (query) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      const response = await GET(requestFor(query))

      expect(response.status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )
})
