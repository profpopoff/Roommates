import { useTheme } from 'next-themes'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import styles from './Settings.module.scss'
import { setModal } from '../../redux/slices/modal'
import Modal from '../Modal/Modal'
import CustomToggle from '../CustomToggle/CustomToggle'

export default function Login() {

   const { theme, setTheme } = useTheme()

   const settingsActive = useSelector((state) => state.modal.modals.settingsActive)

   const dispatch = useDispatch()

   return (
      <Modal
         active={settingsActive}
         setActive={() => { dispatch(setModal({ settingsActive: false })) }}
      >
         <h2 className={styles.title}><FontAwesomeIcon icon={faGear} /> Настройки</h2>
         <div className={styles.settings}>
            <CustomToggle
               name="theme"
               label="Темная тема"
               checked={theme === 'dark'}
               onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
         </div>
      </Modal>
   )
}