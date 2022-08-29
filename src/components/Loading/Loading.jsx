import styles from './Loading.module.scss'

export default function Loading() {
   return (
      <div className={styles.container}>
         <div className={styles.spinner}>
            <div className={styles.box}>
               <div className={styles.bubble}></div>
               <div className={styles.bubble}></div>
               <div className={styles.bubble}></div>
            </div>
         </div>
      </div>
   )
}