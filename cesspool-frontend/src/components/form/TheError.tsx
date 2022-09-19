import React from "react"
import styles from "@styles/components/form/styles.module.scss"

interface Props {
    label: string
}

const TheError: React.FC<Props> = (props) => {
    return (
        <span className={styles.error}>{props.label}</span>
    )
}

export default TheError