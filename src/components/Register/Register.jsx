import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useHttp } from '../../hooks/http.hook'
import { setModal } from '../../redux/slices/modal'
import Modal from '../Modal/Modal'
import CustomInput from '../CustomInput/CustomInput'

export default function Register() {

   const { request, success, loading, error } = useHttp()

   const [registerForm, setRegiserForm] = useState({})
   const [passwordCheck, setPasswordCheck] = useState(null)
   const [dontMatch, setDontMatch] = useState(false)

   const dispatch = useDispatch()
   const registerActive = useSelector((state) => state.modal.modals.registerActive)

   const registerFormHandler = event => {
      setRegiserForm({ ...registerForm, [event.target.name]: event.target.value })
   }

   const registerHandler = async (e) => {
      e.preventDefault()
      if (passwordCheck === registerForm.password) {
         setDontMatch(false)

         if (registerForm.image) {
            const formData = new FormData()

            formData.append('upload_preset', 'roommates')
            formData.append('file', registerForm.image[0])

            const data = await request('https://api.cloudinary.com/v1_1/placewithroommates/image/upload', 'POST', formData)

            try {
               await request('/api/auth/register', 'POST',
                  JSON.stringify({ ...registerForm, image: data.secure_url }),
                  { 'Content-Type': 'application/json;charset=utf-8' })
            } catch (error) { }
         } else {
            try {
               await request('/api/auth/register', 'POST',
                  JSON.stringify(registerForm),
                  { 'Content-Type': 'application/json;charset=utf-8' })
            } catch (error) { }
         }
      } else { setDontMatch(true) }
   }


   return (
      <Modal
         active={registerActive}
         setActive={() => dispatch(setModal({ registerActive: false }))}
      >
         <h2>Регистрация</h2>
         <form className="auth-form" onSubmit={registerHandler}>
            <CustomInput
               name={registerActive ? 'email' : 'registerEmail'}
               label='Почта'
               type='email'
               handleChange={registerFormHandler}
            />
            <CustomInput
               name={registerActive ? 'password' : 'registerPassword'}
               label='Пароль'
               type='password'
               handleChange={registerFormHandler}
            />
            <CustomInput
               name='repeat-password'
               label='Повторите пароль'
               type='password'
               handleChange={(e) => setPasswordCheck(e.target.value)}
            />
            <div className="name">
               <CustomInput
                  name={registerActive ? 'name' : 'registerName'}
                  label='Имя'
                  type='text'
                  handleChange={registerFormHandler}
               />
               <CustomInput
                  name={registerActive ? 'surname' : 'registerSurname'}
                  label='Фамилия'
                  type='text'
                  handleChange={registerFormHandler}
               />
            </div>
            <CustomInput
               name={registerActive ? 'phone' : 'registerPhone'}
               label='Телефон'
               type='phone'
               handleChange={registerFormHandler}
            />
            <input
               type="file"
               accept=".png,.jpeg,.jpg,.webp"
               onChange={e => setRegiserForm({ ...registerForm, image: e.target.files })}
            />
            <input className="submit-btn" type="submit" disabled={loading} value={loading ? 'Выполнение...' : 'Выполнить'} />
            {error && <span className='error'>{error}</span>}
            {success && <span className='success'>Регистрация завершена!</span>}
            {dontMatch && <span className='error'>Пароли не совпадают</span>}
         </form>
      </Modal>
   )
}