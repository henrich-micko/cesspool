import React, { useContext } from "react"
import { UserType } from "@types"
import styles from "@styles/components/account/menuOfAccountAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh, faUserAstronaut, faUserAlt, faTrash } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import AuthContext from "@context/AuthContext"


interface AccountItemProps {
    index: number
    account: UserType
    onClick(id: number): void
    isActive: boolean
}

const AccountItem: React.FC<AccountItemProps> = (props) => {
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3>{props.account.email}</h3>
            
            <div className={styles.userTrashWrapper}>
                <FontAwesomeIcon 
                    className={classNames(styles.icon, !props.account.is_active && styles.red)}
                    icon={props.account.is_staff ? faUserAstronaut : faUserAlt}
                />

                <FontAwesomeIcon
                    className={classNames(styles.icon, (props.account.delete_date !== null || props.account.delete_machines_date !== null) && styles.red)}
                    icon={faTrash}
                />
            </div>
        </li>
    )
}

interface Props {
    users: UserType[]|null
    onClick(id: number): void
    activate?: number
    onRefresh(): void
    onAdd(): void
}

const MenuOfAccountAdmin: React.FC<Props> = (props) => {
    const { user } = useContext(AuthContext)

    return (
        <div className={styles.menuOfAdminMachine}>
            <div className={styles.header}>
                <h2>Všetci kontá</h2>

                <div>
                    <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={props.onAdd}
                        className={styles.icon}
                    />

                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefresh}
                        className={styles.icon}
                    />
                </div>
            </div>

            <ul>                
                {props.users !== null && props.users.map((account, index) => account.email !== user.email &&
                    <AccountItem 
                        isActive={props.activate === index}
                        index={index} 
                        account={account} 
                        onClick={props.onClick} 
                    />
                )}
            </ul>
        </div>
    )
}

export default MenuOfAccountAdmin