import React from "react"

// styles && icons
import styles from "./styles.module.scss"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartSimple, faSliders, faInfoCircle, faTriangleExclamation, faStopwatch } from "@fortawesome/free-solid-svg-icons"

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
                <h2>{machine.title !== null ? machine.title : "Untitled"}</h2>
            </div>

            <div className={classNames(styles.controlPanel, isMobile ? styles.mobile : undefined)}>
                {!isMobile
                    ? <div className={styles.statusLevelDesktop}>
                        <StatusLevel 
                            level={machine.level_percent !== null ? machine.level_percent : machine.level !== null ? machine.level : undefined}
                            label={machine.level_percent !== null ? "%" : machine.level !== null ? "l" : undefined}
                        />
                        <StatusBattery battery={machine.battery !== null ? machine.battery : undefined}/>
                    </div>
                    : <FontAwesomeIcon className={styles.icon} icon={faInfoCircle} size="lg" onClick={() => handleIcon("info")}/>
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