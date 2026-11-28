import { describe, expect, it, vi } from 'vitest'
import {
  ApiError,
  fetchPopulationComposition,
  fetchPrefectures,
} from './client'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('fetchPrefectures', () => {
  it('/api/prefectures を呼び、result を返す', async () => {
    const prefectures = [{ prefCode: 1, prefName: '北海道' }]
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: null, result: prefectures }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchPrefectures()).resolves.toEqual(prefectures)
    expect(fetchMock).toHaveBeenCalledWith('/api/prefectures')
  })

  it('レスポンスがエラーなら ApiError を投げる', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 500)))

    await expect(fetchPrefectures()).rejects.toBeInstanceOf(ApiError)
  })
})

describe('fetchPopulationComposition', () => {
  it('prefCode をクエリに付けて呼ぶ', async () => {
    const composition = { boundaryYear: 2020, data: [] }
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: null, result: composition }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchPopulationComposition(13)).resolves.toEqual(composition)
    expect(fetchMock).toHaveBeenCalledWith('/api/population?prefCode=13')
  })
})
