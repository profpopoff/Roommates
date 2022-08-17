import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/pages/Profile.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faPenToSquare, faComments, faHeart, faBuilding, faHouseChimney } from '@fortawesome/free-solid-svg-icons'

import Layout from '../components/Layout'


// todo: redirect from here if not authorzed
export default function Profile() {

  const user = useSelector((state) => state.user.info)

  return (
    <Layout title={`${user?.name} ${user?.surname}`}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Picture />
        </div>
      </div>
    </Layout>
  )
}

const Picture = () => {

  const user = useSelector((state) => state.user.info)

  const [editActive, setEditActive] = useState(false)

  return (
    <div className={styles.image}>
      <Image src={user?.image ? user.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
      <button className={styles.editBtn} onClick={() => { setEditActive(true) }}>
        <FontAwesomeIcon icon={faPenToSquare} /> <span className="sr-only">Edit profile</span>
      </button>
    </div>
  )
}