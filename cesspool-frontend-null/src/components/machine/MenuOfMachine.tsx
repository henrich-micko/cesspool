import React from "react"
import { MachineForMenu } from "@types"
import styles from "@styles/components/machine/menuOfMachine.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import { StatusBattery, StatusLevel, StatusProblem } from "./MachineIcons"
import { maxLength } from "formats"
import TheLoading from "@components/TheLoading"


interface MachineItemProps {
    index: number
    isActive: boolean
    title: string
    level: number
    battery: number
    topProblem: null | "warning" | "error"
    onClick(index: number): void
}

const MachineItem: React.FC<MachineItemProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3 className={props.isActive ? styles.activate : undefined}>
                {maxLength(props.title, 6)}
            </h3>

            <div className={styles.status}>
                <div className={styles.level}>
                    <StatusLevel level={props.level} />
                    <StatusBattery battery={props.battery} />
                </div>
                <StatusProblem topProblem={props.topProblem} />
            </div>
        </li>
    )
}

interface Props {
    machines: MachineForMenu[]|null
    activate?: number
    onRefreshClick(): void
    onMachineClick(id: number): void
}

const MenuOfMachines: React.FC<Props> = (props) => {
    return (
        <div className={styles.menuOfMachine}>
            <div className={styles.header}>
                <h2>Moje zariadenia</h2>

                <FontAwesomeIcon
                    icon={faRefresh}
                    onClick={props.onRefreshClick}
                    className={styles.icon}
                />
            </div>
            
            <ul>
                {props.machines !== null && props.machines.map((machine, index) =>
                    <MachineItem 
                        index={index}
                        isActive={props.activate === index}
                        title={machine.title}
                        topProblem={machine.topProblem}
                        battery={machine.battery}
                        level={machine.level}
                        onClick={props.onMachineClick} 
                    />
                )}
            </ul>

            {
                props.machines === null &&
                <TheLoading />
            }
        </div>
    )
}

export default MenuOfMachines