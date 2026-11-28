import styles from './App.module.css'
import { Header } from './components/Header/Header'

function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.card}>
          <p>ここに都道府県の一覧とグラフを表示します。</p>
        </section>
      </main>
    </>
  )
}

export default App
