import React, { useEffect, useState} from "react"

// styles && icons
import styles from "@styles/components/form/styles.module.scss"
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons"

interface Props {
    label: string;
    value: boolean;
    onSubmit(value: boolean): void
}

const SwitchInput: React.FC<Props> = (props) => {
    const handleClick = () => {
        const value = !props.value
        props.onSubmit(value)
    }

    return (
        <div className={styles.switchInput}>
            {props.label !== undefined && <span>{props.label}:</span>}   
            
            <FontAwesomeIcon
                className={classNames(styles.icon, props.value ? styles.on : styles.off)}
                icon={props.value ? faToggleOn : faToggleOff}
                onClick={handleClick}
                size="lg"
            />
        </div>
    )
}

export default SwitchInput