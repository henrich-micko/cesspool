import React, { useContext, useState } from "react"

// types && styles && icons
import { UserType } from "@types"
import styles from "@styles/components/account/accountBoardAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"

// components
import PopUp from "@components/PopUp"
import ThemedBox from "@components/ThemedBox"
import AccountSettingsAdmin from "./AccountSettingsAdmin"
import AccountInfo from "./AccountInfo"
import AuthContext from "@context/AuthContext"
import { useMediaQuery } from "react-responsive"
import { useMaxWidth } from "@hooks/useIsMobile"

interface Props {
    user: UserType
    setUser(newUser: UserType): void
}

const AccountBoardAdmin: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)

    const loggedUser = useContext(AuthContext).user

    const handleSettingsSubmit = (newUser: UserType) => {
        props.setUser(newUser)
        setSettings(false)
    }

    const viewFullEmail = useMaxWidth("500px")

    return (
        <ThemedBox 
            className={styles.machineBoard} 
            label={
                <div>
                    <h2 className={styles.user}>
                        {viewFullEmail ? props.user.email.split("@").at(0) : props.user.email} {props.user.email === loggedUser.email && " - ja"}
                    </h2>
                </div>
            }
            header={
                <div className={styles.settingsWrapper}>
                    <FontAwesomeIcon
                        icon={faSliders}
                        onClick={() => setSettings(true)}
                    />
                </div>
            }> 
                <div className={styles.machineBoardBody}>
                    <AccountInfo account={props.user} />
                </div> 
            {
                settings && 
                <PopUp label={"Nastavenia"} onClickClose={() => setSettings(false)}>
                    <AccountSettingsAdmin account={props.user} setAccount={handleSettingsSubmit} />
                </PopUp>
            }
        </ThemedBox>
    )
}

export default AccountBoardAdmin