import React from "react"
import { UserType } from "@types"
import styles from "@styles/components/account/menuOfAccountAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh, faUserAstronaut, faUserAlt, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons"


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
                    className={styles.icon}
                    icon={props.account.is_superuser ? faUserAstronaut : faUserAlt}
                />

                <FontAwesomeIcon
                    className={styles.icon}
                    icon={faTrash}
                />
            </div>
        </li>
    )
}

interface NewAccountItemProps {
    onClick(): void
    index: number
    isActive: boolean
}

const NewAccountItem: React.FC<NewAccountItemProps> = (props) => {
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
    users: UserType[]|null
    onClick(id: number): void
    activate?: number
    onRefresh(): void
}

const MenuOfAccountAdmin: React.FC<Props> = (props) => {
    return (
        <div className={styles.menuOfAdminMachine}>
            <div className={styles.header}>
                <h2>Všetci kontá</h2>

                <div>
                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={props.onRefresh}
                        className={styles.icon}
                    />
                </div>
            </div>

            <ul>
                <NewAccountItem onClick={() => props.onClick(-1)} index={-1} isActive={props.activate === -1}/>
                
                {props.users !== null && props.users.map((account, index) =>
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