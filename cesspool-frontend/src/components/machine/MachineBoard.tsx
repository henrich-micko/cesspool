import React, { useState } from "react"

// styles && icons && animations
import styles from "./styles.module.scss"
import classNames from "classnames"
import { useAutoAnimate } from '@formkit/auto-animate/react'

// mobile respo
import useIsMobile from "../../hooks/useIsMobile"

// api
import { MachineType } from "../../types"

// conponents
import MachinePanel from "./MachinePanel"
import InfoView from "./machineViews/InfoView"
import ChartsView from "./machineViews/ChartsView"
import SettingsView from "./machineViews/SettingsView"
import ProblemsView from "./machineViews/ProblemsViews"
import ReleaseView from "./machineViews/ReleaseView"

interface Props {
    machine: MachineType,
    refresh(): void
}

const Machine: React.FC<Props> = (props) => {
    const { machine } = props
    
    const [machineView, setMachineView] = useState<string>("")    
    const isMobile = useIsMobile()

    const [animationParent] = useAutoAnimate<HTMLDivElement>()

    const handleIcon = (iconName: string) => {
        setMachineView(prevState => {
            return prevState === iconName ? "" : iconName
        })
    }

    return (
        <div ref={animationParent} className={classNames(styles.machine, isMobile ? styles.mobile : undefined, machineView !== "" && (!isMobile && machineView !== "info") ? styles.activate : undefined)}>
            {/* Top panel */}
            <MachinePanel machine={machine} handleIcon={handleIcon} />

            {/* Body machineView */}
            {machineView === "info" && isMobile ?
                <InfoView machine={machine} />

            : machineView === "charts" ?
                <ChartsView machine={machine} />

            : machineView === "settings" ?
                <SettingsView machine={machine} refresh={props.refresh}/>

            : machineView === "problems" ?
                <ProblemsView machine={machine} />
                
            : machineView === "release" ?
                <ReleaseView machine={machine} />

            : <></>
            }
        </div>
    )
}

export default Machine