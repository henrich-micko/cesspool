import React from "react"

import { MachineAdminType } from "@types"
import styles from "@styles/components/machine/tableOfMachine.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCab, faCheckCircle, faCircleXmark } from "@fortawesome/free-solid-svg-icons"

interface ValueIconProps {
    value: boolean
}

const ValueIcon: React.FC<ValueIconProps> = (props) => {
    const icon = props.value ? faCheckCircle : faCircleXmark
    const color = props.value ? "#61dafb" : "rgb(255, 78, 78)" 
    
    return (
        <FontAwesomeIcon icon={icon} style={{color: color}} />
    )
} 

interface Props {
    machines: MachineAdminType[]|null
}

const TableOfMachine: React.FC<Props> = (props) => {
    return (
        <table className={styles.tableOfMachine}>
        <tr>
          <th>Code</th>
          <th>Ukladanie</th>
          <th>Notifikacie</th>
          <th>Autocorrect</th>
        </tr>

        {   
            props.machines !== null && props.machines.map((item) => 
                <tr>
                    <td>{item.code}</td>
                    <td><ValueIcon value={item.mqtt} /></td>
                    <td><ValueIcon value={item.notification} /></td>
                    <td><ValueIcon value={item.autocorrect} /></td>
                </tr>
        )}
      </table> 
    )
}

export default TableOfMachine