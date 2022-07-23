import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState } from 'react'
import styles from './Header.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faGear, faCircleInfo, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faComments, faHeart, faBuilding } from '@fortawesome/free-regular-svg-icons'

import Dropdown from '../Dropdown/Dropdown'
import Modal from '../Modal/Modal'

export default function Header() {

    const [userMenuActive, setUserMenuActive] = useState(false)

    return (
        <div className={styles.container}>
            <Logo />
            <Search />
            <nav className={styles.navigation}>
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
            </nav>
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
    return (
        <div className={styles.user}>
            <h3 className={styles.name}>User Name</h3>
            <div className={styles.image}>
                <Image src="/img/default-user.png" alt="logo" layout='fill' />
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
            <Modal active={settingsActive} setActive={setSettingsActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faGear} /> Настройки</h2>
            </Modal>
            <button className={styles.link}><FontAwesomeIcon icon={faCircleInfo} />Помощь</button>
            <button className={styles.link}><FontAwesomeIcon icon={faArrowRightFromBracket} />Выйти</button>
        </div>
    )
} 