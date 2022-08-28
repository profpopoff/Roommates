import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
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
import CustomInput from '../components/CustomInput/CustomInput'
import CustomTextarea from '../components/CustomTextArea/CustomTextArea'
import CustomToggle from '../components/CustomToggle/CustomToggle'
import { jsonParser } from '../utils/functions'
import Modal from '../components/Modal/Modal'

export default function Chat() {
  return (
    <Layout title="Chat">
      <div className={styles.container}>
        <div className={styles.conversations}>
          <h2>Доступные собеседники</h2>
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
        </div>
        <Box />
      </div>
    </Layout>
  )
}

const Conversation = () => {

  const [conversationMenuActive, setConversationMenuActive] = useState(false)

  return (
    <div className={styles.conversation}>
      <div className={styles.user}>
        <div className={styles.image}>
          <Image className={styles.src} src={'/img/cover.jpeg'} alt="user profile picture" layout='fill' />
          <span className={styles.notification}>1</span>
        </div>
        <div className={styles.name}>Алексей Иванов</div>
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

const Box = () => {
  return (
    <div className={styles.box}>
      <h2 className={styles.name}>Алексей Иванов</h2>
      <div className={styles.messages}>
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      <div className={styles.newMessage}>
        <textarea
          className={styles.textarea}
          placeholder="Напишите что-нибудь..."
          // onChange={(e) => setNewMessage(e.target.value)}
          // value={newMessage}
        ></textarea>
        {/* <button className="chat-box-btn" onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane} /></button> */}
        <button className={styles.btn}><FontAwesomeIcon icon={faPaperPlane} /></button>
      </div>
    </div>
  )
}

const Message = () => {
  return (
    <div className={`${styles.message} ${styles.own}`}>
      <div className={styles.body}>
        <div className={styles.image}>
          <Image className={styles.src} src={'/img/cover.jpeg'} alt="user profile picture" layout='fill' />
        </div>
        <div className={styles.text}>
          Hello! How are youy?
          {/* <div className={styles.time}>{format(props.message.createdAt)}</div>  */}
          <div className={styles.time}>{format('2022-07-22T12:27:43.388Z')}</div>
        </div>
      </div>
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
})