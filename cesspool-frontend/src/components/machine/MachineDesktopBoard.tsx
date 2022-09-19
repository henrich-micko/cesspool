import React, { useEffect, useState } from "react"

// types
import { MachineType } from "@types"

import styles from "@styles/components/machine/machineDesktopBoard.module.scss"

import TheBoard from "@components/TheBoard"
import ChartsView from "./machineViews/ChartsView"
import ReleaseView from "./machineViews/ReleaseView"
import TheButton from "@components/form/TheButton"
import PopUp from "@components/PopUp"
import SettingsView from "./machineViews/SettingsView"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleExclamation, faSliders } from "@fortawesome/free-solid-svg-icons"

interface Props {
    machine: MachineType
    setMachine(newMachine: MachineType): void
}

const MachineDesktopBoard: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)

    return (
        <TheBoard className={styles.machineBoard} label={props.machine.title !== null ? props.machine.title : props.machine.code }>
            <div className={styles.settingsWrapper}>
                <div>
                    <FontAwesomeIcon
                        icon={faSliders}
                        onClick={() => setSettings(true)}
                    />
                </div>
            </div>
            
            <div className={styles.machineBoardBody}>
                <ChartsView machine={props.machine} />
                <ReleaseView machine={props.machine} />
            </div>

            {settings && 
            <PopUp label={"Nastavenia zariadenia"} onClickClose={() => setSettings(false)}>
                <SettingsView machine={props.machine} setMachine={props.setMachine} />
            </PopUp>}
        </TheBoard>
    )
}

export default MachineDesktopBoard