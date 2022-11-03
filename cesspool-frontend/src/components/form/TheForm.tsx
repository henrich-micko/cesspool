import React from "react"
import styles from "@styles/components/form/styles.module.scss"
import TheButton from "./TheButton"

interface Props {
    children: React.ReactNode
    error?: string
    onClick(): void
    buttonLabel?: string
    childrenWidth?: string
}

const TheForm: React.FC<Props> = (props) => {
    return (
        <div className={styles.theForm}> 
            <div className={styles.childrenWrapper} style={props.childrenWidth !== undefined ? {width: props.childrenWidth} : undefined}>
                {props.children}
            </div>
                                
            <div className={styles.buttonWrapper}>
                <span className={styles.errorMessage}>{props.error}</span>
                <TheButton 
                    label={props.buttonLabel === undefined ? "Potvrdiť" : props.buttonLabel}
                    onClick={props.onClick} type="blue" 
                />     
            </div>
        </div>
    )
}

export default TheForm
