import React, { useEffect, useState } from "react"
import { MachineAdminType, UserType } from "@types"
import styles from "@styles/components/machine/menuOfMachineAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter, faFilterCircleXmark, faPlusCircle, faRefresh, faTrash, faUserAlt, faUserAltSlash } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import useAxios from "@hooks/useAxios"
import SelectInput from "@components/form/SeletectInput"


interface MenuOfMachineLiProps {
    index: number
    machine: MachineAdminType
    onClick(id: number): void
    isActive: boolean
    viewTitle: boolean
}

const MenuOfMachineLi: React.FC<MenuOfMachineLiProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3>{props.machine.code}{(props.viewTitle && props.machine.title !== null) && " / " + props.machine.title}</h3>
            
            <div className={styles.userTrashWrapper}>
                <FontAwesomeIcon 
                    className={styles.icon}
                    icon={props.machine.user === null ? faUserAltSlash : faUserAlt}
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
    machines: MachineAdminType[]|null
    onClick(id: number): void
    activate?: number
    onRefresh(): void
}

const MenuOfMachineAdmin: React.FC<Props> = (props) => {
    const [filter, setFilter] = useState<string|null>(null)
    const [users, setUsers] = useState<UserType[]>([])

    const axios = useAxios()

    useEffect(() => {
        axios.get("/admin/account/")
             .then(res => setUsers(res.data))
             .catch(error => console.log(error))
    }, [])

    const handleFilter = () => {
        if (filter === null && users.length !== 0) {
            const user = users.at(1)?.email
            user !== undefined && setFilter(user)
        } else {
            setFilter(null)
        }
    }

    return (
        <div className={styles.menuOfAdminMachine}>
            <div className={styles.header}>
                <h2>Všetky zariadenia</h2>

                <div>
                    <FontAwesomeIcon
                        icon={filter === null ? faFilter : faFilterCircleXmark}
                        onClick={handleFilter}
                        className={styles.icon}
                    />

                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefresh}
                        className={styles.icon}
                    />
                </div>
            </div>

            {
                filter !== null &&
                <div className={styles.filter}>
                    <div>
                        <SelectInput 
                            onSubmit={(value) => setFilter(value)}
                            options={[["", "Nepridelený"], ...users.map(user => [user.email, user.email])]}
                            selected={filter}
                        />
                    </div>
                </div>
            }

            <ul>
                {filter === null && <MenuOfMachineNewLi onClick={() => props.onClick(-1)} index={-1} isActive={props.activate === -1}/>}
                {props.machines !== null && props.machines.map((machine, index) =>
                    (filter === null || filter === machine.user || (filter === "" && machine.user === null)) && 
                    <MenuOfMachineLi 
                        isActive={props.activate === index}
                        index={index} 
                        machine={machine} 
                        onClick={props.onClick}
                        viewTitle={filter !== null}
                    />
                )}
            </ul>
        </div>
    )
}

export default MenuOfMachineAdmin