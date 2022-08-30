import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './FavButton.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

import { addFavourite, deleteFavourite } from '../../redux/slices/favourites'

export default function FavButton({ id }) {

    const favourites = useSelector((state) => state.favourites.posts)
    const dispatch = useDispatch()

    const [isFavourite, setIsFavourite] = useState(false)

    const handleToggle = async (e) => {
        if (e.target.checked) {
            setIsFavourite(true)
            dispatch(addFavourite(e.target.value))
        } else {
            setIsFavourite(false)
            dispatch(deleteFavourite(favourites.filter(item => item !== e.target.value)))
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
                id={id}
                // defaultChecked={props.checked}
                value={id}
                onClick={handleToggle}
            />
        </div>
    )
}