import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './Posts.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import StarRatings from 'react-star-ratings'

import { average } from '../utils'
import FavButton from '../FavButton/FavButton'

export default function Posts({ apartments }) {
    return (
        <div className={styles.container}>
            {apartments?.map(apartment => {
                const ratings = apartment.reviews?.map(review => review.rating)
                return (
                    <Post key={apartment._id} {...apartment} averageRating={average(ratings)} />
                )
            })}
        </div>
    )
}

const Post = (props) => {
    return (
        <div className={styles.post}>
            <PostImage id={props._id} src={props.images[0]} />
            <Headline id={props._id} title={props.title} {...props.address} />
            <FavButton />
            <Conveniences conveniences={props.conveniences} />
            <Rating averageRating={props.averageRating} />
            <Price {...props.price} />
        </div>
    )
}

const PostImage = (props) => {
    return (
        <div className={styles.image}>
            <Image className={styles.src} src={props.src} alt="" layout="fill" />
        </div>
    )
}

const Headline = (props) => {
    return (
        <div className={styles.headline}>
            <Link href={`/apartment/${props.id}`} passHref>
                <h2 className={styles.title}>{props.title}</h2>
            </Link>
            <h3 className={styles.address}>
                <FontAwesomeIcon icon={faLocationDot} className="icon" /> {`${props.city}, ${props.street}, д.${props.house}, кв.${props.apartment}`}
            </h3>
        </div>
    )
}

const Conveniences = (props) => {
    return (
        <ul className={styles.conveniences}>
            {props.conveniences.slice(0, 6).map((convenience, index) => (
                <li key={index}>{convenience}</li>
            ))}
        </ul>
    )
}

const Rating = (props) => {
    return (
        <div className={styles.rating}>
            <span>{props.averageRating?.toString().substring(0, 3)}</span>
            <StarRatings
                rating={props.averageRating}
                starRatedColor="#2B67F6"
                starDimension="20"
                starSpacing="2"
                starHoverColor="blue"
                name="rating"
            />
        </div>
    )
}

const Price = (props) => {
    return (
        <div className={styles.price}>
            <span>{props.value.toLocaleString('ru', {
                style: 'currency',
                currency: props.currency,
                minimumFractionDigits: 0
            })}</span>/месяц
        </div>
    )
}