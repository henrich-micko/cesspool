import React from "react"
import { UserType } from "@types"
import styles from "@styles/components/account/menuOfAccountAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh, faUserAstronaut, faUserAlt, faTrash } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import TheLoading from "@components/TheLoading"


interface AccountItemProps {
    index: number
    account: UserType
    onClick(id: number): void
    isActive: boolean
}

const AccountItem: React.FC<AccountItemProps> = (props) => {
    const formatEmail = (email: string) => {
        return email.length > 14 ? email.split("@").at(0) : email
    }
    
    return (
        <li key={props.index} onClick={() => props.onClick(props.index)} className={props.isActive ? styles.activate : undefined}>
            <h3>{formatEmail(props.account.email)}</h3>
            
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
    onMachineClick(id: number): void
    activate?: number
    onRefreshClick(): void
    onAddClick(): void
}

const MenuOfAccountAdmin: React.FC<Props> = (props) => {
    return (
        <div className={styles.menuOfAdminMachine}>
            <div className={styles.header}>
                <h2>Použivatelia</h2>

                <div>
                    <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={props.onAddClick}
                        className={styles.icon}
                    />

                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefreshClick}
                        className={styles.icon}
                    />
                </div>
            </div>

            <ul>                
                {props.users !== null && props.users.map((account, index) =>
                    <AccountItem 
                        isActive={props.activate === index}
                        index={index} 
                        account={account} 
                        onClick={props.onMachineClick} 
                    />
                )}
            </ul>

            {
                props.users === null &&
                <TheLoading />
            }

        </div>
    )
}

export default MenuOfAccountAdmin