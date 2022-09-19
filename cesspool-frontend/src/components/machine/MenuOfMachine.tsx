import React from "react"
import { MachineType } from "@types"
import styles from "@styles/components/machine/MenuOfMachine.module.scss"
import TheBoard from "@components/TheBoard"
import { StatusBattery, StatusLevel, StatusProblem } from "@components/machine/StatusIcon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh, faSliders } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"


interface MenuOfMachineLiProps {
    index: number
    machine: MachineType
    onClick(id: number): void
    isActive: boolean
}

const MenuOfMachineLi: React.FC<MenuOfMachineLiProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3 className={props.isActive ? styles.activate : undefined}>
                {props.machine.title !== null ? props.machine.title : props.machine.code}
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
    machines: MachineType[]
    onClick(id: number): void
    activate?: number
    onRefresh(): void
    behavior: "static" | "side" | "hide"
}

const MenuOfMachines: React.FC<Props> = (props) => {

    return (
        <TheBoard 
            label="Zariadenia" 
            className={classNames(styles.menuOfMachine, props.behavior === "side" && styles.sideBar, props.behavior === "hide" && styles.hide)}
            style={{"position": props.behavior === "side" ? "fixed" : "relative"}}
        >
            <div className={styles.refreshWrapper}>
                <div>
                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefresh}
                    />
                </div>
            </div>

            <ul>
                {props.machines.map((machine, index) =>
                    <MenuOfMachineLi 
                        isActive={props.activate === index}
                        index={index} 
                        machine={machine} 
                        onClick={props.onClick} 
                />
                )}
            </ul>
        </TheBoard>
    )
}

export default MenuOfMachines