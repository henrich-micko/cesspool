import React from "react"

// types
import { MachineAdminType, UserType } from "@types"
import MachineAdminBoard from "./MachineAdminBoard"

// styles
import styles from "@styles/components/admin/machine/listOfAdminMachine.module.scss"


interface Props {
    machines: MachineAdminType[],
    users: UserType[],
    setMachine(id: number, newMachine: MachineAdminType): void
}

const ListOfAdminMachines: React.FC<Props> = (props) => {
    const { machines } = props

    return (
        <ul className={styles.listOfAdminMachines}>        
            {machines.map((machine, index) => 
                <li key={machine.id} className={styles.adminMachineLi}>
                    <MachineAdminBoard machine={machine} setMachine={(newMachine: MachineAdminType) => props.setMachine(index, newMachine)} users={props.users}/>
                </li>
            )}
        </ul>
    )
}

export default ListOfAdminMachines