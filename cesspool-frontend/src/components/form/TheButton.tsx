import React from "react"

import styles from "@styles/components/form/styles.module.scss"

interface Props {
    label: string
    onClick(): void
    type?: "red"|"blue"
}

const TheButton: React.FC<Props> = (props) => {
    const buttonType = props.type !== undefined ? props.type : "red"

    return (
        <div className={styles.theButton}>
            <input
                className={buttonType === "red" ? styles.red : buttonType === "blue" ? styles.blue : undefined}
                type="button"
                value={props.label}
                onClick={() => props.onClick()}
            />
        </div>
    )
}

export default TheButton