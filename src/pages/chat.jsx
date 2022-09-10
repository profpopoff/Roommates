import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styles from '../styles/pages/Chat.module.scss'

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faTrashCan, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { format } from 'timeago.js'

import { wrapper } from '../redux/store'
import { getUser } from './api/users/[id]'
import { setUser } from '../redux/slices/user'
import Layout from '../components/Layout'
import { jsonParser } from '../utils/functions'
import Modal from '../components/Modal/Modal'
import { getUserChats } from './api/chats/[id]'
import { getApartment } from './api/apartments/[id]'
import { useHttp } from '../hooks/http.hook'
import CustomToggle from '../components/CustomToggle/CustomToggle'

export default function Chat({ userChats, companions, properties }) {

  const [currentChat, setCurrentChat] = useState(null)

  return (
    <Layout title="Chat">
      <div className={styles.container}>
        <div className={styles.conversations}>
          <h2>Доступные собеседники</h2>
          {userChats && userChats.map((chat, index) => (
            <Conversation
              key={chat._id}
              companion={companions[index]}
              setCurrentChat={setCurrentChat}
              chat={chat}
              properties={properties} />
          ))}
        </div>
        {currentChat && <Box {...currentChat} />}
      </div>
    </Layout>
  )
}

// todo: add notifications
const Conversation = ({ companion, chat, setCurrentChat, properties }) => {

  const [conversationMenuActive, setConversationMenuActive] = useState(false)

  return (
    <div className={styles.conversation}>
      <div className={styles.user} onClick={() => setCurrentChat({ chat, companion })} >
        <div className={styles.image}>
          <Image className={styles.src} src={companion.image ? companion.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
          {/* <span className={styles.notification}>1</span> */}
        </div>
        <div className={styles.name}>{companion.name} {companion.surname}</div>
      </div>
      <button className={styles.conversationMenuBtn} onClick={() => setConversationMenuActive(true)}>
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <ConversationMenu
        active={conversationMenuActive}
        setActive={setConversationMenuActive}
        setCurrentChat={setCurrentChat}
        companion={companion}
        chatId={chat._id}
        properties={properties} />
    </div>
  )
}

const ConversationMenu = ({ active, setActive, companion, chatId, properties, setCurrentChat }) => {

  const [companionPlace, setCompanionPlace] = useState(companion.homeId)

  const { request, success, loading, error } = useHttp()

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const deleteHandler = async (id) => {
    try {
      await fetch(`/api/chats/${id}`, { method: 'DELETE' })
        .then(res => { res.status < 300 && refreshData() })
      setCurrentChat(null)
    } catch (error) {
      console.log(error)
    }
  }

  const roommateHandler = async (e, property) => {
    if (e.target.checked) {

      setCompanionPlace(e.target.value)

      try {
        await request(`/api/apartments/${e.target.value}`, 'PUT',
          JSON.stringify({ roommates: [...property.roommates, companion._id] }),
          { 'Content-Type': 'application/json;charset=utf-8' })
      } catch (error) { }

      try {
        await request(`/api/users/${companion._id}`, 'PUT',
          JSON.stringify({ homeId: e.target.value }),
          { 'Content-Type': 'application/json;charset=utf-8' })
      } catch (error) { }

    } else {

      setCompanionPlace(null)

      try {
        await request(`/api/apartments/${e.target.value}`, 'PUT',
          JSON.stringify({ roommates: property.roommates.filter(item => item !== companion._id) }),
          { 'Content-Type': 'application/json;charset=utf-8' })
      } catch (error) { }

      try {
        await request(`/api/users/${companion._id}`, 'PUT',
          JSON.stringify({ homeId: null }),
          { 'Content-Type': 'application/json;charset=utf-8' })
      } catch (error) { }
    }
  }

  return (
    <Modal active={active} setActive={setActive}>
      <h2>{companion.name} {companion.surname}</h2>
      {!!properties.length &&
        <div className={styles.rent}>
          <h3>Арендует:</h3>
          {properties.map(property => (
            <div key={property._id} className={styles.property}>
              <CustomToggle
                name={property._id}
                label={property.title}
                checked={companionPlace && companionPlace === property._id}
                disabled={companionPlace && companionPlace !== property._id}
                onChange={e => roommateHandler(e, property)}
              />
            </div>
          ))}
        </div>
      }
      <button
        className={styles.deleteBtn}
        onClick={e => {
          e.preventDefault()
          deleteHandler(chatId)
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} /> удалить собеседника
      </button>
    </Modal >
  )
}

const Box = ({ companion, chat }) => {

  const router = useRouter()

  const user = useSelector((state) => state.user.info)

  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages(chat.messages)
    router.replace(router.asPath)
  }, [chat])

  return (
    <div className={styles.box}>
      <h2 className={styles.name}>{companion.name} {companion.surname}</h2>
      <div className={styles.messages} >
        {messages.map((message, index) => (
          <Message key={index} {...message} userId={user?._id} image={user?._id === message.sender ? user.image : companion.image} />
        ))}
      </div>
      <MessageInput user={user} chat={chat} setMessages={setMessages} />
    </div>
  )
}

const Message = ({ text, sender, createdAt, userId, image }) => {

  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current?.scrollIntoView()
  }, [text])

  return (
    <div className={`${styles.message} ${userId === sender && styles.own}`} ref={scrollRef} >
      <div className={styles.body}>
        <div className={styles.image}>
          <Image className={styles.src} src={image ? image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
        </div>
        <div className={styles.text}>
          {text}
          <div className={styles.time}>{format(createdAt)}</div>
        </div>
      </div>
    </div>
  )
}

const MessageInput = ({ user, chat, setMessages }) => {

  const { request } = useHttp()

  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage) {
      try {
        await request(`/api/chats/${chat._id}`, 'PUT',
          JSON.stringify({ messages: [...chat.messages, { sender: user?._id, text: newMessage }] }),
          { 'Content-Type': 'application/json;charset=utf-8' })
        setMessages(prevMessages => [...prevMessages, { sender: user?._id, text: newMessage, createdAt: new Date() }])
        setNewMessage('')
      } catch (error) { }
    }
  }

  return (
    <div className={styles.newMessage}>
      <textarea
        className={styles.textarea}
        placeholder="Напишите что-нибудь..."
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
      ></textarea>
      <button className={styles.btn} onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane} /></button>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {

  const cookies = req.headers.cookie

  if (cookies) {
    const { token } = cookie.parse(cookies)
    const decodedToken = jwt.decode(token)
    const user = await getUser(decodedToken.id)
    store.dispatch(setUser(jsonParser(user)))
    const userId = store.getState().user.info._id
    const userChats = await getUserChats(userId)

    const companions = await Promise.all(
      userChats.map(chat => (
        getUser(chat.members.filter(item => item !== userId)[0])
      ))
    )

    const propertyIds = store.getState().user.info.property
    const properties = await Promise.all(
      propertyIds.map(propertyId => (
        getApartment(propertyId)
      ))
    )

    return { props: { userChats: jsonParser(userChats), companions: jsonParser(companions), properties: jsonParser(properties) } }
  }
})