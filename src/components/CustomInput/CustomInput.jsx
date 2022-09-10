import styles from './CustomInput.module.scss'
import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function CustomInput(props) {

    const [text, setText] = useState(props.value ? props.value : '')

    const [type, setType] = useState(props.type)

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type={type}
                initialtype={props.type}
                name={props.name}
                id={props.name}
                placeholder={props.label}
                value={text}
                onChange={e => { setText(e.target.value); props.handleChange(e) }}
                autoComplete="off"
            />
            <label className={styles.label} htmlFor={props.name}>{props.label}</label>
            {props.type === 'password' &&
                <button className={styles.toggleType} type="button" onClick={type === 'password' ? () => setType('text') : () => setType('password')} >
                    <FontAwesomeIcon icon={type === 'password' ? faEyeSlash : faEye} />
                </button>
            }
        </div>
    )
}