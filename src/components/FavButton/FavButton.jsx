import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './FavButton.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

import { useHttp } from '../../hooks/http.hook'
import { setUser } from '../../redux/slices/user'
import { Login } from '../Header/Header'
import { useEffect } from 'react'

export default function FavButton({ id }) {

    const { request } = useHttp()

    const user = useSelector((state) => state.user.info)
    const dispatch = useDispatch()

    const [isFavourite, setIsFavourite] = useState()

    useEffect(() => {
        setIsFavourite(user ? user.favourites.includes(id) : false)
    }, [user])

    const [loginActive, setLoginActive] = useState(false)

    const handleToggle = async (e) => {
        if (e.target.checked) {
            setIsFavourite(true)
            try {
                await request(`/api/users/${user._id}`, 'PUT',
                    JSON.stringify({ favourites: [...user.favourites, e.target.value] }),
                    { 'Content-Type': 'application/json;charset=utf-8' })
                dispatch(setUser({ favourites: [...user.favourites, e.target.value] }))
            } catch (error) { }
        } else {
            setIsFavourite(false)
            try {
                await request(`/api/users/${user._id}`, 'PUT',
                    JSON.stringify({ favourites: user.favourites.filter(item => item !== e.target.value) }),
                    { 'Content-Type': 'application/json;charset=utf-8' })
                dispatch(setUser({ favourites: user.favourites.filter(item => item !== e.target.value) }))
            } catch (error) { }
        }
    }

    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={id}>
                {isFavourite ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeartRegular} />}
            </label>
            <input
                className={styles.toggle}
                type="checkbox"
                defaultChecked={isFavourite}
                id={id}
                value={id}
                onClick={!user ? (() => setLoginActive(true)) : handleToggle}
            />
            {!user && <Login loginActive={loginActive} setLoginActive={setLoginActive} id={id} />}
        </div>
    )
}