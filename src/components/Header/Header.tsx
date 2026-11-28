import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>都道府県別 人口推移グラフ</h1>
    </header>
  )
}
