import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './FavButton.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

import { useHttp } from '../../hooks/http.hook'
import { setUser } from '../../redux/slices/user'

export default function FavButton({ id }) {

    const { request, success, loading, error } = useHttp()

    const user = useSelector((state) => state.user.info)
    const dispatch = useDispatch()

    const [isFavourite, setIsFavourite] = useState(user.favourites.includes(id))

    const handleToggle = async (e) => {
        if (e.target.checked) {
            setIsFavourite(true)
            try {
                const newUser = await request(`/api/users/${user._id}`, 'PUT',
                    JSON.stringify({ favourites: [...user.favourites, e.target.value] }),
                    { 'Content-Type': 'application/json;charset=utf-8' })
                dispatch(setUser({ favourites: [...user.favourites, e.target.value] }))
            } catch (error) { }
        } else {
            setIsFavourite(false)
            try {
                const newUser = await request(`/api/users/${user._id}`, 'PUT',
                    JSON.stringify({ favourites: user.favourites.filter(item => item !== e.target.value) }),
                    { 'Content-Type': 'application/json;charset=utf-8' })
                dispatch(setUser({ favourites: user.favourites.filter(item => item !== e.target.value) }))
            } catch (error) { }
        }
    }

    return (

        <div className={styles.container}>
            <label className={styles.label}
                htmlFor={id}
            >
                {isFavourite ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeartRegular} />}
            </label>
            <input
                className={styles.toggle}
                type="checkbox"
                defaultChecked={isFavourite}
                id={id}
                value={id}
                onClick={handleToggle}
            />
        </div>
    )
}