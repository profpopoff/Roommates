import Head from 'next/head'

import Header from './Header/Header'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { set } from '../redux/userSlice'

export default function Layout({ children, title }) {

  const dispatch = useDispatch()

  // this thing sets user info if we have a cookie token
  useEffect(() => {
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    if (token) {
      const decodedToken = jwt.decode(token)
      fetch(`/api/users/${decodedToken.id}`)
        .then(response => response.json())
        .then(user => dispatch(set(user)))
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title && `${title} | `}Roommates</title>
        <meta name="description" content="Rent a place with Roommates!" />
        <link rel="icon" href="/img/icon.png" />
      </Head>
      <Header />
      <main>
        {children}
      </main>
    </>
  )
}