import styles from './CustomInput.module.scss'
import { useState } from 'react'

export default function CustomInput(props) {

    const [text, setText] = useState(props.value ? props.value : '')

    // useEffect(() => {
    //    setText(props.value)
    // }, [props.value])

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type={props.type}
                name={props.name}
                id={props.name}
                placeholder={props.label}
                value={text}
                onChange={e => { setText(e.target.value); props.handleChange(e) }}
                autoComplete="off"
            />
            <label className={styles.label} htmlFor={props.name}>{props.label}</label>
        </div>
    )
}