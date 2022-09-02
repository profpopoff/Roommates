import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/Favourites.module.scss'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { getApartment } from './api/apartments/[id]'
import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import Layout from '../components/Layout'
import { jsonParser } from '../utils/functions'
import Post from '../components/Post/Post'

export default function Favourites({ favourites }) {
  return (
    <Layout title="Favourites">
      <div className={styles.container}>
        {favourites ? favourites.map(favourite => (
          // <div className={styles.favourite}>
            <Post {...favourite} />
          // {/* </div> */}
          // <Favourite {...favourite} />
        )) :
          <h2>Ваш список избранного пуст...</h2>}
      </div>
    </Layout>
  )
}

const Favourite = ({ ...favourite }) => {
  return (
    <div className={styles.favourite}>
      <div className={styles.image}>
        <Image className={styles.src} src={favourite.images[0]} alt="" layout="fill" />
      </div>
      {favourite.title}
    </div>
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
      return { props: { favourites: jsonParser(favourites) } }
    }
  }
})