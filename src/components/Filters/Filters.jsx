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
import MultiRangeSlider from '../MultiRangeSlider/MultiRangeSlider'

export default function Filters({ apartments }) {

    const filters = useSelector((state) => state.filters.filters)
    const dispatch = useDispatch()

    return (
        <div className={styles.container}>
            <Headline apartments={apartments} filters={filters} />
            <RoommatesToggle withRoommates={filters.withRoommates} dispatch={dispatch} />
            <div className={styles.buttons}>
                <PriceButton {...filters.price} dispatch={dispatch} />
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
                (apartment.price.value <= filters.price.max && apartment.price.value >= filters.price.min) &&
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

const PriceButton = ({ min, max, dispatch }) => {

    const [priceActive, setPriceActive] = useState(false)

    const [priceValue, setPriceValue] = useState({ min, max })
    
    const setPriceFilter = (e) => {
        e.preventDefault()
        dispatch(setFilters({ price: priceValue }))
    }

    return (
        <>
            <button className={styles.button} onClick={() => { setPriceActive(true) }}>
                <FontAwesomeIcon icon={faTag} />Цена
            </button>
            <Modal active={priceActive} setActive={setPriceActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faTag} /> Цена</h2>
                <form className={styles.filterForm} onSubmit={setPriceFilter}>
                    <MultiRangeSlider
                        min={0}
                        max={100000}
                        onChange={({ min, max }) => setPriceValue({ min, max })}
                    />
                    <input className="submit-btn" type="submit" />
                </form>
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

const SortBy = ({ sortBy, dispatch }) => {

    const [sortByActive, setSortByActive] = useState(false)

    const value = (sortBy) => {
        switch (sortBy) {
            case 'price.value':
                return <span>Цене</span>
            case 'createdAt':
                return <span>Новизне</span>
            case 'averageRating':
                return <span>Рейтингу</span>
            case 'stats.area':
                return <span>Площади</span>
        }
    }

    return (
        <div className={styles.sortBy}>
            <Dropdown
                active={sortByActive}
                setActive={setSortByActive}
                button={
                    <>Сортировать по: <span>{value(sortBy[0])} {
                        sortBy[1] && <FontAwesomeIcon icon={sortBy[1] == 'desc' ? faArrowDownWideShort : faArrowDownShortWide} />
                    }</span></>
                }
            >
                <ul className={styles.list}>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['price.value', 'asc'] }))
                        }}>Цене <FontAwesomeIcon icon={faArrowDownShortWide} /></li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['price.value', 'desc'] }))
                        }}>Цене <FontAwesomeIcon icon={faArrowDownWideShort} /></li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['createdAt'] }))
                        }}>Новизне</li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['averageRating'] }))
                        }}>Рейтингу</li>
                    <li className={styles.item}
                        onClick={(e) => {
                            dispatch(setFilters({ sortBy: ['stats.area'] }))
                        }}>Площади</li>
                </ul>
            </Dropdown>
        </div>
    )
}