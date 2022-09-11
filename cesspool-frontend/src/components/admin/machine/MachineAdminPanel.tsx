import React from "react"

// types
import { MachineAdminType } from "@types"

// styles && icons
import styles from "@styles/components/admin/machine/machineAdminPanel.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompactDisc, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons"

// components
import { MachineCode, MachineUser } from "./MachineInfo"
import useIsMobile from "@hooks/useIsMobile";
import classNames from "classnames";

interface Props {
    machine: MachineAdminType;
    handleIcon(icon: string): void
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
                <FontAwesomeIcon 
                    onClick={() => props.handleIcon("trash")} 
                    className={classNames(styles.icon, props.machine.delete_date !== null && styles.red)}
                    icon={faTrash}
                    size={isMobile ? "lg": undefined} 

                />
                <FontAwesomeIcon 
                    onClick={() => props.handleIcon("records")} 
                    className={classNames(styles.icon, props.machine.delete_records_date !== null && styles.red)}
                    icon={faCompactDisc}
                    size={isMobile ? "lg": undefined} 

                />
                <FontAwesomeIcon                
                    onClick={() => props.handleIcon("settings")} 
                    className={styles.icon}
                    icon={faSliders}
                    size={isMobile ? "lg": undefined} 
                />
            </div>
        </div>
    )
}

export default AdminMachinePanel