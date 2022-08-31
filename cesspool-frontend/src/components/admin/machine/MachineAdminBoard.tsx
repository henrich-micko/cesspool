import React, { useState } from "react"

// mobile respo
import useIsMobile from "../../../hooks/useIsMobile"

// api
import { MachineAdminType } from "../../../types"

// components
import MachineAdminPanel from "./MachineAdminPanel"
import TheBoard from "@components/TheBoard"
import MachineAdminSettings from "./views/MachineAdminSettings"

interface Props {
    machine: MachineAdminType,
    refresh(): void
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
        <TheBoard isActive={machineView !== "" && (!isMobile && machineView !== "info")}>
            <MachineAdminPanel handleIcon={handleIcon} machine={props.machine} />

            {machineView === "settings" ?
                <MachineAdminSettings machine={props.machine} refresh={props.refresh} />
                : undefined
            }
        </TheBoard>
    )
}

export default MachineAdminBoard