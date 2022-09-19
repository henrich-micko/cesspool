import React from "react"

// components
import ProblemsView from "./machineViews/ProblemsViews"
import TheBoard from "@components/TheBoard"
import { MachineType } from "@types"

interface Props {
    machine: MachineType
}

const styles = { 
    "width": "100%",
}

const MachineDesktopProblems: React.FC<Props> = (props) => {
    return (
        <TheBoard label="Problemy" style={styles} align="left">
            <ProblemsView machine={props.machine} />
        </TheBoard>
    )
}

export default MachineDesktopProblems