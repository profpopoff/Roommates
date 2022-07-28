import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/pages/Apartment.module.scss'

import Layout from '../../components/Layout'

export default function Apartment({ apartment }) {

  return (
    <Layout title={apartment.title}>
      <div className={styles.container}>
        {apartment.title}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/apartments/${params.id}`)
  const data = await res.json()
  return { props: { apartment: data } }
}