import ThemedBox from "@components/ThemedBox"
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
        <ThemedBox label={props.machine.code}>
            <div>
                <MachineAdminSettings machine={props.machine} setMachine={props.setMachine} users={props.users} />
            </div>
        </ThemedBox>
    ) 
}

export default MachineDesktopAdminBoard