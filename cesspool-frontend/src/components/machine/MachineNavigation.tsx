import React from "react"

// styles && icons
import styles from "@styles/components/machine/machineNavigation.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons"


interface Props {
    onPlus(): void;
    onRefresh(): void;
}

const MachineNavigation: React.FC<Props> = (props) => {
    return(
        <div className={styles.machineNavigation}>
            <FontAwesomeIcon className={styles.icon} icon={faPlusCircle} onClick={props.onPlus}/>
            <FontAwesomeIcon className={styles.icon} icon={faRefresh} onClick={props.onRefresh} />
        </div>
    )
}

export default MachineNavigation