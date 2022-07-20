import { useState } from 'react'
import styles from './Filters.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faBuilding, faStairs, faSliders, faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

import CustomToggle from '../CustomToggle/CustomToggle'
import Modal from '../Modal/Modal'
import Dropdown from '../Dropdown/Dropdown'

export default function Filters() {

    return (
        <div className={styles.container}>
            <Headline />
            <RoommatesToggle />
            <Buttons />
            <SortBy />
        </div>
    )
}

const Headline = () => {

    return (
        <div className={styles.headline}>
            <h1 className={styles.title}>Квартиры в России</h1>
            <p className={styles.resultNum}>121 {enumerate(121, ["результат", "результата", "результатов"])}</p>
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

const Buttons = () => {

    const [priceActive, setPriceActive] = useState(false)
    const [typeActive, setTypeActive] = useState(false)
    const [floorActive, setFloorActive] = useState(false)
    const [moreActive, setMoreActive] = useState(false)

    return (
        <div className={styles.buttons}>
            <button className={styles.button} onClick={() => { setPriceActive(true) }}>
                <FontAwesomeIcon icon={faTag} />Цена
            </button>
            <Modal active={priceActive} setActive={setPriceActive}>
               <h2 className={styles.title}><FontAwesomeIcon icon={faTag} />Цена</h2>
               {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
            <button className={styles.button} onClick={() => { setTypeActive(true) }}>
                <FontAwesomeIcon icon={faBuilding} />Тип
            </button>
            <Modal active={typeActive} setActive={setTypeActive}>
               <h2 className={styles.title}><FontAwesomeIcon icon={faBuilding} />Тип</h2>
               {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
            <button className={styles.button} onClick={() => { setFloorActive(true) }}>
                <FontAwesomeIcon icon={faStairs} />Этаж
            </button>
            <Modal active={floorActive} setActive={setFloorActive}>
               <h2 className={styles.title}><FontAwesomeIcon icon={faStairs} />Этаж</h2>
               {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
            <button className={styles.button} onClick={() => { setMoreActive(true) }}>
                <FontAwesomeIcon icon={faSliders} />Другое
            </button>
            <Modal active={moreActive} setActive={setMoreActive}>
               <h2 className={styles.title}><FontAwesomeIcon icon={faSliders} />Другое</h2>
               {/* <button className={styles.submit} onClick={() => { props.setFilters(!props.new); setPriceActive(false) }}>Применить</button> */}
            </Modal>
        </div>
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
                        <div>Сортировать по: </div>
                    }
                >
                    123
                </Dropdown>
        </div>
    )
}

export const enumerate = (num, dec) => {
    if (num <= 20 && num >= 10) return dec[2]
    if (num > 20) num = num % 10
    if (num > 100) num = num % 100
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2]
}