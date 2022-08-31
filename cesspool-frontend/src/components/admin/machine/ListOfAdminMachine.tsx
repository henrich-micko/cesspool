import React from "react"

// types
import { MachineAdminType } from "@types"
import MachineAdminBoard from "./MachineAdminBoard"

// styles
import styles from "@styles/components/admin/machine/listOfAdminMachine.module.scss"


interface Props {
    machines: MachineAdminType[],
    refresh(id: number): void
}

const ListOfAdminMachines: React.FC<Props> = (props) => {
    const { machines } = props

    return (
        <ul className={styles.listOfAdminMachines}>        
            {machines.map((machine, index) => 
                <li key={machine.id} className={styles.adminMachineLi}>
                    <MachineAdminBoard machine={machine} refresh={() => props.refresh(index)}/>
                </li>
            )}
        </ul>
    )
}

export default ListOfAdminMachines