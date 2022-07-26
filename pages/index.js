import styles from '../styles/Home.module.scss'

import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Posts from '../components/Posts/Posts'
import Map from '../components/Map/Map'

export default function Home({ apartments }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Filters />
        <Posts apartments={apartments} />
        {/* <Map /> */}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/apartments')
  const data = await res.json()
  return { props: { apartments: data } }
}
