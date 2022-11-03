import React from "react"
import styles from "@styles/components/erros/styles.module.scss"

const Error404: React.FC = ()  => {
    return (
        <div className={styles.errorWrapper}>
            Stránka sa nenašla
        </div>
    )
}