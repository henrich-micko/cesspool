import React from "react"

import ThemedBox from "@components/ThemedBox"
import { MachineAdminType } from "@types"
import MachineAdminDelete from "./MachineDelete"
import MachineAdminDeleteRecords from "./MachineDeleteRecords"

import styles from "@styles/components/machine/machineDeleteBoard.module.scss"

interface Props {
    machine: MachineAdminType
    setMachine(newMachine: MachineAdminType): void
}

const MachineDeleteBoard: React.FC<Props> = (props) => {
    return (
        <ThemedBox label="Odstraniť" className={styles.deleteBoard}>
            <MachineAdminDelete machine={props.machine} setMachine={props.setMachine} />
            <MachineAdminDeleteRecords machine={props.machine} setMachine={props.setMachine} />
        </ThemedBox>
    )
}

export default MachineDeleteBoard