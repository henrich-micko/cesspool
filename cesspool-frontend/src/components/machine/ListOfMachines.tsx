import React from "react"

// types
import { MachineType } from "../../types"

import MachineBoard from "./MachineBoard"

import styles from "@styles/components/machine/listOfMachines.module.scss"

interface Props {
    machines: MachineType[],
    setMachine(id: number, newMachine: MachineType): void
}

const ListOfMachines: React.FC<Props> = (props) => {
    const { machines } = props

    return (
        <ul className={styles.listOfMachines}>        
            {machines.map((machine, index) => 
                <li key={machine.id} className={styles.machineLi}>
                    <MachineBoard machine={machine} setMachine={(newMachine: MachineType) => props.setMachine(index, newMachine)}/>
                </li>
            )}
        </ul>
    )
}

export default ListOfMachines