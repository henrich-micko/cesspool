import React from "react"

import ThemedBox from "@components/ThemedBox"
import { MachineAdminType, UserType } from "@types"

import styles from "@styles/components/machine/machineDeleteBoard.module.scss"
import AccountDelete from "./AccountDelete"
import AccountAdminDeleteMachines from "./AccountDeleteMachines"

interface Props {
    user: UserType
    setUser(newUser: UserType): void
}

const AccountDeleteBoard: React.FC<Props> = (props) => {
    return (
        <ThemedBox label="Odstraniť" className={styles.deleteBoard}>
            <AccountDelete account={props.user} setAccount={props.setUser} />
            <AccountAdminDeleteMachines account={props.user} setAccount={props.setUser} />
        </ThemedBox>
    )
}

export default AccountDeleteBoard