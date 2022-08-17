import styles from './Modal.module.scss'

export default function Modal({ active, setActive, children }) {
   return (
      <div className={`${styles.container} ${active && styles.active}`} onClick={() => setActive(false)}>
         <div className={`${styles.content} ${active && styles.active}`} onClick={e => e.stopPropagation()}>
            {children}
         </div>
      </div>
   )
}