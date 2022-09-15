import React, { useEffect } from "react"

// types
import { MachineType } from "@types"

import styles from "@styles/components/machine/machineDesktopBoard.module.scss"

import TheBoard from "@components/TheBoard"
import ChartsView from "./machineViews/ChartsView"
import ReleaseView from "./machineViews/ReleaseView"

interface Props {
    machine: MachineType
    setMachine(newMachine: MachineType): void
}

const MachineDesktopBoard: React.FC<Props> = (props) => {
    return (
        <TheBoard className={styles.machineBoard} label={props.machine.title !== null ? props.machine.title : props.machine.code }>
            <div className={styles.machineBoardBody}>
                <ChartsView machine={props.machine} />
                <ReleaseView machine={props.machine} />
            </div>
        </TheBoard>
    )
}

export default MachineDesktopBoard