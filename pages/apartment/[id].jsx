import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/pages/Apartment.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-regular-svg-icons'

import Layout from '../../components/Layout'
import FavButton from '../../components/FavButton/FavButton'
import { useState } from 'react'
import StarRatings from 'react-star-ratings'
import { average } from '../../components/utils'

export default function Apartment({ apartment }) {
  return (
    <Layout title={apartment.title}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Images images={apartment.images} />
          <Headline
            title={apartment.title}
            {...apartment.address}
            {...apartment.price}
            reviews={apartment.reviews}
            roommates={apartment.roommates}
          />
          <Landlord />
          <FavButton />
          <Conveniences />
          <Stats />
          <Desc />
        </div>
        <Reviews />
      </div>
    </Layout>
  )
}

const Images = (props) => {

  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className={styles.images}>
      <div className={styles.active}>
        <Image
          className={styles.src}
          src={props.images[activeImage]}
          alt=""
          layout="fill"
          onClick={activeImage === props.images.length - 1 ? () => setActiveImage(0) : () => setActiveImage(activeImage + 1)}
        />
        <button
          className={`${styles.imgButton} ${styles.next}`}
          onClick={activeImage === props.images.length - 1 ? () => setActiveImage(0) : () => setActiveImage(activeImage + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight} className="icon" />
        </button>
        <button
          className={`${styles.imgButton} ${styles.prev}`}
          onClick={activeImage === 0 ? () => setActiveImage(props.images.length - 1) : () => setActiveImage(activeImage - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="icon" />
        </button>
      </div>
      <div className={styles.inactive}>
        {props.images.map((image, index) => (
          <div className={styles.image}>
            <Image
              key={index}
              className={styles.src}
              src={image}
              alt=""
              layout="fill"
              onClick={() => setActiveImage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}


const Headline = (props) => {

  const ratings = props.reviews?.map(review => review.rating)

  return (
    <div className={styles.headline}>
      <h1 className={styles.title}>
        {props.title}
      </h1>
      <h3 className={styles.address}>
        <FontAwesomeIcon icon={faLocationDot} className="icon" /> {`${props.city}, ${props.street}, д.${props.house}, кв.${props.apartment}`}
      </h3>
      <div className={styles.price}>
        <span>{props.value.toLocaleString('ru', {
          style: 'currency',
          currency: props.currency,
          minimumFractionDigits: 0
        })}</span>/месяц
      </div>
      {
        !!ratings.length &&
        <div className={styles.rating}>
          <span className={styles.number}>{average(ratings).toString().substring(0, 3)}</span>
          <StarRatings
            rating={average(ratings)}
            starRatedColor="#2B67F6"
            starDimension="22"
            starSpacing="2"
            name="rating"
          />
        </div>
      }
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