import { useTheme } from 'next-themes'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import styles from './Settings.module.scss'
import Modal from '../Modal/Modal'
import { setModal } from '../../redux/slices/modal'
import CustomToggle from '../CustomToggle/CustomToggle'

export default function Settings() {

   const { theme, setTheme } = useTheme()

   const settingsModal = useSelector((state) => state.modal.modals.settingsActive)

   const dispatch = useDispatch()

   return (
      <Modal active={settingsModal} setActive={() => { dispatch(setModal({ settingsActive: false })) }}>
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