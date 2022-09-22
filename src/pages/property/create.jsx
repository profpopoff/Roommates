import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

import styles from '../../styles/pages/CreateProperty.module.scss'
import { wrapper } from '../../redux/store'
import { setUser } from '../../redux/slices/user'
import { getUser } from '../api/users/[id]'
import { useHttp } from '../../hooks/http.hook'
import { jsonParser } from '../../utils/functions'
import Layout from '../../components/Layout'
import Dropdown from '../../components/Dropdown/Dropdown'
import CustomToggle from '../../components/CustomToggle/CustomToggle'
import CustomInput from '../../components/CustomInput/CustomInput'
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea'

export default function CreateProperty() {
  return (
    <Layout title="Create Property">
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Form />
        </div>
      </div>
    </Layout>
  )
}

const Form = () => {

  const user = useSelector((state) => state.user.info)

  const { request, success, loading, error } = useHttp()

  const [createForm, setCreateForm] = useState({})

  const changeHandler = (name, value) => {
    setCreateForm({ ...createForm, [name]: value })
  }

  const createHandler = async event => {
    event.preventDefault()

    const formData = new FormData()

    formData.append('upload_preset', 'roommates')

    let newImages = []
    if (createForm.images && createForm.title && createForm.address && createForm.price && createForm.stats && createForm.desc && createForm.conveniences) {
      for (const file of createForm.images) {
        formData.append('file', file)

        const data = await request('https://api.cloudinary.com/v1_1/placewithroommates/image/upload', 'POST', formData)

        newImages.push(data.secure_url)
      }
    }

    try {
      const data = await request('/api/apartments', 'POST',
        JSON.stringify({ ...createForm, landlordId: user._id, images: newImages }),
        { 'Content-Type': 'application/json;charset=utf-8' })
    } catch (error) { }
  }

  return (
    <form className={styles.addForm} onSubmit={createHandler}>
      <h2 className={styles.title}>Добавление записи</h2>
      <div className={styles.flex}>
        <CustomInput label="Заголовок" name="title" type="text" handleChange={e => changeHandler(e.target.name, e.target.value)} />
        <Type changeHandler={changeHandler} />
      </div>
      <Address changeHandler={changeHandler} />
      <Price changeHandler={changeHandler} />
      <Stats changeHandler={changeHandler} />
      <CustomTextArea label="Описание" name="desc" handleChange={e => changeHandler(e.target.name, e.target.value)} />
      <Conveniences changeHandler={changeHandler} />
      <Files changeHandler={changeHandler} />
      <input className="submit-btn" type="submit" disabled={loading} value={loading ? 'Выполнение...' : 'Выполнить'} />
      {error && <span className='error'>{error}</span>}
      {success && <span className='success'>Запись успешно добавлена!</span>}
    </form>
  )
}

const Type = ({ changeHandler }) => {

  const [typeActive, setTypeActive] = useState(false)

  const [type, setType] = useState('flat')

  return (
    <div className={styles.type}>
      <Dropdown
        active={typeActive}
        setActive={setTypeActive}
        button={
          <div className={styles.dropDownTitle}>
            <span>Тип:</span>
            <span>
              {type === 'room' ? 'Комната' : type === 'flat' ? 'Квартира' : type == 'house' ? 'Дом' : type == 'bed' ? 'Кровать' : 'Таунхаус'}
            </span>
          </div>
        }
      >
        <ul className={styles.list}>
          {type !== 'bed' && <li className={styles.item}
            onClick={() => { setType('bed'); setTypeActive(false); changeHandler('type', 'bed') }}
          >Кровать</li>}
          {type !== 'room' && <li className={styles.item}
            onClick={() => { setType('room'); setTypeActive(false); changeHandler('type', 'room') }}
          >Комната</li>}
          {type !== 'flat' && <li className={styles.item}
            onClick={() => { setType('flat'); setTypeActive(false); changeHandler('type', 'flat') }}
          >Квартира</li>}
          {type !== 'house' && <li className={styles.item}
            onClick={() => { setType('house'); setTypeActive(false); changeHandler('type', 'house') }}
          >Дом</li>}
          {type !== 'townhouse' && <li className={styles.item}
            onClick={() => { setType('townhouse'); setTypeActive(false); changeHandler('type', 'townhouse') }}
          >Таунхаус</li>}
        </ul>
      </Dropdown>
    </div>
  )
}

const Address = ({ changeHandler }) => {

  const [address, setAddress] = useState({})

  const addressHandler = event => {
    setAddress({ ...address, [event.target.name]: event.target.value })
    changeHandler('address', { ...address, [event.target.name]: event.target.value })
  }

  return (
    <div className={styles.address}>
      <CustomInput label="Город" name="city" type="text" handleChange={addressHandler} />
      <CustomInput label="Улица" name="street" type="text" handleChange={addressHandler} />
      <div className={styles.flex}>
        <CustomInput label="Дом" name="house" type="text" handleChange={addressHandler} />
        <CustomInput label="Квартира" name="apartment" type="number" handleChange={addressHandler} />
      </div>
    </div>
  )
}

// todo: добавь выбор валюты и частоты 
const Price = ({ changeHandler }) => {

  const [price, setPrice] = useState({})

  const priceHandler = event => {
    setPrice({ ...price, [event.target.name]: event.target.value })
    changeHandler('price', { ...price, [event.target.name]: event.target.value })
  }

  return (
    <div className={styles.price}>
      <CustomInput label="Цена" name="value" type="number" handleChange={priceHandler} />
      {/* <CustomInput label="Валюта" name="currency" type="text" handleChange={PriceHandler} />
      <CustomInput label="Частота" name="frequency" type="text" handleChange={PriceHandler} /> */}
    </div>
  )
}

const Stats = ({ changeHandler }) => {

  const [stats, setStats] = useState({})

  const statsHandler = event => {
    setStats({ ...stats, [event.target.name]: event.target.value })
    changeHandler('stats', { ...stats, [event.target.name]: event.target.value })
  }

  return (
    <div className={styles.flex}>
      <CustomInput label="Этаж" name="floor" type="number" handleChange={statsHandler} />
      <CustomInput label="Площадь (&#13217;)" name="area" type="number" handleChange={statsHandler} />
      <CustomInput label="Кол-во комнат" name="rooms" type="number" handleChange={statsHandler} />
    </div>
  )
}

const Conveniences = ({ changeHandler }) => {

  const [conveniences, setConveniences] = useState([])

  const addConvenience = event => {
    if (event.target.checked) {
      setConveniences([...conveniences, event.target.value])
      changeHandler('conveniences', [...conveniences, event.target.value])
    } else {
      setConveniences(conveniences.filter(item => item !== event.target.value))
      changeHandler('conveniences', conveniences.filter(item => item !== event.target.value))
    }
  }

  return (
    <div className={styles.conveniences}>
      <CustomToggle name='кухня' label="Кухня" checked={conveniences.includes('кухня')} onChange={addConvenience} />
      <CustomToggle name='wifi' label="Wifi" checked={conveniences.includes('wifi')} onChange={addConvenience} />
      <CustomToggle name='кондиционер' label="Кондиционер" checked={conveniences.includes('кондиционер')} onChange={addConvenience} />
      <CustomToggle name='балкон' label="Балкон" checked={conveniences.includes('балкон')} onChange={addConvenience} />
      <CustomToggle name='стиральная машина' label="Стиральная машина" checked={conveniences.includes('стиральная машина')} onChange={addConvenience} />
      <CustomToggle name='паркинг' label="Паркинг" checked={conveniences.includes('паркинг')} onChange={addConvenience} />
      <CustomToggle name='теплый пол' label="Теплый пол" checked={conveniences.includes('теплый пол')} onChange={addConvenience} />
      <CustomToggle name='духовка' label="Духовка" checked={conveniences.includes('духовка')} onChange={addConvenience} />
      <CustomToggle name='микроволновка' label="Микроволновка" checked={conveniences.includes('микроволновка')} onChange={addConvenience} />
      <CustomToggle name='холодильник' label="Холодильник" checked={conveniences.includes('холодильник')} onChange={addConvenience} />
      <CustomToggle name='пылесос' label="Пылесос" checked={conveniences.includes('пылесос')} onChange={addConvenience} />
      <CustomToggle name='телевизор' label="Телевизор" checked={conveniences.includes('телевизор')} onChange={addConvenience} />
      <CustomToggle name='можно с животными' label="Можно с животными" checked={conveniences.includes('можно с животными')} onChange={addConvenience} />
      <CustomToggle name='можно с детьми' label="Можно с детьми" checked={conveniences.includes('можно с детьми')} onChange={addConvenience} />
    </div>
  )
}

const Files = ({ changeHandler }) => {

  const addImages = event => {
    changeHandler('images', event.target.files)
  }

  return (
    <input
      type="file"
      multiple
      accept=".png,.jpeg,.jpg,.webp"
      onChange={addImages}
    />
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