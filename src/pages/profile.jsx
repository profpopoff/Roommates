import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/pages/Profile.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faPenToSquare, faComments, faHeart, faBuilding, faHouseChimney } from '@fortawesome/free-solid-svg-icons'

import Layout from '../components/Layout'

export default function Profile() {

  const user = useSelector((state) => state.user.info)

  return (
    <Layout title={`${user?.name} ${user?.surname}`}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Picture image={user?.image} />
          <Headline name={user?.name} surname={user?.surname} phone={user?.phone} email={user?.email} />
          <Navigation homeId={user?.homeId} />
        </div>
      </div>
    </Layout >
  )
}

const Picture = ({ image }) => {

  const user = useSelector((state) => state.user.info)

  const [editActive, setEditActive] = useState(false)

  return (
    <div className={styles.image}>
      <Image className={styles.src} src={image ? image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
      <button className={styles.editBtn} onClick={() => { setEditActive(true) }}>
        <FontAwesomeIcon icon={faPenToSquare} /> <span className="sr-only">Edit profile</span>
      </button>
    </div>
  )
}

const Headline = (props) => {
  return (
    <div className={styles.headline}>
      <h3 className={styles.name}>{props.name} {props.surname}</h3>
      <h3 className={styles.phone}><FontAwesomeIcon icon={faPhone} /> {props.phone}</h3>
      <h3 className={styles.email}><FontAwesomeIcon icon={faEnvelope} /> {props.email}</h3>
    </div>
  )
}

const Navigation = ({ homeId }) => {
  return (
    <nav className={styles.navigation}>
      <Link href="/property">
        <a className={styles.navBtn}>
          <FontAwesomeIcon icon={faBuilding} className={styles.icon} />
          <span className={styles.text}>Недвижимость</span>
        </a>
      </Link>
      <Link href="/chat">
        <a className={styles.navBtn}>
          <FontAwesomeIcon icon={faComments} className={styles.icon} />
          <span className={styles.text}>Чаты</span>
        </a>
      </Link>
      <Link href="/favourites">
        <a className={styles.navBtn}>
          <FontAwesomeIcon icon={faHeart} className={styles.icon} />
          <span className={styles.text}>Избранное</span>
        </a>
      </Link>
      {
        homeId &&
        <Link href={`/apartment/${homeId}`}>
          <a className={styles.navBtn}>
            <FontAwesomeIcon icon={faHouseChimney} className={styles.icon} />
            <span className={styles.text}>Мое жилье</span>
          </a>
        </Link>
      }
    </nav>
  )
}