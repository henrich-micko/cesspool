import React, { useState } from "react"

// types && styles && icons
import { MachineAdminType } from "@types"
import styles from "@styles/components/machine/machineBoard.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"

// components
import MachineChart from "./MachineChart"
import MachineDates from "./MachineDates"
import PopUp from "@components/PopUp"
import ThemedBox from "@components/ThemedBox"
import MachineAdminSettings from "./MachineSettingsAdmin"
import { useMaxWidth } from "@hooks/useIsMobile"
import { maxLenghtEmail } from "formats"


interface Props {
    code: string
    user: string|null
    last_update: string
    mqtt: boolean
    notification: boolean
    setMachine(newMachine: MachineAdminType): void
}

const MachineBoardAdmin: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)

    const handleSettingsSubmit = (newMachine: MachineAdminType) => {
        props.setMachine(newMachine)
        setSettings(false)
    }

    const viewEmail = useMaxWidth("15000px")

    return (
        <ThemedBox 
            className={styles.machineBoard} 
            label={
                <h2 className={styles.user}>
                    {props.code}
                    {
                        props.user !== null &&
                        <span>/ {false ? props.user : props.user.split("@").at(0)}</span>
                    }
                </h2>
            }
            header={
                <div className={styles.settingsWrapper}>
                    <FontAwesomeIcon
                        icon={faSliders}
                        onClick={() => setSettings(true)}
                    />
                </div>
            }> 
                <div className={styles.machineBoardBody}>
                    <MachineChart code={props.code} />
                    <MachineDates last_update={props.last_update} code={props.code} />
                </div>
            {
                settings && 
                <PopUp label={"Nastavenia"} onClickClose={() => setSettings(false)}>
                    <MachineAdminSettings 
                        code={props.code}
                        user={props.user}
                        mqtt={props.mqtt}
                        notification={props.notification}
                        setMachine={handleSettingsSubmit} />
                </PopUp>
            }
        </ThemedBox>
    )
}

export default MachineBoardAdmin