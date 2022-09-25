import React, {useEffect, useState } from "react"

// styles
import styles from "@styles/components/machine/machineSettings.module.scss"

// types && hooks
import { MachineAdminType, UserType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import SwithInput from "@components/form/SwitchInput"
import SelectInput from "@components/form/SeletectInput"
import TheInput from "@components/form/TheInput"

interface Props {
    machine: MachineAdminType;
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>()
    const [users, setUsers] = useState<UserType[]>([])

    const axios = useAxios()

    const confMachine = (data: {code?: string; user?: string|null; mqtt?: boolean, notification?: boolean, autocorrect?: boolean}) => {
        axios.put("/admin/machine/" + props.machine.code + "/", data)
             .then(res => { setError(""); props.setMachine(res.data) })
             .catch(error => setError("Nepodarilo sa nastaviť"))
    }

    useEffect(() => {
        axios.get("/admin/account/")
             .then(res => setUsers(res.data))
             .catch(error => console.log(error))
    }, [])

    return (
        <div className={styles.machineSettings}>
            <TheInput
                onChange={(value) => confMachine({code: value})}
                label="Code"
                value={props.machine.code !== null ? props.machine.code : undefined}
                behavior="auto"
                maxLenght={10}
            />

            <SelectInput 
                onSubmit={(value) => confMachine({user: value === "" ? null : value})}
                label="User"
                options={[["", "Nepridelený"], ...users.map(user => [user.email, user.email])]}
                selected={props.machine.user}
            />

            <SwithInput
                onSubmit={(value) => confMachine({mqtt: value})}
                label="Mqtt"
                value={props.machine.mqtt}
            />

            <SwithInput
                onSubmit={(value) => confMachine({notification: value})}
                label="Notifikacie"
                value={props.machine.notification}
            />

            <SwithInput
                onSubmit={(value) => confMachine({autocorrect: value})}
                label="Autocorrect"
                value={props.machine.autocorrect}
            />

            {error !== "" && <span className={styles.error}>{error}</span>}

        </div>
    )
}

export default MachineAdminSettings