import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/pages/Profile.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faPenToSquare, faComments, faHeart, faBuilding, faHouseChimney } from '@fortawesome/free-solid-svg-icons'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import Layout from '../components/Layout'
import Modal from '../components/Modal/Modal'
import CustomInput from '../components/CustomInput/CustomInput'

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

  const [editActive, setEditActive] = useState(false)

  return (
    <div className={styles.image}>
      <Image className={styles.src} src={image ? image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
      <button className={styles.editBtn} onClick={() => { setEditActive(true) }}>
        <FontAwesomeIcon icon={faPenToSquare} /> <span className="sr-only">Edit profile</span>
      </button>
      <Edit editActive={editActive} setEditActive={setEditActive} />
    </div>
  )
}

const Edit = (props) => {

  const user = useSelector((state) => state.user.info)
  const dispatch = useDispatch()
  
  const [editForm, setEditForm] = useState({})
  
  const changeEditHandler = event => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value })
  }
  
  const editHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(editForm),
      })
      dispatch(setUser(editForm))
  } catch (error) {
    console.log(error)
  }
  }


  return user && (
    <Modal active={props.editActive} setActive={props.setEditActive}>
      <h2 className={styles.title}><FontAwesomeIcon icon={faPenToSquare} /> Редактировать</h2>
      <form className={styles.editForm} onSubmit={editHandler}>
        <CustomInput
          name='email'
          label='Почта'
          type='email'
          value={user.email}
          handleChange={changeEditHandler}
        />
        <div className={styles.name}>
          <CustomInput
            name='name'
            label='Имя'
            type='text'
            value={user.name}
            handleChange={changeEditHandler}
          />
          <CustomInput
            name='surname'
            label='Фамилия'
            type='text'
            value={user.surname}
            handleChange={changeEditHandler}
          />
        </div>
        <CustomInput
          name='phone'
          label='Телефон'
          type='phone'
          value={user.phone}
          handleChange={changeEditHandler}
        />
        <input type="submit" className="submit-btn" value="Выполнить" />
      </form>
    </Modal>
  )
}

const Headline = (props) => {
  return (
    <div className={styles.headline}>
      <h3 className={styles.name}>{props.name} {props.surname}</h3>
      <h3 className={styles.contact}><FontAwesomeIcon icon={faPhone} />{props.phone}</h3>
      <h3 className={styles.contact}><FontAwesomeIcon icon={faEnvelope} />{props.email}</h3>
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

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(JSON.parse(JSON.stringify(user))))
  }
})