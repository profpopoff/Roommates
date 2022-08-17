import styles from './CustomTextarea.module.scss'
import { useState } from 'react'

export default function CustomTextarea(props) {

    const [text, setText] = useState(props.value)

    return (
        <div className={styles.container}>
            <textarea
                className={styles.textArea}
                name={props.name}
                placeholder={props.placeholder}
                value={text}
                onChange={e => { setText(e.target.value); props.handleChange(e) }}
            ></textarea>
            <label className={styles.label} htmlFor={props.name}>{props.label}</label>
        </div>
    )
}