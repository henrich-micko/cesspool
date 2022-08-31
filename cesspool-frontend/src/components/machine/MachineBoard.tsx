import React, { useState } from "react"

// mobile respo
import useIsMobile from "../../hooks/useIsMobile"

// api
import { MachineType } from "../../types"

// conponents
import MachinePanel from "./MachinePanel"
import ChartsView from "./machineViews/ChartsView"
import SettingsView from "./machineViews/SettingsView"
import ProblemsView from "./machineViews/ProblemsViews"
import ReleaseView from "./machineViews/ReleaseView"
import TheBoard from "@components/TheBoard"

interface Props {
    machine: MachineType,
    refresh(): void
}

const Machine: React.FC<Props> = (props) => {
    const [machineView, setMachineView] = useState<string>("")    
    const isMobile = useIsMobile()

    const { machine } = props

    const handleIcon = (iconName: string) => {
        setMachineView(prevState => {
            return prevState === iconName ? "" : iconName
        })
    }

    return (
        <TheBoard isActive={machineView !== "" && !isMobile}>
            {/* Top panel */}
            <MachinePanel machine={machine} handleIcon={handleIcon} />

            {/* Body machineView */}

            { machineView === "charts" ?
                <ChartsView machine={machine} />

            : machineView === "settings" ?
                <SettingsView machine={machine} refresh={props.refresh}/>

            : machineView === "problems" ?
                <ProblemsView machine={machine} />
                
            : machineView === "release" ?
                <ReleaseView machine={machine} />

            : <></>
            }
        </TheBoard>
    )
}

export default Machine