import React from "react"
import { UserType } from "@types"

import styles from "@styles/components/account/accountStatusAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUnlock, faUserAlt, faUserAstronaut } from "@fortawesome/free-solid-svg-icons"

interface Props {
    user: UserType
}

const AccountStatusAdmin: React.FC<Props> = (props) => {
    return (
        <div className={styles.accountStatusWrapper}>
            <div className={styles.accountStatus}>
                <FontAwesomeIcon icon={props.user.is_superuser ? faUserAstronaut : faUserAlt} />
                <h3>{props.user.is_superuser ? "Admin" : "Použivatel"}</h3>
            </div>

            <div className={styles.accountStatus}>
                <FontAwesomeIcon icon={props.user.is_active ? faUnlock : faLock} />
                <h3>{props.user.is_active ? "aktivovaný" : "v kóme"}</h3>
            </div>
        </div>
    )
}

export default AccountStatusAdmin