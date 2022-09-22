import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCirclePlus, faBed, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons'

import styles from '../../styles/pages/Property.module.scss'
import { wrapper } from '../../redux/store'
import { setUser } from '../../redux/slices/user'
import { getUser } from '../api/users/[id]'
import { getApartment } from '../api/apartments/[id]'
import { jsonParser } from '../../utils/functions'
import Layout from '../../components/Layout'
import CustomToggle from '../../components/CustomToggle/CustomToggle'
import Modal from '../../components/Modal/Modal'
import CustomInput from '../../components/CustomInput/CustomInput'
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea'

export default function Property({ properties }) {
  return (
    <Layout title="My Property">
      <div className={styles.container}>
        {properties && properties.map(property => (
          <div className={styles.property} key={property._id}>
            <Headline id={property._id} title={property.title} {...property.address} {...property.price} />
            <Buttons {...property} />
          </div>
        ))}
        <Link href={'/property/create'} passHref>
          <button className={styles.addBtn}><FontAwesomeIcon icon={faCirclePlus} className="icon" /> Добавить</button>
        </Link>
      </div>
    </Layout>
  )
}

const Headline = (props) => {
  return (
    <div className={styles.headline}>
      <Link href={`/apartment/${props.id}`} passHref>
        <h2 className={styles.title}>{props.title}</h2>
      </Link>
      <h3 className={styles.address}>
        <FontAwesomeIcon icon={faLocationDot} />{`${props.city}, ${props.street}, д.${props.house}, кв.${props.apartment}`}
      </h3>
      <h3 className={styles.price}>
        <span>{props.value.toLocaleString('ru', {
          style: 'currency',
          currency: props.currency,
          minimumFractionDigits: 0
        })}</span>/месяц
      </h3>
    </div>
  )
}

const Buttons = (props) => {

  const [editActive, setEditActive] = useState(false)

  return (
    <div className={styles.buttons}>
      <button className={styles.editBtn} onClick={() => setEditActive(true)}>
        <FontAwesomeIcon icon={faPenToSquare} /> Редактировать
      </button>
      <Edit {...props} editActive={editActive} setEditActive={setEditActive} />
      <VisibilityToggle {...props} />
    </div>
  )
}

// todo: add error handler
const Edit = (props) => {

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const user = useSelector((state) => state.user.info)
  const dispatch = useDispatch()

  const [editForm, setEditForm] = useState({})

  const editFormHandler = event => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value })
  }

  const editHandler = async (e) => {
    e.preventDefault()
    try {
      await fetch(`/api/apartments/${props._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(editForm),
      }).then(res => { res.status < 300 && refreshData() })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async (id) => {
    try {
      await fetch(`/api/apartments/${id}`, { method: 'DELETE' })
        .then(dispatch(setUser({ property: user.property.filter(item => item !== props._id) })))
        .then(res => { res.status < 300 && refreshData() })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal active={props.editActive} setActive={props.setEditActive}>
      <h2 className={styles.title}><FontAwesomeIcon icon={faPenToSquare} /> Редактировать</h2>
      <form className={styles.editForm} onSubmit={editHandler}>
        <CustomInput
          name='title'
          label='Название'
          type='text'
          value={props.title}
          handleChange={editFormHandler}
        />
        <CustomInput
          name='price.value'
          label='Цена'
          type='number'
          value={props.price.value}
          handleChange={editFormHandler}
        />
        <CustomTextArea
          label="Описание"
          name="desc"
          value={props.desc}
          handleChange={editFormHandler}
        />
        <input type="submit" className="submit-btn" value="Выполнить" />
      </form>
      <button
        className={styles.deleteBtn}
        onClick={e => {
          e.preventDefault()
          deleteHandler(props._id)
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} className="icon" /> удалить запись
      </button>
    </Modal>
  )
}

const VisibilityToggle = (props) => {

  const visibilityHandler = async (e) => {
    try {
      await fetch(`/api/apartments/${e.target.value.split('_')[1]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ [e.target.value.split('_')[0]]: e.target.checked }),
      })
      setIsVisible(prevState => !prevState)
    } catch (error) {
      console.log(error)
    }
  }

  const [isVisible, setIsVisible] = useState(props.isVisible)

  return (
    <CustomToggle
      name={"isVisible_" + props._id}
      label="Отображать"
      checked={isVisible}
      onChange={visibilityHandler}
    />
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(JSON.parse(JSON.stringify(user))))
    const propertyIds = store.getState().user.info.property
    if (propertyIds.length) {
      const properties = await Promise.all(
        propertyIds.map(propertyId => (
          getApartment(propertyId)
        ))
      )
      return { props: { properties: jsonParser(properties) } }
    }
  }
})