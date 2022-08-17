import styles from '../styles/pages/Home.module.scss'

import Layout from '../components/Layout'
import Filters from '../components/Filters/Filters'
import Post from '../components/Post/Post'
import Map from '../components/Map/Map'
import { average } from '../components/utils'

export default function Home({ apartments }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Filters />
        <div className={styles.posts}>
          {apartments?.map(apartment => {
            const ratings = apartment.reviews?.map(review => review.rating)
            return (
              <Post key={apartment._id} {...apartment} averageRating={average(ratings)} />
            )
          })}
        </div>
        {/* <Map /> */}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/apartments')
  const data = await res.json()
  return { props: { apartments: data } }
}