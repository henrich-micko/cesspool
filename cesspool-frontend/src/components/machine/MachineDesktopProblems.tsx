import React from "react"

// components
import ProblemsView from "./machineViews/ProblemsViews"
import TheBoard from "@components/TheBoard"
import { MachineType } from "@types"

interface Props {
    machine: MachineType
}

const MachineDesktopProblems: React.FC<Props> = (props) => {
    return (
        <TheBoard label="Problemy" style={{"marginLeft": "5em", "paddingLeft": "1em", "paddingRight": "1em", "width": "15em"}} align="left">
            <ProblemsView machine={props.machine} />
        </TheBoard>
    )
}

export default MachineDesktopProblems