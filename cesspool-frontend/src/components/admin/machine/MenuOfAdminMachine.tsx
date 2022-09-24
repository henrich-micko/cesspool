import React from "react"
import { MachineAdminType } from "@types"
import styles from "@styles/components/admin/machine/menuOfAdminMachine.module.scss"
import ThemedBox from "@components/ThemedBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh, faTrash, faUserAltSlash } from "@fortawesome/free-solid-svg-icons"
import { MachineCode, MachineUser } from "./MachineInfo"
import classNames from "classnames"


interface MenuOfMachineLiProps {
    index: number
    machine: MachineAdminType
    onClick(id: number): void
    isActive: boolean
}

const MenuOfMachineLi: React.FC<MenuOfMachineLiProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <MachineCode code={props.machine.code} />
            
            <div className={styles.userTrashWrapper}>
                <FontAwesomeIcon 
                    icon={faUserAltSlash}
                />
                <FontAwesomeIcon 
                    className={classNames(styles.icon, props.machine.delete_records_date !== null || props.machine.delete_date !== null ? styles.red : undefined)}
                    icon={faTrash}
                />
            </div>
        </li>
    )
}

interface MenuOfAdminMachineNewLi {
    onClick(): void
    index: number
    isActive: boolean
}

const MenuOfMachineNewLi: React.FC<MenuOfAdminMachineNewLi> = (props) => {
    return (
        <li key={props.index} onClick={props.onClick} className={props.isActive ? styles.activate : undefined}>
            <span style={{"fontSize": "1.2em"}}>Pridať</span>
            <FontAwesomeIcon
                icon={faPlusCircle}
            />
        </li>
    )
}

interface Props {
    machines: MachineAdminType[]
    onClick(id: number): void
    activate?: number
    onRefresh(): void
}

const MenuOfAdminMachines: React.FC<Props> = (props) => {

    return (
        <ThemedBox label="Zariadenia" className={styles.menuOfMachine} style={{}}>
            <div className={styles.refreshWrapper}>
                <div>
                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefresh}
                    />
                </div>
            </div>

            <ul>
                <MenuOfMachineNewLi onClick={() => props.onClick(-1)} index={-1} isActive={props.activate === -1}/>
                {props.machines.map((machine, index) =>
                    <MenuOfMachineLi 
                        isActive={props.activate === index}
                        index={index} 
                        machine={machine} 
                        onClick={props.onClick} 
                />
                )}
            </ul>
        </ThemedBox>
    )
}

export default MenuOfAdminMachines