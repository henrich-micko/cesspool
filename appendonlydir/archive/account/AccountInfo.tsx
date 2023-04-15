import React from "react"
import styles from "@styles/components/account/accountInfo.module.scss"
import { ContextUserType, UserType } from "@types"

interface ItemProps {
    label: string
    children: React.ReactNode
}

const Item: React.FC<ItemProps> = (props) => {
    return (
        <li>
            <h3>{props.label}</h3>{props.children}
        </li>
    )
}

interface Props {
    account: UserType|ContextUserType
}

const AccountInfo: React.FC<Props> = (props) => {
    const formatDate = (date: string) => {
        const datetime = date.split("T").at(0)
        if (datetime === undefined) return

        const year = datetime.split("-").at(0)
        const month = datetime.split("-").at(1)
        const day = datetime.split("-").at(2)

        return year + " " + day + "." + month + "."
    }

    const formatTime = (date: string) => {
        return date.split("T").at(1)?.split(".").at(0)
    }

    return (
        <ul className={styles.list}>
            <Item label="Rola účtu">
                <span>{props.account.is_staff ? "Admin" : "Puživatel"}</span>
            </Item>

            {
                (props.account.date_joined !== null && props.account.date_joined !== undefined) && 
                <Item label="Dátum vytvorenia">
                    <span>{formatDate(props.account.date_joined)} {formatTime(props.account.date_joined)}</span>
                </Item>
            }

            <Item label="Je aktivovaný">
                <span>{props.account.is_active ? "Ano" : "Nie"}</span>
            </Item>
        </ul>
    )
}

export default AccountInfo