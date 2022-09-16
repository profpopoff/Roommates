import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import styles from './Post.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import StarRatings from 'react-star-ratings'

import FavButton from '../FavButton/FavButton'
import { enumerate } from '../../utils/functions'

export default function Post(props) {
    return (
        <div className={styles.post}>
            <PostImage id={props._id} src={props.images[0]} roommates={props.roommates} />
            <Headline id={props._id} title={props.title} {...props.address} />
            <div className={styles.favBtn}>
                <FavButton id={props._id} />
            </div>
            <Conveniences conveniences={props.conveniences} />
            {!!props.averageRating && <Rating averageRating={props.averageRating} reviews={props.reviews} />}
            <Price {...props.price} />
        </div>
    )
}

const PostImage = (props) => {
    return (
        <div className={styles.image}>
            <Image className={styles.src} src={props.src} alt="" layout="fill" />
            {!!props.roommates.length &&
                <div className={styles.roommates}>
                    <div className={styles.images}>
                        {props.roommates.map(roommate => (
                            <div key={roommate._id} className={styles.roommate}>
                                <Image className={styles.src} src={roommate.image} alt="" width={40} height={40} />
                            </div>
                        ))}
                    </div>
                    <span className={styles.number}>{props.roommates.length} {enumerate(props.roommates.length, ["сосед", "соседа", "соседей"])}</span>
                </div>
            }
        </div>
    )
}

const Headline = (props) => {

    const cityFilter = useSelector((state) => state.filters.filters.city)

    return (
        <div className={styles.headline}>
            <Link href={`/apartment/${props.id}`} passHref>
                <h2 className={styles.title}>{props.title}</h2>
            </Link>
            <h3 className={styles.address}>
                <FontAwesomeIcon icon={faLocationDot} className="icon" /> {`${!cityFilter ? props.city + ',' : ''} ${props.street}, д.${props.house}, кв.${props.apartment}`}
            </h3>
        </div>
    )
}

const Conveniences = (props) => {
    return (
        <ul className={styles.conveniences}>
            {props.conveniences.map((convenience, index) => (
                <li key={index}>{convenience}</li>
            ))}
        </ul>
    )
}

const Rating = (props) => {
    return (
        <div className={styles.rating}>
            <span className={styles.averageRating}>{props.averageRating?.toString().substring(0, 3)}</span>
            <StarRatings
                rating={props.averageRating}
                starRatedColor="#2B67F6"
                starDimension="20"
                starSpacing="2"
                name="rating"
            />
            <span className={styles.number}>({props.reviews.length} {enumerate(props.reviews.length, ["отзыв", "отзыва", "отзывов"])})</span>
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