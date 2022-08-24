import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/pages/Home.module.scss'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import { getApartments } from './api/apartments/index'
import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Post from '../components/Post/Post'
import Map from '../components/Map/Map'
import { average, jsonParser } from '../utils/functions'

export default function Home({ apartments }) {
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

const Posts = ({ apartments }) => {

  const filters = useSelector((state) => state.filters.filters)

  return (
    <div className={styles.posts}>
      {apartments.map(apartment => {
        const ratings = apartment.reviews.map(review => review.rating)
        return (
          apartment.isVisible &&
          filters.withRoommates === !!apartment.roommates.length  &&
           <Post key={apartment._id} {...apartment} averageRating={average(ratings)} />
        )
      })}
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
  }

  const apartments = await getApartments()

  return { props: { apartments: jsonParser(apartments) } }
})