import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Filters.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faBuilding, faStairs, faSliders, faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import { setFilters } from '../../redux/slices/filters'
import { enumerate } from '../../utils/functions'
import CustomToggle from '../CustomToggle/CustomToggle'
import Modal from '../Modal/Modal'
import Dropdown from '../Dropdown/Dropdown'

export default function Filters({ apartments }) {

    const filters = useSelector((state) => state.filters.filters)
    const dispatch = useDispatch()

    return (
        <div className={styles.container}>
            <Headline apartments={apartments} filters={filters} />
            <RoommatesToggle withRoommates={filters.withRoommates} dispatch={dispatch} />
            <div className={styles.buttons}>
                <PriceButton />
                <TypeButton />
                <FloorButton />
                <MoreButton />
            </div>
            <SortBy sortBy={filters.sortBy} dispatch={dispatch} />
        </div>
    )
}

const Headline = ({ apartments, filters }) => {

    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(0)
        apartments.map(apartment => {
            apartment.isVisible &&
                filters.withRoommates === !!apartment.roommates.length &&
                setCount(prevCount => prevCount + 1)
        })
    }, [filters])

    return (
        <div className={styles.headline}>
            <h1 className={styles.title}>Квартиры в России</h1>
            <p className={styles.resultNum}>{count} {enumerate(count, ["результат", "результата", "результатов"])}</p>
        </div>
    )
}

const RoommatesToggle = ({ withRoommates, dispatch }) => {
    return (
        <div className={styles.roommatesToggle}>
            <CustomToggle
                name="roommates"
                label="С соседями"
                checked={withRoommates}
                onChange={(e) => { dispatch(setFilters({ withRoommates: e.target.checked })) }}
            />
        </div>
    )
}

const PriceButton = () => {

    const [priceActive, setPriceActive] = useState(false)

    return (
        <>
            <button className={styles.button} onClick={() => { setPriceActive(true) }}>
                <FontAwesomeIcon icon={faTag} />Цена
            </button>
            <Modal active={priceActive} setActive={setPriceActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faTag} /> Цена</h2>
                {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
        </>
    )
}

const TypeButton = () => {

    const [typeActive, setTypeActive] = useState(false)

    return (
        <>
            <button className={styles.button} onClick={() => { setTypeActive(true) }}>
                <FontAwesomeIcon icon={faBuilding} />Тип
            </button>
            <Modal active={typeActive} setActive={setTypeActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faBuilding} /> Тип</h2>
                {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
        </>
    )
}

const FloorButton = () => {

    const [floorActive, setFloorActive] = useState(false)

    return (
        <>
            <button className={styles.button} onClick={() => { setFloorActive(true) }}>
                <FontAwesomeIcon icon={faStairs} />Этаж
            </button>
            <Modal active={floorActive} setActive={setFloorActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faStairs} /> Этаж</h2>
                {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
        </>
    )
}

const MoreButton = () => {

    const [moreActive, setMoreActive] = useState(false)

    return (
        <>
            <button className={styles.button} onClick={() => { setMoreActive(true) }}>
                <FontAwesomeIcon icon={faSliders} />Другое
            </button>
            <Modal active={moreActive} setActive={setMoreActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faSliders} /> Другое</h2>
                {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
        </>
    )
}

const SortBy = ({ dispatch }) => {

    const [sortByActive, setSortByActive] = useState(false)
    const [value, setValue] = useState({ text: 'Новизне' })

    return (
        <div className={styles.sortBy}>
            <Dropdown
                active={sortByActive}
                setActive={setSortByActive}
                button={
                    <>Сортировать по: <span>{value.text} {value.icon && value.icon}</span></>
                }
            >
                <ul className={styles.list}>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['price.value', 'asc'] }))
                            setValue({ text: 'Цене', icon: <FontAwesomeIcon icon={faArrowDownShortWide} /> })
                        }}>Цене <FontAwesomeIcon icon={faArrowDownShortWide} /></li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['price.value', 'desc'] }))
                            setValue({ text: 'Цене', icon: <FontAwesomeIcon icon={faArrowDownWideShort} /> })
                        }}>Цене <FontAwesomeIcon icon={faArrowDownWideShort} /></li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['createdAt'] }))
                            setValue({ text: 'Новизне' })
                        }}>Новизне</li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['averageRating'] }))
                            setValue({ text: 'Рейтингу' })
                        }}>Рейтингу</li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['stats.area'] }))
                            setValue({ text: 'Площади' })
                        }}>Площади</li>
                </ul>
            </Dropdown>
        </div>
    )
}