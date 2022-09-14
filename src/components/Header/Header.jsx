import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Header.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faGear, faArrowRightFromBracket, faXmark, faBars } from '@fortawesome/free-solid-svg-icons'
import { faComments, faHeart, faBuilding } from '@fortawesome/free-regular-svg-icons'

import { setFilters } from '../../redux/slices/filters'
import { setModal } from '../../redux/slices/modal'
import Dropdown from '../Dropdown/Dropdown'
import { useHttp } from '../../hooks/http.hook'
import { exit } from '../../redux/slices/user'
import Settings from '../Settings/Settings'
import Login from '../Login/Login'
import Register from '../Register/Register'

export default function Header() {

    const user = useSelector((state) => state.user.info)

    const [userMenuActive, setUserMenuActive] = useState(false)

    const [showBurger, setShowBurger] = useState(false)

    return (
        <header className={styles.container}>
            <div className={styles.wrapper}>
                <Logo />
                <div className={styles.menu}>
                    <Search />

                    <div className={styles.navigation}>
                        <Navigation showBurger={showBurger} setShowBurger={setShowBurger} />
                        {user ?
                            <>

                                <Dropdown
                                    active={userMenuActive}
                                    setActive={setUserMenuActive}
                                    button={
                                        <User setShowBurger={setShowBurger} />
                                    }
                                >
                                    <List />
                                </Dropdown>
                            </> :
                            <button className={styles.burgerBtn}
                                onClick={() => setShowBurger(true)}
                            ><FontAwesomeIcon icon={faBars} /></button>
                        }
                    </div>
                </div>
            </div>
            <Settings />
            {!user &&
                <>
                    <Login />
                    <Register />
                </>
            }
        </header>
    )
}

const Navigation = ({ showBurger, setShowBurger }) => {

    const toggleBugrer = () => setShowBurger(prevShowBurger => !prevShowBurger)

    const navRef = useRef()

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (showBurger && navRef.current && !navRef.current.contains(e.target)) {
                toggleBugrer()
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showBurger])

    const user = useSelector((state) => state.user.info)


    return (
        <nav className={styles.links} ref={navRef} data-visible={showBurger}>
            <button className={`${styles.link} ${styles.extraLink} ${styles.close}`}
                onClick={() => toggleBugrer()}
            ><FontAwesomeIcon icon={faXmark} /></button>
            {user ?
                <Links toggleBugrer={toggleBugrer} /> :
                <Auth toggleBugrer={toggleBugrer} />
            }
        </nav>
    )
}

const Links = ({ toggleBugrer }) => {

    const user = useSelector((state) => state.user.info)

    const router = useRouter()

    const dispatch = useDispatch()

    return (
        <>
            <Link href="/profile">
                <a className={`${styles.link} ${styles.extraLink} ${router.pathname == "/profile" && styles.active}`}
                ><FontAwesomeIcon icon={faUser} />Профиль</a>
            </Link>
            <button className={`${styles.link} ${styles.extraLink}`}
                onClick={() => { dispatch(setModal({ settingsActive: true })); toggleBugrer() }}
            ><FontAwesomeIcon icon={faGear} />Настройки</button>
            <Link href="/property">
                <a className={`${styles.link} ${router.pathname == "/property" && styles.active}`}>
                    <FontAwesomeIcon icon={faBuilding} />
                    <span className={`sr-only ${styles.linkTitle}`}>Недвижимость</span>
                </a>
            </Link>
            <Link href="/chat">
                <a className={`${styles.link} ${router.pathname == "/chat" && styles.active}`}>
                    <FontAwesomeIcon icon={faComments} />
                    <span className={`sr-only ${styles.linkTitle}`}>Чаты</span>
                    {/* <span className={styles.notification}>1</span> */}
                </a>
            </Link>
            <Link href="/favourites">
                <a className={`${styles.link} ${router.pathname == "/favourites" && styles.active}`}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span className={`sr-only ${styles.linkTitle}`}>Избранное</span>
                    {!!user.favourites.length && <span className={styles.notification}>{user.favourites.length}</span>}
                </a>
            </Link>
            <button className={`${styles.link} ${styles.extraLink}`} onClick={() => logout(dispatch, router)}><FontAwesomeIcon icon={faArrowRightFromBracket} />Выйти</button>
        </>
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
            <form className={styles.box} onSubmit={handleSearch}>
                <button className={styles.btn} type="submit">
                    <FontAwesomeIcon icon={faSearch} /><span className="sr-only">Поиск</span>
                </button>
                <input className={styles.input} type="text" placeholder="Поиск" onChange={e => setSearch(e.target.value)} onClick={() => setResultsMenu(true)} />
                {!!results && resultsMenuActive && <ResultsMenu results={results} setResultsMenu={setResultsMenu} />}
            </form>
        </div>
    )
}

const ResultsMenu = ({ results, setResultsMenu }) => {

    const dispatch = useDispatch()

    const router = useRouter()

    return (
        <div className={styles.resultsMenu} onClick={() => setResultsMenu(false)}>
            <div className={styles.resultsContainer}>
                {router.pathname == "/" && !!results.cities.length &&
                    <div className={styles.results}>
                        <h3 className={styles.title}>Города</h3>
                        {results.cities.map(city => (
                            <button key={city} className={styles.result} onClick={() => { dispatch(setFilters({ city })); setResultsMenu(false) }}>{city}</button>
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
                {!results.posts?.length && (router.pathname !== "/" || !results.cities.length) &&
                    <h3 className={styles.title}>По вашему запросу ничего не найдено...</h3>
                }
            </div>
        </div>
    )
}

const Auth = ({ toggleBugrer }) => {

    const dispatch = useDispatch()

    return (
        <>
            <button className={styles.link}
                onClick={() => { dispatch(setModal({ settingsActive: true })); toggleBugrer() }}
            ><FontAwesomeIcon icon={faGear} /><span className={`sr-only ${styles.linkTitle}`}>Настройки</span></button>
            <button className={styles.logInBtn}
                onClick={() => dispatch(setModal({ loginActive: true }))}
            >Вход</button>
            <button className={styles.signInBtn}
                onClick={() => dispatch(setModal({ registerActive: true }))}
            >Регистрация</button>
        </>
    )
}

const User = ({ setShowBurger }) => {

    const user = useSelector((state) => state.user.info)

    return (
        <div className={styles.user} onClick={() => setShowBurger(prevShowBurger => !prevShowBurger)}>
            <h3 className={styles.name}>{user.name} <span>{user.surname}</span></h3>
            <div className={styles.image}>
                <Image src={user.image ? user.image : '/img/default-user.png'} alt="user profile picture" layout='fill' />
            </div>
        </div>
    )
}

const List = () => {

    const router = useRouter()

    const dispatch = useDispatch()

    return (
        <div className={styles.list}>
            <Link href="/profile">
                <a className={`${styles.userLink} ${router.pathname == "/profile" && styles.active}`}><FontAwesomeIcon icon={faUser} />Профиль</a>
            </Link>
            <button className={styles.userLink}
                onClick={() => { dispatch(setModal({ settingsActive: true })) }}
            ><FontAwesomeIcon icon={faGear} />Настройки</button>
            <button className={styles.userLink} onClick={() => logout(dispatch, router)}><FontAwesomeIcon icon={faArrowRightFromBracket} />Выйти</button>
        </div>
    )
}


const logout = (dispatch, router) => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    dispatch(exit())
    if (['/profile', '/chat', '/favourites', '/property', '/property/create'].includes(router.pathname)) {
        router.push('/')
    }
}