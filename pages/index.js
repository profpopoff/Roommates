import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Posts from '../components/Posts/Posts'
import Map from '../components/Map/Map'

export default function Home() {

  return (
    <Layout> 
      <div className={styles.container}>
        <Filters />
        <Posts />
        <Map />
      </div>
    </Layout>
  )
}
