import React, { useState} from "react"

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
    const [status, setStatus] = useState<boolean>(props.value)

    const handleClick = () => {
        setStatus(prevStatus => !prevStatus)
        props.onSubmit(status)
    }

    return (
        <div className={styles.switchInput}>
            {props.label !== undefined && <span>{props.label}:</span>}   
            
            <FontAwesomeIcon
                className={classNames(styles.icon, status ? styles.on : styles.off)}
                icon={status ? faToggleOn : faToggleOff}
                onClick={handleClick}
                size="lg"
            />
        </div>
    )
}

export default SwitchInput