import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Chat.module.css'

import Layout from '../components/Layout'
import CustomInput from '../components/CustomInput/CustomInput'
import CustomTextarea from '../components/CustomTextArea/CustomTextArea'
import CustomToggle from '../components/CustomToggle/CustomToggle'

export default function Chat() {
  return (
    <Layout title="Chat">
      <div>
        Chat
        <CustomInput 
          name="email"
          label="Почта"
          type="number"
          value="123"
          handleChange={(e) => console.log(e.target.value)}
        />
        <CustomTextarea 
          label="Описание" 
          name="desc" 
          value={321}
          handleChange={(e) => console.log(e.target.value)}
        />  
        <CustomToggle name='кухня' label="Кухня" checked={true} onChange={(e) => console.log(e.target.value, e.target.checked)} />
      </div>
    </Layout>
  )
}
