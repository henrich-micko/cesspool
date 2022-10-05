import React, { useContext, useEffect, useState } from "react"

// types && styles && icons
import { MachineAdminType, UserType } from "@types"
import styles from "@styles/components/account/accountBoardAdmin.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSliders } from "@fortawesome/free-solid-svg-icons"

// components
import PopUp from "@components/PopUp"
import ThemedBox from "@components/ThemedBox"
import AccountStatusAdmin from "./AccountStatusAdmin"
import TableOfMachine from "@components/machine/TableOfMachine"
import useAxios from "@hooks/useAxios"
import AccountSettingsAdmin from "./AccountSettingsAdmin"
import AccountInfo from "./AccountInfo"
import AuthContext from "@context/AuthContext"

interface Props {
    user: UserType
    setUser(newUser: UserType): void
}

const AccountBoardAdmin: React.FC<Props> = (props) => {
    const [settings, setSettings] = useState<boolean>(false)
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)

    const loggedUser = useContext(AuthContext).user

    const axios = useAxios()

    useEffect(() => {
        axios.get("/admin/machine/user/" + props.user.pk)
             .then(res => setMachines(res.data))
             .catch(error => console.log(error))
    }, [props.user])

    const handleSettingsSubmit = (newUser: UserType) => {
        props.setUser(newUser)
        setSettings(false)
    }

    return (
        <ThemedBox 
            className={styles.machineBoard} 
            label={
                <div>
                    <h2 className={styles.user}>
                        {props.user.email} {props.user.email === loggedUser.email && " - ja"}
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