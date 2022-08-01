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

export default function Apartment({ apartment, landlord, reviewers }) {
  return (
    <Layout title={apartment?.title}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Images images={apartment?.images} />
          <Headline
            title={apartment?.title}
            {...apartment?.address}
            {...apartment?.price}
            reviews={apartment?.reviews}
            roommates={apartment?.roommates}
          />
          <Landlord {...landlord} />
          <FavButton />
          <Conveniences conveniences={apartment?.conveniences} />
          <Stats {...apartment?.stats} />
          <Desc desc={apartment?.desc} />
        </div>
        {!!apartment.reviews.length && <Reviews reviews={apartment.reviews} reviewers={reviewers} />}
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
          src={props?.images[activeImage]}
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
          <div className={styles.image} key={index}>
            <Image
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

const Landlord = (props) => {
  return (
    <div className={styles.landlord}>
      <div className={styles.text}>
        <h3 className={styles.role}>Арендодатель</h3>
        <h2 className={styles.name}>{props?.name} {props?.surname}</h2>
      </div>
      <div className={styles.image}>
        <Image
          className={styles.src}
          src={props?.image ? props.image : '/img/default-user.png'}
          alt=""
          layout="fill"
        />
        <button
          className={styles.chatBtn}
        // onClick={createConverstion}
        >
          <FontAwesomeIcon icon={faComments} />
          <span className="sr-only">Начать чат с арендатором</span>
        </button>
      </div>

    </div>
  )
}

const Conveniences = (props) => {
  return (
    <ul className={styles.conveniences}>
      {props.conveniences?.map((convenience) => (
        <li key={convenience}>{convenience}</li>
      ))}
    </ul>
  )
}

const Stats = (props) => {
  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <h3 className={styles.category}>Этаж</h3>
        <h2 className={styles.value}>{props.floor}</h2>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.category}>Площадь</h3>
        <h2 className={styles.value}>{props.area}&#13217;</h2>
      </div>
      <div className={styles.stat}>
        <h3 className={styles.category}>{`Комнат${props.rooms > 1 ? '' : 'а'}`}</h3>
        <h2 className={styles.value}>{props.rooms}</h2>
      </div>
    </div>
  )
}

const Desc = (props) => {
  return (
    <div className={styles.desc}>
      <div className={styles.map}>
        map
      </div>
      <p className={styles.text}>{props.desc}</p>
    </div>
  )
}

const Reviews = (props) => {
  console.log(props)
  return (
    <div className={styles.reviews}>
      reviews
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const apartment = await fetch(`http://localhost:3000/api/apartments/${params.id}`)
    .then(response => response.json())
  const landlord = await fetch(`http://localhost:3000/api/users/${apartment.landlordId}`)
    .then(response => response.json())
  if (apartment.reviews.length) {
    const reviewers = await Promise.all(
      apartment.reviews.map(review => {
        return fetch(`http://localhost:3000/api/users/${review.userId}`)
        .then(response => response.json())
      })
    )
    return { props: { apartment, landlord, reviewers } }
  }

  return { props: { apartment, landlord } }
}