import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
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
import { useHttp } from '../hooks/http.hook'

export default function Chat({ userChats, companions }) {

  const [currentChat, setCurrentChat] = useState(null)

  return (
    <Layout title="Chat">
      <div className={styles.container}>
        <div className={styles.conversations}>
          <h2>Доступные собеседники</h2>
          {userChats.map((chat, index) => (
            <Conversation key={chat._id} companion={companions[index]} chat={chat} setCurrentChat={setCurrentChat} />
          ))}
        </div>
        {currentChat && <Box {...currentChat} />}
      </div>
    </Layout>
  )
}

const Conversation = ({ companion, chat, setCurrentChat }) => {

  const [conversationMenuActive, setConversationMenuActive] = useState(false)

  return (
    <div className={styles.conversation}>
      <div className={styles.user} onClick={() => setCurrentChat({ chat, companion })} >
        <div className={styles.image}>
          <Image className={styles.src} src={companion.image ? companion.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
          <span className={styles.notification}>1</span>
        </div>
        <div className={styles.name}>{companion.name} {companion.surname}</div>
      </div>
      <button className={styles.conversationMenuBtn} onClick={() => setConversationMenuActive(true)}>
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      <ConversationMenu active={conversationMenuActive} setActive={setConversationMenuActive} />
    </div>
  )
}

const ConversationMenu = (props) => {
  return (
    <Modal active={props.active} setActive={props.setActive}>
      <h3>text</h3>
    </Modal>
  )
}

const Box = ({ companion, chat }) => {

  const user = useSelector((state) => state.user.info)

  return (
    <div className={styles.box}>
      <h2 className={styles.name}>{companion.name} {companion.surname}</h2>
      <div className={styles.messages}>
        {chat.messages.map((message, index) => (
          <Message key={index} {...message} userId={user._id} image={user._id === message.sender ? user.image : companion.image} />
        ))}
      </div>
      <MessageInput user={user} chat={chat} />
    </div>
  )
}

const Message = ({ text, sender, createdAt, userId, image }) => {
  return (
    <div className={`${styles.message} ${userId === sender && styles.own}`}>
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

const MessageInput = ({ user, chat }) => {

  const { request, success, loading, error } = useHttp()

  const [newMessage, setNewMessage] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await request(`/api/chats/${chat._id}`, 'PUT',
        JSON.stringify({messages: [...chat.messages, { sender: user._id, text: newMessage }]}),
        { 'Content-Type': 'application/json;charset=utf-8' })
    } catch (error) { }
  }

  return (
    <div className={styles.newMessage}>
      <textarea
        className={styles.textarea}
        placeholder="Напишите что-нибудь..."
        onChange={(e) => setNewMessage(e.target.value)}
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
  }

  const userId = store.getState().user.info._id
  const userChats = await getUserChats(userId)
  if (!!userChats.length) {
    const companions = await Promise.all(
      userChats.map(chat => (
        getUser(chat.members.filter(item => item !== userId)[0])
      ))
    )

    return { props: { userChats: jsonParser(userChats), companions: jsonParser(companions) } }
  }

})