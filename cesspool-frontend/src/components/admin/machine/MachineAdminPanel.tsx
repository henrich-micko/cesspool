import React from "react"

// types
import { MachineAdminType } from "../../../types"

// styles && icons
import styles from "./styles.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders, faTrash } from "@fortawesome/free-solid-svg-icons"

// components
import { MachineCode, MachineUser } from "./MachineInfo"
import useIsMobile from "@hooks/useIsMobile";
import classNames from "classnames";

interface Props {
    machine: MachineAdminType;
}

const AdminMachinePanel: React.FC<Props> = (props) => {
    const isMobile = useIsMobile()

    return (
        <div className={classNames(styles.adminMachinePanel, isMobile && styles.mobile)}>
            <div className={styles.info} >
                <MachineCode code={props.machine.code} />
                <MachineUser user={props.machine.user} />
            </div>
            <div className={styles.panel}>
                <FontAwesomeIcon className={styles.icon} icon={faTrash} />
                <FontAwesomeIcon className={styles.icon} icon={faSliders} />
            </div>
        </div>
    )
}

export default AdminMachinePanel