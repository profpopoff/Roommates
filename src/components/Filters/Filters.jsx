import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Filters.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faBuilding, faStairs, faSliders, faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'
import { cityIn, cityFrom, cityTo } from 'lvovich'

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
        <section className={styles.container}>
            <Headline apartments={apartments} filters={filters} />
            <RoommatesToggle withRoommates={filters.withRoommates} dispatch={dispatch} />
            <div className={styles.buttons}>
                <PriceButton {...filters.price} dispatch={dispatch} />
                <TypeButton type={filters.type} withRoommates={filters.withRoommates} dispatch={dispatch} />
                <FloorButton {...filters.floor} dispatch={dispatch} />
                <MoreButton />
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
                (apartment.price.value <= filters.price.max && apartment.price.value >= filters.price.min) &&
                filters.type.includes(apartment.type) &&
                (apartment.stats.floor <= filters.floor.max && apartment.stats.floor >= filters.floor.min) &&
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
                onClick={(e) => dispatch(setFilters({ withRoommates: e.target.checked }))}
            />
        </div>
    )
}

//! баг: если перейти на другую страницу, 
//! а затем вернуться, фильтры все еще будут применены, 
//! но на слайдере это не отображается (не знаю, как задать начальные значения (мб useMemo или что-то еще поможет))
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
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
            </Modal>
        </>
    )
}

const TypeButton = ({ type, dispatch, withRoommates }) => {

    const [typeActive, setTypeActive] = useState(false)

    const [types, setTypes] = useState(type)

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
                            checked={types.includes('bed')} disabled={!withRoommates} onClick={handleTypes} />
                        <CustomToggle label="Комната" name="room"
                            checked={types.includes('room')} disabled={!withRoommates} onClick={handleTypes} />
                        <CustomToggle label="Квартира" name="flat"
                            checked={types.includes('flat')} disabled={withRoommates} onClick={handleTypes} />
                        <CustomToggle label="Дом" name="house"
                            checked={types.includes('house')} disabled={withRoommates} onClick={handleTypes} />
                        <CustomToggle label="Таунхаус" name="townhouse"
                            checked={types.includes('townhouse')} disabled={withRoommates} onClick={handleTypes} />
                    </div>
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
            </Modal>
        </>
    )
}

const FloorButton = ({ min, max, dispatch }) => {

    const [floorActive, setFloorActive] = useState(false)

    const [floorValue, setFloorValue] = useState({ min, max })

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
                    <MultiRangeSlider
                        min={0}
                        max={50}
                        onChange={({ min, max }) => setFloorValue({ min, max })}
                    />
                    <input className="submit-btn" type="submit" value="Применить" />
                </form>
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