import styles from './CustomToggle.module.scss'

export default function CustomToggle(props) {
    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor={props.name}>{props.label}</label>
            <input
                className={styles.toggle}
                type="checkbox"
                id={props.name}
                checked={props.checked}
                // defaultChecked={props.defaultChecked}
                value={props.name}
                onChange={props.onChange}
                onClick={props.onClick}
                disabled={props.disabled}
            />
        </div>
    )
}