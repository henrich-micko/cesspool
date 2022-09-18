import React from "react"

import styles from "@styles/components/popUp.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"

interface Props {
    onClickClose(): void
    label?: string
    children: React.ReactNode
}

export const PageMusk: React.FC = () => {
    return (
        <div className={styles.pageMusk} />
    )
}

const PopUp: React.FC<Props> = (props) => {
    return (
        <>
            <PageMusk />
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3>{props.label !== undefined ? props.label : "Hello world"}</h3>
                    <FontAwesomeIcon
                        icon={faClose}
                        onClick={props.onClickClose}
                    />
                </div>
                <div className={styles.body}>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default PopUp