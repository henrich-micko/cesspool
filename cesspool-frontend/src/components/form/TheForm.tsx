import React from "react"
import styles from "@styles/components/form/styles.module.scss"
import TheButton from "./TheButton"

interface Props {
    children: React.ReactNode
    error?: string
    onClick(): void
}

const TheForm: React.FC<Props> = (props) => {
    return (
        <div className={styles.theForm}> 
            <div className={styles.childrenWrapper}>
                {props.children}
            </div>
                                
            <div className={styles.buttonWrapper}>
                <span className={styles.errorMessage}>{props.error}</span>
                <TheButton label="Potvrdit" onClick={props.onClick} type="blue" />     
            </div>
        </div>
    )
}

export default TheForm
