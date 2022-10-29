import React, { useEffect, useState } from "react"
import { MachineForAdminMenu, UserType } from "@types"
import styles from "@styles/components/machine/menuOfMachineAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter, faFilterCircleXmark, faPlusCircle, faRefresh, faTrash, faUserAlt, faUserAltSlash } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import useAxios from "@hooks/useAxios"
import SelectInput from "@components/form/SeletectInput"
import TheLoading from "@components/TheLoading"


interface AdminMachineItemProps {
    index: number
    code: string
    title: string|null
    isActive: boolean
    viewTitle: boolean
    delete: boolean
    user: string|null
    onClick(index: number): void
}

const AdminMachineItem: React.FC<AdminMachineItemProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3>{props.code}{(props.viewTitle && props.title !== null) && " / " + props.title}</h3>
            
            <div className={styles.userTrashWrapper}>
                <FontAwesomeIcon 
                    className={styles.icon}
                    icon={props.user !== null ? faUserAltSlash : faUserAlt}
                />
                <FontAwesomeIcon 
                    className={classNames(styles.icon, props.delete && styles.red)}
                    icon={faTrash}
                />
            </div>
        </li>
    )
}


interface Props {
    machines: MachineForAdminMenu[]|null
    onMachineClick(index: number): void
    activate?: number
    onRefreshClick(): void
    onAddClick(): void
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
                <h2>Zariadenia</h2>

                <div>
                    <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={props.onAddClick}
                        className={styles.icon}
                    />

                    <FontAwesomeIcon
                        icon={filter === null ? faFilter : faFilterCircleXmark}
                        onClick={handleFilter}
                        className={styles.icon}
                    />

                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefreshClick}
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
                {props.machines !== null && props.machines.map((machine, index) =>
                    (filter === null || filter === machine.user || (filter === "" && machine.user === null)) && 
                    <AdminMachineItem 
                        isActive={props.activate === index}
                        index={index} 
                        onClick={props.onMachineClick}
                        title={machine.title}
                        user={machine.user}
                        code={machine.code}
                        viewTitle={filter !== null}
                        delete={machine.delete}
                    />
                )}
            </ul>

            {
                props.machines === null && <TheLoading />
            }
        </div>
    )
}

export default MenuOfMachineAdmin