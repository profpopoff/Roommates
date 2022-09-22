import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import styles from '../styles/pages/Home.module.scss'
import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import { getApartments } from './api/apartments/index'
import { average, jsonParser } from '../utils/functions'
import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Post from '../components/Post/Post'

const Map = dynamic(() => import("../components/Map/Map"), { ssr: false })

export default function Home({ apartments, roommates }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Filters apartments={apartments} />
        <Posts apartments={apartments} roommates={roommates} />
        <Map apartments={apartments} />
      </div>
    </Layout>
  )
}

const Posts = ({ apartments, roommates }) => {

  const filters = useSelector((state) => state.filters.filters)

  const apartmentsArray = apartments.slice()

  apartmentsArray.map(apartment => {

    const ratings = apartment.reviews.map(review => review.rating)
    apartment.averageRating = average(ratings)

    if (!!apartment.roommates.length) {
      roommates.map(roommatesSet => {
        if (roommatesSet[0]._id === apartment.roommates[0]) {
          apartment.roommates = roommatesSet
        }
      })
    }
  })

  function sortByFunction(key, order = 'desc') {
    return function (a, b) {

      if (!a.hasOwnProperty(key.split('.')[0]) || !b.hasOwnProperty(key.split('.')[0])) {
        return 0;
      }

      const varA = key.split('.')[1] ? a[key.split('.')[0]][key.split('.')[1]] : a[key]
      const varB = key.split('.')[1] ? b[key.split('.')[0]][key.split('.')[1]] : b[key]

      let comparison = 0
      if (varA > varB) {
        comparison = 1
      } else if (varA < varB) {
        comparison = -1
      }

      return (
        (order == 'desc') ? (comparison * -1) : comparison
      )
    }
  }

  const [showPosts, setShowPosts] = useState(false)

  return (
    <section className={styles.posts} data-visible={showPosts}>
      <div className={styles.postsWrapper}>
        <button className={styles.showPostsBtn} onClick={() => setShowPosts(prevShowPosts => !prevShowPosts)}></button>
        <div className={styles.postsContent}>
          {apartmentsArray.slice().sort(sortByFunction(filters.sortBy[0], filters.sortBy[1])).map(apartment => {
            return (
              apartment.isVisible &&
              ((filters.withRoommates && ['bed', 'room'].includes(apartment.type)) || (!filters.withRoommates && ['flat', 'house', 'townhouse'].includes(apartment.type))) &&
              (apartment.price.value <= filters.price[1] && apartment.price.value >= filters.price[0]) &&
              (apartment.stats.floor <= filters.floor[1] && apartment.stats.floor >= filters.floor[0]) &&
              filters.type.includes(apartment.type) &&
              (!filters.city ? true : apartment.address.city === filters.city) &&
              <Post key={apartment._id} {...apartment} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(jsonParser(user)))
  }

  const apartments = await getApartments()
  const roommatesArray = []

  for (let apartment of apartments) {
    if (!!apartment.roommates.length) {
      const roommates = await Promise.all(
        apartment.roommates.map(roommate => (
          getUser(roommate)
        ))
      )
      roommatesArray.push(roommates)
    }
  }

  return { props: { apartments: jsonParser(apartments), roommates: jsonParser(roommatesArray) } }
})