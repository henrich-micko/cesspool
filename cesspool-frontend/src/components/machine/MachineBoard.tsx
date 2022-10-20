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
    title: string|null
    code: string
    hight_level: number
    last_udpate: string
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
            label={props.title !== null ? props.title : props.code}
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
                    <MachineDates code={props.code} last_update={props.last_udpate} />
                </div>
            {
                settings && 
                <PopUp label={"Nastavenia"} onClickClose={() => setSettings(false)}>
                    <MachineSettings code={props.code} title={props.title} hight_level={props.hight_level} setMachine={handleSettingsSubmit} />
                </PopUp>
            }
        </ThemedBox>
    )
}

export default MachineBoard