import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest のグローバル API を無効にしているため、テストごとの後片付けを明示的に登録する
afterEach(() => {
  cleanup()
})
