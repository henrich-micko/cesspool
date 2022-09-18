import React from "react"

// style && icons
import styles from "@styles/components/admin/machine/machineInfo.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faUser } from "@fortawesome/free-solid-svg-icons"


interface MachineCodeProps {
    code: string
}

export const MachineCode: React.FC<MachineCodeProps> = (props) => {
    return (
        <div className={styles.machineInfo}>
            {/* <FontAwesomeIcon icon={faCode} /> */}
            <span>{props.code}</span>
        </div>
    )
} 

interface MachineUserProps {
    user: string|null,
}

export const MachineUser: React.FC<MachineUserProps> = (props) => {
    const shortEmail = (email: string): string => {
        if (email.length >= 15) return Array.from(email).slice(0, 15).join("") + "..."
        return email
    }

    return (
        <div className={styles.machineInfo}>
            <FontAwesomeIcon icon={faUser} style={{"marginRight": "0.25em"}} />
            <span>{props.user !== null ? shortEmail(props.user) : "Nepridelené"}</span>
        </div>
    )
}