import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.scss'

import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Posts from '../components/Posts/Posts'
import Map from '../components/Map/Map'

export default function Home({apartments}) {

  // const [apartments, setApartments] = useState([])

  // useEffect(() => {
  //   fetch("/api/apartments")
  //     .then(response => response.json())
  //     .then(data => setApartments(data))
  // }, [])
  console.log(apartments)

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

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('http://localhost:3000/api/apartments')
  const data = await res.json()

  // Pass data to the page via props
  return { props: { apartments: data } }
}
