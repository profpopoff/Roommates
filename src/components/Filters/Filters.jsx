import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Filters.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faBuilding, faStairs, faSliders, faArrowDownShortWide, faArrowDownWideShort, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { cityIn } from 'lvovich'
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

import { setFilters, resetFilters } from '../../redux/slices/filters'
import { enumerate } from '../../utils/functions'
import CustomToggle from '../CustomToggle/CustomToggle'
import Modal from '../Modal/Modal'
import Dropdown from '../Dropdown/Dropdown'

export default function Filters({ apartments }) {

    const filters = useSelector((state) => state.filters.filters)
    const dispatch = useDispatch()

    return (
        <section className={styles.container}>
            <Headline apartments={apartments} filters={filters} />
            <RoommatesToggle withRoommates={filters.withRoommates} dispatch={dispatch} />
            <div className={styles.buttons}>
                <PriceButton price={filters.price} dispatch={dispatch} />
                <TypeButton type={filters.type} withRoommates={filters.withRoommates} dispatch={dispatch} />
                <FloorButton floor={filters.floor} dispatch={dispatch} />
                <button className={styles.button} onClick={() => { dispatch(resetFilters()) }}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} /> Сброс
                </button>
            </div>
            <SortBy sortBy={filters.sortBy} dispatch={dispatch} />
        </section>
    )
}

const Headline = ({ apartments, filters }) => {

    const currentTypes = filters.type.filter(x => (filters.withRoommates ? ['bed', 'room'] : ['flat', 'house', 'townhouse']).includes(x))

    const value = (sortBy) => {
        switch (sortBy) {
            case 'bed':
                return 'Спальные места'
            case 'room':
                return 'Комнаты'
            case 'flat':
                return 'Квартиры'
            case 'house':
                return 'Дома'
            case 'townhouse':
                return 'Таунхаусы'
        }
    }

    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(0)
        apartments.map(apartment => {
            apartment.isVisible &&
                ((filters.withRoommates && ['bed', 'room'].includes(apartment.type)) || (!filters.withRoommates && ['flat', 'house', 'townhouse'].includes(apartment.type))) &&
                (apartment.price.value <= filters.price[1] && apartment.price.value >= filters.price[0]) &&
                (apartment.stats.floor <= filters.floor[1] && apartment.stats.floor >= filters.floor[0]) &&
                filters.type.includes(apartment.type) &&
                (!filters.city ? true : apartment.address.city === filters.city) &&
                setCount(prevCount => prevCount + 1)
        })
    }, [filters])

    const place = filters.city ? cityIn(filters.city) : 'России'

    return (
        <div className={styles.headline}>
            <h1 className={styles.title}>
                {currentTypes.length == 1 ? value(currentTypes[0]) : 'Жилье'} {place.slice(0, 1) === 'В' ? 'во' : 'в'} {place}
            </h1>
            <p className={styles.resultNum}>{count}  {enumerate(count, ["результат", "результата", "результатов"])}</p>
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
                onChange={(e) => dispatch(setFilters({ withRoommates: e.target.checked }))}
            />
        </div>
    )
}

const PriceButton = ({ price, dispatch }) => {

    const [priceActive, setPriceActive] = useState(false)

    const [priceValue, setPriceValue] = useState(price)

    useEffect(() => {
        setPriceValue(price)
    }, [price])

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
                    <Slider
                        range
                        marks={{
                            0: priceValue[0],
                            100000: priceValue[1]
                        }}
                        trackStyle={{ 'background-color': '#2B67F6' }}
                        min={0}
                        max={100000}
                        step={100}
                        value={priceValue}
                        onChange={(value) => setPriceValue([value[0], value[1]])}
                    />
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
            </Modal>
        </>
    )
}

const TypeButton = ({ type, dispatch, withRoommates }) => {

    const [typeActive, setTypeActive] = useState(false)

    const [types, setTypes] = useState(type)

    useEffect(() => {
        setTypes(type)
    }, [type])

    const setTypeFilter = (e) => {
        e.preventDefault()
        dispatch(setFilters({ type: types }))
    }

    const handleTypes = (e) => {
        if (e.target.checked) {
            setTypes([...types, e.target.value])
        } else {
            setTypes(prevTypes => prevTypes.filter(item => item !== e.target.value))
        }
    }

    return (
        <>
            <button className={styles.button} onClick={() => { setTypeActive(true) }}>
                <FontAwesomeIcon icon={faBuilding} />Тип
            </button>
            <Modal active={typeActive} setActive={setTypeActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faBuilding} /> Тип</h2>
                <form className={styles.filterForm} onSubmit={setTypeFilter}>
                    <div className={styles.types}>
                        <CustomToggle label="Кровать" name="bed"
                            checked={types.includes('bed')} disabled={!withRoommates} onChange={handleTypes} />
                        <CustomToggle label="Комната" name="room"
                            checked={types.includes('room')} disabled={!withRoommates} onChange={handleTypes} />
                        <CustomToggle label="Квартира" name="flat"
                            checked={types.includes('flat')} disabled={withRoommates} onChange={handleTypes} />
                        <CustomToggle label="Дом" name="house"
                            checked={types.includes('house')} disabled={withRoommates} onChange={handleTypes} />
                        <CustomToggle label="Таунхаус" name="townhouse"
                            checked={types.includes('townhouse')} disabled={withRoommates} onChange={handleTypes} />
                    </div>
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
            </Modal>
        </>
    )
}

const FloorButton = ({ floor, dispatch }) => {

    const [floorActive, setFloorActive] = useState(false)

    const [floorValue, setFloorValue] = useState(floor)

    useEffect(() => {
        setFloorValue(floor)
    }, [floor])

    const setFloorFilter = (e) => {
        e.preventDefault()
        dispatch(setFilters({ floor: floorValue }))
    }

    return (
        <>
            <button className={styles.button} onClick={() => { setFloorActive(true) }}>
                <FontAwesomeIcon icon={faStairs} />Этаж
            </button>
            <Modal active={floorActive} setActive={setFloorActive}>
                <h2 className={styles.title}><FontAwesomeIcon icon={faStairs} /> Этаж</h2>
                <form className={styles.filterForm} onSubmit={setFloorFilter}>
                    <Slider
                        range
                        marks={{
                            1: floorValue[0],
                            50: floorValue[1]
                        }}
                        trackStyle={{ 'background-color': '#2B67F6' }}
                        min={1}
                        max={50}
                        value={floorValue}
                        onChange={(value) => setFloorValue([value[0], value[1]])}
                    />
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
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