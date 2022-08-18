import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/pages/Property.module.scss'
import Layout from '../../components/Layout'

export default function Property() {
  return (
    <Layout title="My Property">
      <div className={styles.container}>
        Property
      </div>
    </Layout>
  )
}
