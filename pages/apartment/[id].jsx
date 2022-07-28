import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/pages/Apartment.module.scss'

import Layout from '../../components/Layout'
import FavButton from '../../components/FavButton/FavButton'

export default function Apartment({ apartment }) {

  return (
    <Layout title={apartment.title}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Images />
          <Headline title={apartment.title} />
          <Landlord />
          <FavButton />
          <Conveniences />
          <Stats/>
          <Desc/>
        </div>
        <Reviews/>
      </div>
    </Layout>
  )
}

const Images = () => {
  return (
    <div className={styles.images}>
      images
    </div>
  )
}

const Headline = (props) => {
  return (
    <div className={styles.headline}>
      {props.title}
    </div>
  )
}

const Landlord = () => {
  return (
    <div className={styles.landlord}>
      landlord
    </div>
  )
}

const Conveniences = () => {
  return (
    <ul className={styles.conveniences}>
      Conveniences
    </ul>
  )
}

const Stats = () => {
  return (
    <div className={styles.stats}>
      Stats
    </div>
  )
}

const Desc = () => {
  return (
    <div className={styles.desc}>
      desc
    </div>
  )
}

const Reviews = () => {
  return (
    <div className={styles.reviews}>
      reviews
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/apartments/${params.id}`)
  const data = await res.json()
  return { props: { apartment: data } }
}