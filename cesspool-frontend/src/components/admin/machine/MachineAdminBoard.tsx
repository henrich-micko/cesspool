import React, { useState } from "react"

// mobile respo
import useIsMobile from "../../../hooks/useIsMobile"

// api
import { MachineAdminType, UserType } from "../../../types"

// components
import MachineAdminPanel from "./MachineAdminPanel"
import ThemedBox from "@components/ThemedBox"
import MachineAdminSettings from "./views/MachineAdminSettings"
import MachineAdminDelete from "./views/MachineAdminDelete"
import MachineAdminDeleteRecords from "./views/MachineAdminDeleteRecords"

interface Props {
    machine: MachineAdminType,
    users: UserType[],
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminBoard: React.FC<Props> = (props) => {    
    const [machineView, setMachineView] = useState<string>("")    
    const isMobile = useIsMobile()

    const handleIcon = (iconName: string) => {
        setMachineView(prevState => {
            return prevState === iconName ? "" : iconName
        })
    }

    return (
        <ThemedBox>
            <MachineAdminPanel handleIcon={handleIcon} machine={props.machine} />

            {
                machineView === "settings" ?
                    <MachineAdminSettings machine={props.machine} setMachine={props.setMachine} users={props.users}/> :

                machineView === "trash" ?
                    <MachineAdminDelete machine={props.machine} setMachine={props.setMachine} /> :

                machineView === "records" ? 
                    <MachineAdminDeleteRecords machine={props.machine} setMachine={props.setMachine} /> :

                undefined
                }
        </ThemedBox>
    )
}

export default MachineAdminBoard