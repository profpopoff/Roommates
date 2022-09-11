import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Header.module.scss'

import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faGear, faCircleInfo, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faComments, faHeart, faBuilding } from '@fortawesome/free-regular-svg-icons'

import { setFilters } from '../../redux/slices/filters'
import Dropdown from '../Dropdown/Dropdown'
import Modal from '../Modal/Modal'
import CustomToggle from '../CustomToggle/CustomToggle'
import CustomInput from '../CustomInput/CustomInput'
import { useHttp } from '../../hooks/http.hook'
import { exit, setUser } from '../../redux/slices/user'

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.wrapper}>
                <Logo />
                <div className={styles.menu}>
                    <Search />
                    <Navigation />
                </div>
            </div>
        </header>
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

    const { request } = useHttp()

    const ref = useRef(null)

    const [search, setSearch] = useState('')

    const [results, setResults] = useState()

    const [resultsMenuActive, setResultsMenu] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            await request('/api/search', 'POST', JSON.stringify(search), { 'Content-Type': 'application/json;charset=utf-8' })
                .then(res => setResults(res))
            setResultsMenu(true)
        } catch (error) { }
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (resultsMenuActive && ref.current && !ref.current.contains(e.target)) {
                setResultsMenu(prevActive => !prevActive)
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [resultsMenuActive])

    return (
        <div className={styles.search} ref={ref}>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Поиск" className={styles.searchInput} onChange={e => setSearch(e.target.value)} onClick={() => setResultsMenu(prevActive => !prevActive)} />
                <button className={styles.searchButton} type="submit">
                    <FontAwesomeIcon icon={faSearch} /><span className="sr-only">Поиск</span>
                </button>
            </form>
            {!!results && resultsMenuActive && <ResultsMenu results={results} />}
        </div>
    )
}

const ResultsMenu = ({ results }) => {

    const dispatch = useDispatch()

    const router = useRouter()

    return (
        <div className={styles.resultsMenu} >
            <div className={styles.resultsContainer}>
                {router.pathname == "/" && !!results.cities.length &&
                    <div className={styles.results}>
                        <h3 className={styles.title}>Города</h3>
                        {results.cities.map(city => (
                            <button key={city} className={styles.result} onClick={() => dispatch(setFilters({ city }))}>{city}</button>
                        ))}
                    </div>
                }
                {!!results.posts?.length &&
                    <div className={styles.results}>
                        <h3 className={styles.title}>Результаты</h3>
                        {results.posts.map(post => (
                            <Link key={post._id} href={`/apartment/${post._id}`} passHref>
                                <a className={styles.result}>{post.title}</a>
                            </Link>
                        ))}
                    </div>
                }
                {!results.posts?.length && (router.pathname !== "/" && results.cities.length) &&
                    <h3 className={styles.title}>По вашему запросу ничего не найдено...</h3>
                }
            </div>
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
                    onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
            </div>
        </Modal>
    )
}

export const Login = (props) => {

    const { request, success, loading, error } = useHttp()

    const dispatch = useDispatch()

    const [loginForm, setLoginForm] = useState({})

    const loginFormHandler = event => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const user = await request('/api/auth/login', 'POST', JSON.stringify(loginForm), { 'Content-Type': 'application/json;charset=utf-8' })
            if (user) { dispatch(setUser(user)) }
        } catch (error) { }
    }

    return (
        <Modal active={props.loginActive} setActive={props.setLoginActive}>
            <h2 className={styles.title}>Вход</h2>
            <form className="auth-form" onSubmit={loginHandler}>
                <CustomInput
                    name={props.loginActive ? 'email' : `loginEmail_${props.id}`}
                    label='Почта'
                    type='email'
                    handleChange={loginFormHandler}
                />
                <CustomInput
                    name={props.loginActive ? 'password' : `loginPassword_${props.id}`}
                    label='Пароль'
                    type='password'
                    handleChange={loginFormHandler}
                />
                <input className="submit-btn" type="submit" disabled={loading} value={loading ? 'Вход...' : 'Войти'} />
                {error && <span className='error'>{error}</span>}
            </form>
        </Modal>
    )
}

const Register = (props) => {

    const { request, success, loading, error } = useHttp()

    const [registerForm, setRegiserForm] = useState({})
    const [passwordCheck, setPasswordCheck] = useState(null)
    const [dontMatch, setDontMatch] = useState(false)

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
                    const user = await request('/api/auth/register', 'POST',
                        JSON.stringify({ ...registerForm, image: data.secure_url }),
                        { 'Content-Type': 'application/json;charset=utf-8' })
                } catch (error) { }
            } else {
                try {
                    const user = await request('/api/auth/register', 'POST',
                        JSON.stringify(registerForm),
                        { 'Content-Type': 'application/json;charset=utf-8' })
                } catch (error) { }
            }
        } else { setDontMatch(true) }
    }

    return (
        <Modal active={props.registerActive} setActive={props.setRegisterActive}>
            <h2 className={styles.title}>Регистрация</h2>
            <form className="auth-form" onSubmit={registerHandler}>
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
                <div className="name">
                    <CustomInput
                        name={props.registerActive ? 'name' : 'registerName'}
                        label='Имя'
                        type='text'
                        handleChange={registerFormHandler}
                    />
                    <CustomInput
                        name={props.registerActive ? 'surname' : 'registerSurname'}
                        label='Фамилия'
                        type='text'
                        handleChange={registerFormHandler}
                    />
                </div>
                <CustomInput
                    name={props.registerActive ? 'phone' : 'registerPhone'}
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

// todo: add notifications
const Links = () => {

    const router = useRouter()

    const user = useSelector((state) => state.user.info)

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
                    {/* <span className={styles.notification}>1</span> */}
                </a>
            </Link>
            <Link href="/favourites">
                <a className={`${styles.link} ${styles.main} ${router.pathname == "/favourites" && styles.active}`}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span className="sr-only">Избранное</span>
                    {!!user.favourites.length && <span className={styles.notification}>{user.favourites.length}</span>}
                </a>
            </Link>
        </>
    )
}

const User = () => {

    const user = useSelector((state) => state.user.info)

    return (
        <div className={styles.user}>
            <h3 className={styles.name}>{user.name} <span>{user.surname}</span></h3>
            <div className={styles.image}>
                <Image src={user.image ? user.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
            </div>
        </div>
    )
}

const List = () => {

    const router = useRouter()

    const [settingsActive, setSettingsActive] = useState(false)

    return (
        <div className={styles.list}>
            <Link href="/profile">
                <a className={`${styles.link} ${router.pathname == "/profile" && styles.active}`}><FontAwesomeIcon icon={faUser} />Профиль</a>
            </Link>
            <button className={styles.link} onClick={() => { setSettingsActive(true) }}><FontAwesomeIcon icon={faGear} />Настройки</button>
            <Settings settingsActive={settingsActive} setSettingsActive={setSettingsActive} />
            <LogoutBtn />
        </div>
    )
}

const LogoutBtn = () => {

    const router = useRouter()

    const dispatch = useDispatch()

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        dispatch(exit())
        if (['/profile', '/chat', '/favourites', '/property', '/property/create'].includes(router.pathname)) {
            router.push('/')
        }
    }

    return (
        <button className={styles.link} onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} />Выйти</button>
    )
}