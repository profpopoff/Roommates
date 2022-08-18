import styles from '../styles/pages/Home.module.scss'

import { wrapper } from '../redux/store'
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
// todo --------------------------------------------------------------------------------------------------------
// todo: добавить проверку на наличие куки, и если он есть, но пользователь не авторизован, то авторизовать его на сервере (возможно нужно сделать это на каждой странице)
// todo --------------------------------------------------------------------------------------------------------
// export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
//   store.dispatch(setUser('propopo'));

//   return {
//     props: {
//     } // will be passed to the page component as props
//   };
// });

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/apartments')
  const data = await res.json()
  return { props: { apartments: data } }
}