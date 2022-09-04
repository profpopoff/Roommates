import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styles from '../styles/pages/Chat.module.scss'

import io from "socket.io-client"
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

let socket 

export default function Chat({ userChats, companions }) {
  
  
  // const [username, setUsername] = useState("")
  //   const [chosenUsername, setChosenUsername] = useState("")
  //   const [message, setMessage] = useState("")
  //   const [messages, setMessages] = useState([])

  const user = useSelector((state) => state.user.info)

    useEffect(() => {
        socketInitializer()
    }, [])

    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
        await fetch("/api/chats/socket")
        socket = io()
        socket.emit('setup', user._id)
        // socket.on("newIncomingMessage", (msg) => {
        //     setMessages((currentMsg) => [
        //         ...currentMsg,
        //         { author: msg.author, message: msg.message },
        //     ])
        //     console.log(messages)
        // })
    }

  //   const sendMessage = async () => {
  //       socket.emit("createdMessage", { author: chosenUsername, message })
  //       setMessages((currentMsg) => [
  //           ...currentMsg,
  //           { author: chosenUsername, message },
  //       ])
  //       setMessage("")
  //   }
  //   const handleKeypress = (e) => {
  //       //it triggers by pressing the enter key
  //       if (e.keyCode === 13) {
  //           if (message) {
  //               sendMessage()
  //           }
  //       }
  //   }
  //   return (
  //     <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
  //       <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
  //         {!chosenUsername ? (
  //           <>
  //             <h3 className="font-bold text-white text-xl">
  //               How people should call you?
  //             </h3>
  //             <input
  //               type="text"
  //               placeholder="Identity..."
  //               value={username}
  //               className="p-3 rounded-md outline-none"
  //               onChange={(e) => setUsername(e.target.value)}
  //             />
  //             <button
  //               onClick={() => {
  //                 setChosenUsername(username);
  //               }}
  //               className="bg-white rounded-md px-4 py-2 text-xl"
  //             >
  //               Go!
  //             </button>
  //           </>
  //         ) : (
  //           <>
  //             <p className="font-bold text-white text-xl">
  //               Your username: {username}
  //             </p>
  //             <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
  //               <div className="h-full last:border-b-0 overflow-y-scroll">
  //                 {messages.map((msg, i) => {
  //                   return (
  //                     <div
  //                       className="w-full py-1 px-2 border-b border-gray-200"
  //                       key={i}
  //                     >
  //                       {msg.author} : {msg.message}
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //               <div className="border-t border-gray-300 w-full flex rounded-bl-md">
  //                 <input
  //                   type="text"
  //                   placeholder="New message..."
  //                   value={message}
  //                   className="outline-none py-2 px-2 rounded-bl-md flex-1"
  //                   onChange={(e) => setMessage(e.target.value)}
  //                   onKeyUp={handleKeypress}
  //                 />
  //                 <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
  //                   <button
  //                     className="group-hover:text-white px-3 h-full"
  //                     onClick={() => {
  //                       sendMessage();
  //                     }}
  //                   >
  //                     Send
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           </>
  //         )}
  //       </main>
  //     </div>
  //   );
  // }

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
      <div className={styles.messages} >
        {chat.messages.map((message, index) => (
          <Message key={index} {...message} userId={user._id} image={user._id === message.sender ? user.image : companion.image} />
        ))}
      </div>
      <MessageInput user={user} chat={chat} />
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

const MessageInput = ({ user, chat }) => {

  const { request } = useHttp()

  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage) {
      try {
        await request(`/api/chats/${chat._id}`, 'PUT',
          JSON.stringify({ messages: [...chat.messages, { sender: user._id, text: newMessage }] }),
          { 'Content-Type': 'application/json;charset=utf-8' })
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