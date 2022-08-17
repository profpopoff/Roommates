import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Header.module.scss'

import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faGear, faCircleInfo, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faComments, faHeart, faBuilding } from '@fortawesome/free-regular-svg-icons'

import Dropdown from '../Dropdown/Dropdown'
import Modal from '../Modal/Modal'
import CustomToggle from '../CustomToggle/CustomToggle'
import CustomInput from '../CustomInput/CustomInput'
import { exit, set } from '../../redux/userSlice'
import { useRef } from 'react'

export default function Header() {
    return (
        <div className={styles.container}>
            <Logo />
            <Search />
            <Navigation />
        </div>
    )
}

const Logo = () => {
    return (
        <Link href="/">
            <a className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Image src="/img/logo.svg" alt="logo" layout='fill' />
                </div>
                <h2 className={styles.logoTitle}>Room<span>mates</span></h2>
            </a>
        </Link>
    )
}

const Search = () => {
    return (
        <div className={styles.search}>
            <input type="text" placeholder="Поиск" className={styles.searchInput} />
            <button className={styles.searchButton}>
                <FontAwesomeIcon icon={faSearch} /><span className="sr-only">Поиск</span>
            </button>
        </div>
    )
}

const Navigation = () => {

    const user = useSelector((state) => state.user.info)

    const [userMenuActive, setUserMenuActive] = useState(false)

    return (
        <nav className={styles.navigation}>
            {
                !user ?
                    <Auth /> :
                    <>
                        <Links />
                        <Dropdown
                            active={userMenuActive}
                            setActive={setUserMenuActive}
                            button={
                                <User />
                            }
                        >
                            <List />
                        </Dropdown>
                    </>
            }
        </nav>
    )
}

const Auth = () => {

    const [settingsActive, setSettingsActive] = useState(false)
    const [loginActive, setLoginActive] = useState(false)
    const [registerActive, setRegisterActive] = useState(false)

    return (
        <>
            <button className={styles.settingsBtn} onClick={() => { setSettingsActive(true) }}><FontAwesomeIcon icon={faGear} /></button>
            <Settings settingsActive={settingsActive} setSettingsActive={setSettingsActive} />
            <button className={styles.logInBtn} onClick={() => { setLoginActive(true) }}>Вход</button>
            <Login loginActive={loginActive} setLoginActive={setLoginActive} />
            <button className={styles.signInBtn} onClick={() => { setRegisterActive(true) }}>Регистрация</button>
            <Register registerActive={registerActive} setRegisterActive={setRegisterActive} />
        </>
    )
}

const Settings = (props) => {

    const { theme, setTheme } = useTheme()

    return (
        <Modal active={props.settingsActive} setActive={props.setSettingsActive}>
            <h2 className={styles.title}><FontAwesomeIcon icon={faGear} /> Настройки</h2>
            <div className={styles.settings}>
                <CustomToggle
                    name="theme"
                    label="Темная тема"
                    checked={theme === 'dark'}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
            </div>
        </Modal>
    )
}

// todo: add error handler

const Login = (props) => {

    const dispatch = useDispatch()

    const [loginForm, setLoginForm] = useState({})

    const loginFormHandler = event => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(loginForm),
            })
            const user = await response.json();
            dispatch(set(user))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal active={props.loginActive} setActive={props.setLoginActive}>
            <h2 className={styles.title}>Вход</h2>
            <form className={styles.authForm}>
                <CustomInput
                    name={props.loginActive ? 'email' : 'loginEmail'}
                    label='Почта'
                    type='email'
                    handleChange={loginFormHandler}
                />
                <CustomInput
                    name={props.loginActive ? 'password' : 'loginPassword'}
                    label='Пароль'
                    type='password'
                    handleChange={loginFormHandler}
                />
                <button className="submit-btn" onClick={loginHandler}>Войти</button>
            </form>
        </Modal>
    )
}


// todo: fix error handling
const Register = (props) => {

    const [registerForm, setRegiserForm] = useState({})
    const [passwordCheck, setPasswordCheck] = useState(null)
    const [error, setError] = useState(null)

    const registerFormHandler = event => {
        setRegiserForm({ ...registerForm, [event.target.name]: event.target.value })
    }

    const registerHandler = async (e) => {
        e.preventDefault()
        if (passwordCheck === registerForm.password) {
            setError(null)
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(registerForm),
                })
            } catch (error) {
                setError(error.message)
            }
        } else {
            setError("Пароли не совпадают!")
        }
    }

    return (
        <Modal active={props.registerActive} setActive={props.setRegisterActive}>
            <h2 className={styles.title}>Регистрация</h2>
            <form className={styles.authForm}>
                <CustomInput
                    name={props.registerActive ? 'email' : 'registerEmail'}
                    label='Почта'
                    type='email'
                    handleChange={registerFormHandler}
                />
                <CustomInput
                    name={props.registerActive ? 'password' : 'registerPassword'}
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
                <div className={styles.name}>
                    <CustomInput
                        name='name'
                        label='Имя'
                        type='text'
                        handleChange={registerFormHandler}
                    />
                    <CustomInput
                        name='surname'
                        label='Фамилия'
                        type='text'
                        handleChange={registerFormHandler}
                    />
                </div>
                <CustomInput
                    name='phone'
                    label='Телефон'
                    type='phone'
                    handleChange={registerFormHandler}
                />
                <button className="submit-btn" onClick={registerHandler}>Выполнить</button>
                {!!error && <div>{error}</div>}
            </form>
        </Modal>
    )
}

const Links = () => {

    const router = useRouter()

    return (
        <>
            <Link href="/property">
                <a className={`${styles.link} ${styles.main} ${router.pathname == "/property" && styles.active}`}>
                    <FontAwesomeIcon icon={faBuilding} />
                    <span className="sr-only">Моя недвижимость</span>
                </a>
            </Link>
            <Link href="/chat">
                <a className={`${styles.link} ${styles.main} ${router.pathname == "/chat" && styles.active}`}>
                    <FontAwesomeIcon icon={faComments} />
                    <span className="sr-only">Чаты</span>
                </a>
            </Link>
            <Link href="/favourites">
                <a className={`${styles.link} ${styles.main} ${router.pathname == "/favourites" && styles.active}`}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span className="sr-only">Избранное</span>
                </a>
            </Link>
        </>
    )
}

const User = () => {

    const user = useSelector((state) => state.user.info)

    return (
        <div className={styles.user}>
            <h3 className={styles.name}>{user.name} {user.surname}</h3>
            <div className={styles.image}>
                <Image src={user.image ? user.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
            </div>
        </div>
    )
}

const List = () => {

    const router = useRouter()

    const dispatch = useDispatch()

    const [settingsActive, setSettingsActive] = useState(false)

    const logout = async () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        dispatch(exit())
    }

    return (
        <div className={styles.list}>
            <Link href="/profile">
                <a className={`${styles.link} ${router.pathname == "/profile" && styles.active}`}><FontAwesomeIcon icon={faUser} />Профиль</a>
            </Link>
            <button className={styles.link} onClick={() => { setSettingsActive(true) }}><FontAwesomeIcon icon={faGear} />Настройки</button>
            <Settings settingsActive={settingsActive} setSettingsActive={setSettingsActive} />
            <button className={styles.link}><FontAwesomeIcon icon={faCircleInfo} />Помощь</button>
            <button className={styles.link} onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} />Выйти</button>
        </div>
    )
}