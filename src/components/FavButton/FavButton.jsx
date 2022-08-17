import { useState } from 'react'
import styles from './FavButton.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

export default function FavButton() {

    const [isFavourite, setIsFavourite] = useState(false)

    return (
        <button className={styles.favButton} onClick={() => setIsFavourite(!isFavourite)}>
            {isFavourite ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeartRegular} />}
        </button>
    )
}