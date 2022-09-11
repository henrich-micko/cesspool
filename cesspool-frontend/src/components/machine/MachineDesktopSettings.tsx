import React from "react"

// components
import ProblemsView from "./machineViews/SettingsView"
import TheBoard from "@components/TheBoard"
import { MachineType } from "@types"
import SettingsView from "./machineViews/SettingsView"

interface Props {
    machine: MachineType
    setMachine(newMachine: MachineType): void
}

const MachineDesktopSettings: React.FC<Props> = (props) => {
    return (
        <TheBoard label="Parametre" style={{"marginLeft": "5em", "paddingLeft": "1em", "paddingRight": "1em", "marginTop": "5em"}}>
            <SettingsView machine={props.machine} setMachine={props.setMachine} />
        </TheBoard>
    )
}

export default MachineDesktopSettings