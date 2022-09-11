import React from "react"
import { MachineType } from "@types"
import styles from "@styles/components/machine/MenuOfMachine.module.scss"
import TheBoard from "@components/TheBoard"
import { StatusBattery, StatusLevel } from "@components/machine/StatusIcon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"


interface MenuOfMachineLiNewProps {
    index: number;
    onClick(): void;
}

const MenuOfMachineLiNew: React.FC<MenuOfMachineLiNewProps> = (props) => {
    return (
        <li key={props.index}>
            <h3>Pridať nové</h3>
            <div className={styles.status}>
                <FontAwesomeIcon 
                    icon={faPlusCircle}
                    size="1x"    
                />
            </div>
        </li>
    )
}


interface MenuOfMachineLiProps {
    index: number;
    machine: MachineType;
    onClick(id: number): void;
    isActive: boolean
}

const MenuOfMachineLi: React.FC<MenuOfMachineLiProps> = (props) => {
    const problem = props.machine.problems.length !== 0 ?
                    props.machine.problems.at(0)?.importance :
                    undefined
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3 className={problem === 0 ? styles.yellow : styles.red}>
                {props.machine.title !== null ? props.machine.title : props.machine.code}
            </h3>
            <div className={styles.status}>
                <StatusLevel machine={props.machine} />
                <StatusBattery machine={props.machine} />
            </div>
        </li>
    )
}

interface Props {
    machines: MachineType[]
    onClick(id: number): void
    activate?: number
}

const MenuOfMachines: React.FC<Props> = (props) => {

    return (
        <TheBoard label="Zariadenia" className={styles.menuOfMachine} style={{"marginRight": "5em"}}>
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