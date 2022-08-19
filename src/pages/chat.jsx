import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Chat.module.css'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import Layout from '../components/Layout'
import CustomInput from '../components/CustomInput/CustomInput'
import CustomTextarea from '../components/CustomTextArea/CustomTextArea'
import CustomToggle from '../components/CustomToggle/CustomToggle'
import { jsonParser } from '../utils/functions'

export default function Chat() {
  return (
    <Layout title="Chat">
      <div>
        Chat
        <CustomInput
          name="email"
          label="Почта"
          type="number"
          value="123"
          handleChange={(e) => console.log(e.target.value)}
        />
        <CustomTextarea
          label="Описание"
          name="desc"
          value={321}
          handleChange={(e) => console.log(e.target.value)}
        />
        <CustomToggle name='кухня' label="Кухня" checked={true} onChange={(e) => console.log(e.target.value, e.target.checked)} />
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