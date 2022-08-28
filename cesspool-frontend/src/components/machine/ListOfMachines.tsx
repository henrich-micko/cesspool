import React from "react"

// types
import { MachineType } from "../../types"

import MachinePanel from "./MachineBoard"

import styles from "./styles.module.scss"

interface Props {
    machines: MachineType[],
    refresh(id: number): void
}

const ListOfMachines: React.FC<Props> = (props) => {
    const { machines } = props

    return (
        <ul className={styles.listOfMachines}>        
            {machines.map((machine, index) => 
                <li key={machine.id} className={styles.machineLi}>
                    <MachinePanel machine={machine} refresh={() => props.refresh(index)}/>
                </li>
            )}
        </ul>
    )
}

export default ListOfMachines