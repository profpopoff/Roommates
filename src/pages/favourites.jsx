import Head from 'next/head'
import Image from 'next/image'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import styles from '../styles/pages/Favourites.module.scss'
import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import { getApartment } from './api/apartments/[id]'
import { jsonParser, average } from '../utils/functions'
import Layout from '../components/Layout'
import Post from '../components/Post/Post'

export default function Favourites({ favourites = [], roommates }) {

  const apartmentsArray = favourites.slice()

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

  return (
    <Layout title="Favourites">
      <div className={styles.container}>
        {!!apartmentsArray.length ? apartmentsArray.map(favourite => (
          <Post key={favourite._id} {...favourite} />
        )) :
          <h2>Ваш список избранного пуст...</h2>}
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(jsonParser(user)))
    const favouritesIds = store.getState().user.info.favourites
    if (favouritesIds.length) {
      const favourites = await Promise.all(
        favouritesIds.map(favouritesId => (
          getApartment(favouritesId)
        ))
      )

      const roommatesArray = []

      for (let apartment of favourites) {
        if (!!apartment.roommates.length) {
          const roommates = await Promise.all(
            apartment.roommates.map(roommate => (
              getUser(roommate)
            ))
          )
          roommatesArray.push(roommates)
        }
      }

      return { props: { favourites: jsonParser(favourites), roommates: jsonParser(roommatesArray) } }
    }
  }
})