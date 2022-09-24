import React from "react"

// types && styles && icons
import { MachineType } from "@types"
import styles from "@styles/components/machine/MenuOfMachine.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons"

// components
import { StatusBattery, StatusLevel, StatusProblem } from "./MachineIcons"


interface MenuOfMachineLiProps {
    index: number
    machine: MachineType
    onClick(id: number): void
    isActive: boolean
}

const MenuOfMachineLi: React.FC<MenuOfMachineLiProps> = (props) => {
    let label = props.machine.title !== null ? props.machine.title : props.machine.code
    if (label.length >= 7) label = Array.from(label).slice(0, 5).join("") + "..."

    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3 className={props.isActive ? styles.activate : undefined}>
                {label}
            </h3>

            <div className={styles.status}>
                <div className={styles.level}>
                    <StatusLevel machine={props.machine} />
                    <StatusBattery machine={props.machine} />
                </div>
                <StatusProblem machine={props.machine} />
            </div>
        </li>
    )
}

interface Props {
    machines: MachineType[]|null
    activate?: number
    onRefresh(): void
    onClose(): void
    onClick(id: number): void
}

const MenuOfMachines: React.FC<Props> = (props) => {

    return (
        <div className={styles.menuOfMachine}>
            <div className={styles.header}>
                <h2>Moje zariadenia</h2>

                <FontAwesomeIcon
                    icon={faRefresh}
                    onClick={props.onRefresh}
                />
            </div>
            
            <ul>
                {props.machines !== null && props.machines.map((machine, index) =>
                    <MenuOfMachineLi 
                        isActive={props.activate === index}
                        index={index} 
                        machine={machine} 
                        onClick={props.onClick} 
                />
                )}
            </ul>
        </div>
    )
}

export default MenuOfMachines