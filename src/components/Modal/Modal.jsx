import styles from './Modal.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Modal({ active, setActive, children }) {
   return (
      <div className={`${styles.container} ${active && styles.active}`} onClick={() => setActive(false)}>
         <div className={`${styles.content} ${active && styles.active}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActive(false)}><FontAwesomeIcon icon={faXmark} /></button>
            {children}
         </div>
      </div>
   )
}