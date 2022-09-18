import TheBoard from "@components/TheBoard"
import { MachineAdminType, UserType } from "@types"
import React from "react"
import MachineAdminSettings from "./views/MachineAdminSettings"

interface Props {
    machine: MachineAdminType
    setMachine(newMachine: MachineAdminType): void
    users: UserType[]
}

const MachineDesktopAdminBoard: React.FC<Props> = (props) => {
    return (
        <TheBoard label={props.machine.code}>
            <div>
                <MachineAdminSettings machine={props.machine} setMachine={props.setMachine} users={props.users} />
            </div>
        </TheBoard>
    ) 
}

export default MachineDesktopAdminBoard