import React, { useState } from "react"

// styles && icons && animations
import styles from "./styles.module.scss"
import classNames from "classnames"
import { useAutoAnimate } from '@formkit/auto-animate/react'

// mobile respo
import useIsMobile from "../../../hooks/useIsMobile"

// api
import { MachineAdminType } from "../../../types"

// components
import MachineAdminPanel from "./MachineAdminPanel"

interface Props {
    machine: MachineAdminType,
    refresh(): void
}

const MachineAdminBoard: React.FC<Props> = (props) => {
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
            <MachineAdminPanel machine={machine}/>
        </div>
    )
}

export default MachineAdminBoard