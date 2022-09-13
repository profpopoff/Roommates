import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useHttp } from '../../hooks/http.hook'
import { setModal } from '../../redux/slices/modal'
import { setUser } from '../../redux/slices/user'
import Modal from '../Modal/Modal'
import CustomInput from '../CustomInput/CustomInput'

export default function Settings() {

   const { request, loading, error } = useHttp()

   const dispatch = useDispatch()
   const loginActive = useSelector((state) => state.modal.modals.loginActive)

   const [loginForm, setLoginForm] = useState({})

   const loginFormHandler = event => {
      setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
   }

   const loginHandler = async (e) => {
      e.preventDefault()
      try {
         const user = await request('/api/auth/login', 'POST', JSON.stringify(loginForm), { 'Content-Type': 'application/json;charset=utf-8' })
         if (user) {
            dispatch(setUser(user))
            dispatch(setModal({ loginActive: false }))
         }
      } catch (error) { }
   }

   return (
      <Modal
         active={loginActive}
         setActive={() => dispatch(setModal({ loginActive: false }))}
      >
         <h2>Вход</h2>
         <form className="auth-form" onSubmit={loginHandler}>
            <CustomInput
               name={loginActive ? 'email' : `loginEmail`}
               label='Почта'
               type='email'
               value={loginForm.email ? loginForm.email : ''}
               handleChange={loginFormHandler}
            />
            <CustomInput
               name={loginActive ? 'password' : `loginPassword`}
               label='Пароль'
               type='password'
               handleChange={loginFormHandler}
            />
            <input className="submit-btn" type="submit" disabled={loading} value={loading ? 'Вход...' : 'Войти'} />
            {error && <span className='error'>{error}</span>}
            <a className="register-link" onClick={() => dispatch(setModal({ registerActive: true }))}>Нет аккаунта?</a>
         </form>
      </Modal>
   )
}