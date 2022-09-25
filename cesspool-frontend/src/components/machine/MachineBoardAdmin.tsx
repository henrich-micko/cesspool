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


interface Props {
    machine: MachineAdminType
    setMachine(newMachine: MachineAdminType): void
}

const MachineBoardAdmin: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)

    return (
        <ThemedBox 
            className={styles.machineBoard} 
            label={
                <h2 className={styles.user}>
                    {props.machine.code}
                    {
                        props.machine.user !== null &&
                        <span>/ {props.machine.user}</span>
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
                    <MachineChart machine={props.machine} />
                    <MachineDates machine={props.machine} />
                </div>
            {
                settings && 
                <PopUp label={"Nastavenia"} onClickClose={() => setSettings(false)}>
                    <MachineAdminSettings machine={props.machine} setMachine={props.setMachine} />
                </PopUp>
            }
        </ThemedBox>
    )
}

export default MachineBoardAdmin