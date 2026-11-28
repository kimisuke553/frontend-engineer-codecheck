import type {
  ApiResponse,
  PopulationComposition,
  Prefecture,
} from '../types/api'

/**
 * ブラウザから呼ぶのは自分のサーバーの /api/* だけ。
 * API キーはサーバー側（本番: Vercel Functions / 開発: Vite のプロキシ）で付与する。
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

async function getResult<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new ApiError(response.status)
  }
  const body = (await response.json()) as ApiResponse<T>
  return body.result
}

export function fetchPrefectures(): Promise<Prefecture[]> {
  return getResult<Prefecture[]>('/api/prefectures')
}

export function fetchPopulationComposition(
  prefCode: number,
): Promise<PopulationComposition> {
  return getResult<PopulationComposition>(
    `/api/population?prefCode=${prefCode}`,
  )
}
