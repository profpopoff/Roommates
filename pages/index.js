import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Posts from '../components/Posts/Posts'
import Map from '../components/Map/Map'
import { useEffect, useState } from 'react'

export default function Home() {

  const [apartments, setApartments] = useState([])

  useEffect(() => {
    fetch("/api/apartments")
      .then(response => response.json())
      .then(data => setApartments(data))
  }, [])

  console.log(apartments)

  return (
    <Layout>
      <div className={styles.container}>
        <Filters />
        <Posts />
        {/* <Map /> */}
      </div>
    </Layout>
  )
}
