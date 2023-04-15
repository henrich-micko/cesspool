import { UserType } from "@types"
import React, { useState } from "react"

import styles from "@styles/components/account/accountSettingsAdmin.module.scss"
import TheInput from "@components/form/TheInput"
import SwitchInput from "@components/form/SwitchInput"
import TheButton from "@components/form/TheButton"
import useAxios from "@hooks/useAxios"
import TheForm from "@components/form/TheForm"

interface Props {
    account: UserType
    setAccount(newUser: UserType): void
}

const AccountSettingsAdmin: React.FC<Props> = (props) =>{
    const [error, setError] = useState<string>("")

    const [email, setEmail] = useState<string>(props.account.email)
    const [isActivate, setIsActivate] = useState<boolean>(props.account.is_active)
    const [isSuperUser, setIsSuperUser] = useState<boolean>(props.account.is_staff)

    const axios = useAxios()

    const saveAccount = () => {
        const data = {email: email, is_active: isActivate, is_staff: isSuperUser}
        console.log(data)
        axios.put("/admin/account/" + props.account.pk + "/", data)
             .then(res => props.setAccount(res.data))
             .catch(error => setError("Nepodarilo sa potvrdiť"))
    }

    return (
        <TheForm error={error} onClick={saveAccount}>
            <>
                <TheInput
                    onChange={setEmail}
                    label="Email"
                    value={email}
                    behavior="static"
                    maxLenght={25}
                />

                <SwitchInput
                    onSubmit={setIsActivate}
                    label="Aktivácia"
                    value={isActivate}
                />

                <SwitchInput
                    onSubmit={setIsSuperUser}
                    label="Admin"
                    value={isSuperUser}
                />
            </>
        </TheForm>
    )
}

export default AccountSettingsAdmin
