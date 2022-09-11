import React from "react"

// styles && icons
import styles from "@styles/components/machine/machinePanel.module.scss"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartSimple, faSliders, faTriangleExclamation, faStopwatch } from "@fortawesome/free-solid-svg-icons"

// types and hooks
import { MachineType } from "../../types"
import useIsMobile from "../../hooks/useIsMobile"

// components
import { StatusLevel, StatusBattery } from "./StatusIcon"

interface Props {
    machine: MachineType;
    handleIcon(iconName: string): void
}

const MachinePanel: React.FC<Props> = (props) => {
    const { machine, handleIcon } = props
    const isMobile = useIsMobile()


    const problemsIconClass = () => {
        const problemsImportanceMax = Math.max(...props.machine.problems.map(item => item.importance))
        return problemsImportanceMax === 0 ? styles.yellow : problemsImportanceMax === 1 ? styles.red : undefined
    }
    
    return (
        <div className={classNames(styles.panel, isMobile ? styles.mobile : undefined)}>
            <div className={classNames(styles.titleWrapper, isMobile ? styles.mobile : undefined)}>
                <h2>{machine.title !== null ? machine.title : machine.code}</h2>
                {isMobile &&
                    <div className={classNames(styles.statusLevelDesktop, isMobile && styles.mobile)}>
                        <StatusLevel machine={machine} />
                        <StatusBattery machine={machine}/>
                    </div>
                }
            </div>

            <div className={classNames(styles.controlPanel, isMobile ? styles.mobile : undefined)}>
                {!isMobile &&
                     <div className={styles.statusLevelDesktop}>
                        <StatusLevel machine={machine} />
                        <StatusBattery machine={machine}/>
                    </div>
                }

                <FontAwesomeIcon 
                    className={classNames(styles.icon, isMobile ? styles.mobile : undefined)} 
                    icon={faChartSimple}
                    size={isMobile ? "lg": undefined} 
                    onClick={() => handleIcon("charts")}
                />

                <FontAwesomeIcon
                    className={classNames(styles.icon, isMobile ? styles.mobile : undefined)}
                    icon={faStopwatch}
                    size={isMobile ? "lg": undefined} 
                    onClick={() => handleIcon("release")}
                />

                <FontAwesomeIcon
                    className={classNames(styles.icon, isMobile ? styles.mobile : undefined, problemsIconClass())}
                    icon={faTriangleExclamation}
                    size={isMobile ? "lg": undefined} 
                    onClick={() => handleIcon("problems")}
                />

                <FontAwesomeIcon 
                    className={classNames(styles.icon, isMobile ? styles.mobile : undefined)}
                    icon={faSliders}
                    size={isMobile ? "lg": undefined}
                    onClick={() => handleIcon("settings")}
                />
            </div>
        </div>
    )
}

export default MachinePanel