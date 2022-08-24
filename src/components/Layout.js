import Head from 'next/head'

import Header from './Header/Header'

export default function Layout({ children, title }) {
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