import ThemedBox from "@components/ThemedBox"
import { MachineAdminType } from "@types"
import React from "react"
import MachineAdminDelete from "./views/MachineAdminDelete"
import MachineAdminDeleteRecords from "./views/MachineAdminDeleteRecords"

interface Props {
    machine: MachineAdminType
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminDangerzone: React.FC<Props> = (props) => {
    return (
        <ThemedBox label="Danger zone">
            <div style={{"width": "40em"}}>
                <MachineAdminDelete machine={props.machine} setMachine={props.setMachine} />
                <MachineAdminDeleteRecords machine={props.machine} setMachine={props.setMachine} />
            </div>
        </ThemedBox>
    )
}

export default MachineAdminDangerzone