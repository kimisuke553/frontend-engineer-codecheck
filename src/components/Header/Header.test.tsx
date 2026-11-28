import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('アプリのタイトルを見出しとして表示する', () => {
    render(<Header />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '都道府県別 人口推移グラフ',
      }),
    ).toBeInTheDocument()
  })
})
