import SwitchInput from "@components/form/SwitchInput"
import TheInput from "@components/form/TheInput"
import useAxios from "@hooks/useAxios"
import { UserType } from "@types"
import React, { useState } from "react"

import styles from "@styles/components/machine/machineSettings.module.scss"
import TheForm from "@components/form/TheForm"


interface Props {
    onCreate(newUser: UserType): void
}

const AccountCreateAdmin: React.FC<Props> = (props) => {
    const [email, setEmail] = useState<string>("")
    const [isSuperUser, setIsSuperUser] = useState<boolean>(false)

    const [error, setError] = useState<string>("")

    const axios = useAxios()

    const handleSubmit = () => {
        const data = {
            email: email,
            is_staff: isSuperUser
        }

        axios.post("/admin/account/create/", data)
             .then(res => props.onCreate(res.data))
             .catch(error => setError("Nepodaril sa vytvoriť"))
        }

    return (
        <TheForm error={error} onClick={handleSubmit}>
            <>
                <TheInput
                    label="Email"
                    behavior="static"
                    value={email}
                    onChange={setEmail}
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

export default AccountCreateAdmin