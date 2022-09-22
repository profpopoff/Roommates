import { useEffect, useRef } from 'react'

import styles from './Dropdown.module.scss'

export default function Dropdown({ active, setActive, children, button }) {

    const ref = useRef(null);

    const handleActive = () => setActive(prevActive => !prevActive)

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (active && ref.current && !ref.current.contains(e.target)) {
                handleActive()
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [active])

    return (
        <div className={styles.container} ref={ref} onClick={e => e.stopPropagation()}>
            <div className={styles.button} onClick={handleActive}>
                {button}
            </div>
            <div className={active ? `${styles.menu} ${styles.active}` : styles.menu}>
                {children}
            </div>
        </div>
    )
}