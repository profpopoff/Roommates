import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/CreateProperty.module.css'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { wrapper } from '../../redux/store'
import { getUser } from '../api/users/[id]'
import { setUser } from '../../redux/slices/user'
import Layout from '../../components/Layout'
import { jsonParser } from '../../utils/functions'

export default function CreateProperty() {
  return (
    <Layout title="Create Property">
      <div>
        CreateProperty
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
  }
})