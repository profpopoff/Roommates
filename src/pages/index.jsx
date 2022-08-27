import dynamic from 'next/dynamic'
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
  
  // const Map = dynamic(() => import("../components/Map/Map"), {
  //   loading: () => "Loading...",
  //   ssr: false
  // })
  
  return (
    <Layout>
      <div className={styles.container}>
        <Filters apartments={apartments} />
        <Posts apartments={apartments} />
        <Map apartments={apartments} />
      </div>
    </Layout>
  )
}

const Posts = ({ apartments }) => {

  const filters = useSelector((state) => state.filters.filters)

  const apartmentsArray = apartments.slice()

  apartmentsArray.map(apartment => {
    const ratings = apartment.reviews.map(review => review.rating)
    apartment.averageRating = average(ratings)
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

  return (
    <div className={styles.posts}>
      {apartmentsArray.slice().sort(sortByFunction(filters.sortBy[0], filters.sortBy[1])).map(apartment => {
        return (
          apartment.isVisible &&
          ((filters.withRoommates && ['bed', 'room'].includes(apartment.type)) || (!filters.withRoommates && ['flat', 'house', 'townhouse'].includes(apartment.type))) &&
          (apartment.price.value <= filters.price.max && apartment.price.value >= filters.price.min) &&
          filters.type.includes(apartment.type) &&
          (apartment.stats.floor <= filters.floor.max && apartment.stats.floor >= filters.floor.min) &&
          <Post key={apartment._id} {...apartment} />
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