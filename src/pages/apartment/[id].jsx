import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/pages/Apartment.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faComments, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import ReactMapGL, { Marker } from "react-map-gl"

import { wrapper } from '../../redux/store'
import { getUser } from '../api/users/[id]'
import { getUserChats } from '../api/chats/[id]'
import { setUser } from '../../redux/slices/user'
import { getApartment } from '../api/apartments/[id]'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal/Modal'
import CustomTextarea from '../../components/CustomTextArea/CustomTextArea'
import FavButton from '../../components/FavButton/FavButton'
import Loading from '../../components/Loading/Loading'
import StarRatings from 'react-star-ratings'
import { average, jsonParser, enumerate } from '../../utils/functions'
import { Login } from '../../components/Header/Header'
import { useHttp } from '../../hooks/http.hook'

export default function Apartment({ apartment, landlord, reviewers, userChats, roommates }) {
  return (
    <Layout title={apartment.title}>
      <div className={styles.container}>
        <section className={styles.info}>
          <Images images={apartment.images} />
          <Headline
            title={apartment.title}
            {...apartment.address}
            {...apartment.price}
            reviews={apartment.reviews}
            roommates={roommates}
            userChats={userChats}
          />
          <Landlord {...landlord} userChats={userChats} />
          <FavButton id={apartment._id} />
          <Conveniences conveniences={apartment.conveniences} />
          <Stats {...apartment.stats} />
          <Desc desc={apartment.desc} {...apartment.coordinates} />
        </section>
        <Reviews apartment={apartment} reviewers={reviewers} />

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

  const user = useSelector((state) => state.user.info)

  const ratings = props.reviews?.map(review => review.rating)

  const { request } = useHttp()

  const router = useRouter()

  const handleClick = async (roommateId) => {
    if (!!props.userChats && props.userChats.some(element => element.members.includes(roommateId))) {
      router.push('/chat')
    } else {
      try {
        await request('/api/chats', 'POST',
          JSON.stringify({ senderId: user._id, receiverId: roommateId }),
          { 'Content-Type': 'application/json;charset=utf-8' })
        router.push('/chat')
      } catch (error) { }
    }
  }

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

      {
        !!props.roommates.length &&
        <div className={styles.roommates}>
          <div className={styles.images}>
            {props.roommates.map(roommate => (
              <div key={roommate._id} className={`${styles.roommate} ${user && styles.authorized}`} >
                <Image className={styles.src} src={roommate.image} alt="" width={50} height={50} />
                <FontAwesomeIcon icon={faComments} className={styles.icon} onClick={() => user && user._id !== roommate._id && handleClick(roommate._id)} />
              </div>
            ))}
          </div>
          <div className={styles.text}>
            <span className={styles.number}>{props.roommates.length} {enumerate(props.roommates.length, ["сосед", "соседа", "соседей"])}</span>
            <span className={styles.names}>{props.roommates.map(({ name }) => name).join(', ').replace(/, ([^,]*)$/, ' и $1')}</span>
          </div>
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
        <ChatBtn landlordId={props._id} userChats={props.userChats} />
      </div>

    </div>
  )
}

const ChatBtn = ({ landlordId, userChats }) => {

  const user = useSelector((state) => state.user.info)

  const { request } = useHttp()

  const [loginActive, setLoginActive] = useState(false)

  const router = useRouter()

  const handleClick = async () => {
    if (!!userChats && userChats.some(element => element.members.includes(landlordId))) {
      router.push('/chat')
    } else {
      try {
        await request('/api/chats', 'POST',
          JSON.stringify({ senderId: user._id, receiverId: landlordId }),
          { 'Content-Type': 'application/json;charset=utf-8' })
        router.push('/chat')
      } catch (error) { }
    }
  }

  return (
    <>
      <button
        className={styles.chatBtn}
        onClick={!user ? (() => setLoginActive(true)) : (() => { landlordId !== user._id && handleClick() })}
      >
        <FontAwesomeIcon icon={faComments} />
        <span className="sr-only">Начать чат с арендатором</span>
      </button>
      {!user && <Login loginActive={loginActive} setLoginActive={setLoginActive} id={landlordId} />}
    </>
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

  const [loading, setLoading] = useState(true)

  const [viewport, setViewport] = useState({
    latitude: props.latitude,
    longitude: props.longitude,
    zoom: 14
  })

  return (
    <div className={styles.desc}>
      <div className={styles.map}>
        {loading && <Loading />}
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          {...viewport}
          onMove={e => setViewport(e.viewport)}
          onLoad={() => setLoading(false)}
        >
          <Marker
            latitude={props.latitude}
            longitude={props.longitude}
            anchor="bottom"
          >
            <FontAwesomeIcon
              className={styles.marker}
              icon={faLocationDot}
            />
          </Marker>
        </ReactMapGL>
      </div>
      <p className={styles.text}>{props.desc}</p>
    </div>
  )
}

const Reviews = ({ apartment, reviewers }) => {

  const user = useSelector((state) => state.user.info)

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const [reviewActive, setReviewActive] = useState(false)

  const [review, setReview] = useState(user && reviewers.map(({ _id }) => _id).includes(user._id) ? apartment.reviews.find(item => item.userId === user._id) : {})

  const reviewHandler = async (e) => {
    e.preventDefault()

    if (review.rating && review.review) {

      const reviews = !!apartment.reviews.find(item => item.userId !== user._id) ?
        [...[apartment.reviews.find(item => item.userId !== user._id)], { ...review, userId: user._id }] :
        [{ ...review, userId: user._id }]

      try {
        await fetch(`/api/apartments/${apartment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({ reviews: reviews }),
        }).then(res => { res.status < 300 && refreshData(); setReviewActive(false) })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const deleteHandler = async () => {
    try {
      await fetch(`/api/apartments/${apartment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ reviews: apartment.reviews.length === 1 ? [] : apartment.reviews.find(item => item.userId !== user._id) }),
      }).then(res => { res.status < 300 && refreshData(); setReviewActive(false) })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={styles.reviews}>
      {user?.homeId === apartment._id &&
        <div className={styles.newReview}>
          <button className={styles.reviewBtn} onClick={() => setReviewActive(true)}>{reviewers.map(({ _id }) => _id).includes(user._id) ? 'Редактировать отзыв' : 'Оставить отзыв'}</button>
          <Modal active={reviewActive} setActive={setReviewActive}>
            <h2>Ваш отзыв</h2>
            <form className={styles.reviewForm} onSubmit={reviewHandler}>
              <div className={styles.rating}>
                <h3>Оценка</h3>
                <StarRatings
                  rating={review.rating}
                  changeRating={(newRating) => { setReview({ ...review, rating: newRating }) }}
                  starRatedColor="blue"
                  starDimension="20"
                  starSpacing="5"
                  starHoverColor="#2B67F6"
                  name='rating'
                />
                <CustomTextarea
                  label="Комментарий"
                  name="review"
                  value={review.review}
                  handleChange={e => setReview({ ...review, [e.target.name]: e.target.value })}
                />
              </div>
              <input className="submit-btn" type="submit" value={'Отправить'} />
              {!!apartment.reviews.find(item => item.userId == user._id) &&
                <button
                  className={styles.deleteBtn}
                  onClick={e => {
                    e.preventDefault()
                    deleteHandler()
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} className="icon" /> удалить отзыв
                </button>
              }
            </form>
          </Modal>
        </div>
      }
      {!!apartment.reviews.length && apartment.reviews.map((review, index) => (
        <Review key={index} review={review} reviewers={reviewers} index={index} />
      ))}
    </section>
  )
}

const Review = ({ review, reviewers, index }) => {
  return (
    <div className={styles.review} key={review._id}>
      <div className={styles.reviewer}>
        <div className={styles.image}>
          <Image
            className={styles.src}
            src={reviewers[index].image ? reviewers[index].image : '/img/default-user.png'}
            alt=""
            layout="fill"
          />
        </div>
        <h2 className={styles.name}>{reviewers[index].name}</h2>
      </div>
      <div className={styles.rating}>
        <h3 className={styles.number}>{review.rating}</h3>
        <StarRatings
          rating={review.rating}
          starRatedColor="#2B67F6"
          starDimension="20"
          starSpacing="5"
          name='rating'
        />
      </div>
      <p className={styles.text}>{review.review}</p>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ params, req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(jsonParser(user)))

    const userId = store.getState().user.info._id
    const userChats = await getUserChats(userId)

    const apartment = await getApartment(params.id)

    const roommates = await Promise.all(
      apartment.roommates.map(roommate => (
        getUser(roommate)
      ))
    )

    const landlord = await getUser(apartment.landlordId)

    const reviewers = await Promise.all(
      apartment.reviews.map(review => (
        getUser(review.userId)
      ))
    )

    return {
      props: {
        apartment: jsonParser(apartment),
        landlord: jsonParser(landlord),
        reviewers: jsonParser(reviewers),
        userChats: jsonParser(userChats),
        roommates: jsonParser(roommates)
      }
    }
  }

  const apartment = await getApartment(params.id)
  const landlord = await getUser(apartment.landlordId)

  const roommates = await Promise.all(
    apartment.roommates.map(roommate => (
      getUser(roommate)
    ))
  )

  const reviewers = await Promise.all(
    apartment.reviews.map(review => (
      getUser(review.userId)
    ))
  )

  return {
    props: {
      apartment: jsonParser(apartment),
      landlord: jsonParser(landlord),
      roommates: jsonParser(roommates),
      reviewers: jsonParser(reviewers)
    }
  }
})