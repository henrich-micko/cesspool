import React, { useState } from "react"

// types && styles && icons
import { MachineType } from "@types"
import styles from "@styles/components/machine/machineBoard.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"

// components
import MachineChart from "./MachineChart"
import MachineDates from "./MachineDates"
import PopUp from "@components/PopUp"
import MachineSettings from "./MachineSettings"
import ThemedBox from "@components/ThemedBox"


interface Props {
    machine: MachineType
    setMachine(newMachine: MachineType): void
}

const MachineBoard: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)

    const handleSettingsSubmit = (newMachine: MachineType) => {
        props.setMachine(newMachine)
        setSettings(false)
    }

    return (
        <ThemedBox 
            className={styles.machineBoard} 
            label={props.machine.title !== null ? props.machine.title : props.machine.code }
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
                    <MachineSettings machine={props.machine} setMachine={handleSettingsSubmit} />
                </PopUp>
            }
        </ThemedBox>
    )
}

export default MachineBoard