import { useState } from 'react'
import styles from './Filters.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faBuilding, faStairs, faSliders, faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import { enumerate } from '../../utils/functions'
import CustomToggle from '../CustomToggle/CustomToggle'
import Modal from '../Modal/Modal'
import Dropdown from '../Dropdown/Dropdown'

export default function Filters() {

    return (
        <div className={styles.container}>
            <Headline />
            <RoommatesToggle />
            <div className={styles.buttons}>
                <PriceButton />
                <TypeButton />
                <FloorButton />
                <MoreButton />
            </div>
            <SortBy />
        </div>
    )
}

const Headline = () => {

    return (
        <div className={styles.headline}>
            <h1 className={styles.title}>Квартиры в России</h1>
            <p className={styles.resultNum}>122 {enumerate(122, ["результат", "результата", "результатов"])}</p>
        </div>
    )
}

const RoommatesToggle = () => {

    return (
        <div className={styles.roommatesToggle}>
            <CustomToggle
                name="roommates"
                label="С соседями"
                checked={true}
            // onChange={() => { props.setRoommates(!props.roommates); props.setFilters(!props.new); rmTypes() }}
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

const SortBy = () => {

    const [sortByActive, setSortByActive] = useState(false)

    return (
        <div className={styles.sortBy}>
            <Dropdown
                active={sortByActive}
                setActive={setSortByActive}
                button={
                    <>Сортировать по: <span>Новизне</span></>
                }
            >
                <SortByList />
            </Dropdown>
        </div>
    )
}

const SortByList = () => {
    return (
        <ul className={styles.list}>
            <li className={styles.item}>Цене(убыв)</li>
            <li className={styles.item}>Цене(возр)</li>
            <li className={styles.item}>Рейтингу</li>
            <li className={styles.item}>Площади</li>
        </ul>
    )
}