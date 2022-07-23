import Image from 'next/image'
import { useState } from 'react'
import styles from './Posts.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import StarRatings from 'react-star-ratings'

export default function Posts() {

    return (
        <div className={styles.container}>
            <Post />
            <Post />
            <Post />
            <Post />
        </div>
    )
}

const Post = () => {
    return (
        <div className={styles.post}>
            <PostImage />
            <Headline />
            <FavButton />
            <Conveniences />
            <Rating />
            <Price />
        </div>
    )
}

const PostImage = () => {
    return (
        <div className={styles.image}>
            <Image className={styles.src} src="/img/cover.jpeg" alt="" layout="fill" />
        </div>
    )
}

const Headline = () => {
    return (
        <div className={styles.headline}>
            <h2 className={styles.title}>Хорошоий места</h2>
            <h3 className={styles.address}>
                <FontAwesomeIcon icon={faLocationDot} className="icon" /> Улица Пушкина дом Колотушкина
            </h3>
        </div>
    )
}

const FavButton = () => {

    const [isFavourite, setIsFavourite] = useState(false)

    return (
        <button className={styles.favButton} onClick={() => setIsFavourite(!isFavourite)}>
            {isFavourite ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeartRegular} />}
        </button>
    )
}

const Conveniences = () => {

    const conveniencesTest = ['Холодильник1', 'Холодильник2', 'Холодильник3', 'Холодильник4', 'Холодильник5', 'Холодильник6', 'Холодильник7', 'Холодильник8']

    return (
        <ul className={styles.conveniences}>
            {conveniencesTest.slice(0, 6).map((convenience, index) => (
                <li key={index}>{convenience}</li>
            ))}
        </ul>
    )
}

const Rating = () => {

    const ratingTest = 3.2345

    return (
        <div className={styles.rating}>
            <span>{ratingTest.toString().substring(0, 3)}</span>
            <StarRatings
                rating={ratingTest}
                starRatedColor="#2B67F6"
                starDimension="20"
                starSpacing="2"
                starHoverColor="blue"
                name="rating"
            />
        </div>
    )
}

const Price = () => {

    const priceTest = 12312

    return (
        <div className={styles.price}>
            <span>{priceTest.toLocaleString('ru', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
            })}</span>/месяц
        </div>
    )
}