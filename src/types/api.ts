/** 試験用 API の共通レスポンス形式 */
export type ApiResponse<T> = {
  message: string | null
  result: T
}

export type Prefecture = {
  prefCode: number
  prefName: string
}

export type PopulationDataPoint = {
  year: number
  value: number
  /** 総人口に対する割合（%）。総人口のデータには含まれない */
  rate?: number
}

export type PopulationSeries = {
  label: string
  data: PopulationDataPoint[]
}

export type PopulationComposition = {
  /** 実績値と推計値の区切りとなる年 */
  boundaryYear: number
  data: PopulationSeries[]
}
