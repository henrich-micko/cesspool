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
import TheButton from "@components/form/TheButton"
import TheForm from "@components/form/TheForm"

interface Props {
    machine: MachineAdminType;
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>()
    const [users, setUsers] = useState<UserType[]>([])

    const [code, setCode] = useState<string>(props.machine.code)
    const [user, setUser] = useState<string|null>(props.machine.user)
    const [mqtt, setMqtt] = useState<boolean>(props.machine.mqtt)
    const [notification, setNotification] = useState<boolean>(props.machine.notification)

    const axios = useAxios()

    const saveMachine = () => {
        const data = {
            code: code,
            user: user,
            mqtt: mqtt,
            notification: notification,
        }

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
        <TheForm error={error} onClick={saveMachine}>
            <>
                <TheInput
                    onChange={setCode}
                    label="Code"
                    value={code !== null ? code : undefined}
                    behavior="static"
                    maxLenght={10}
                />

                <SelectInput 
                    onSubmit={(value) => setUser(value === "" ? null : value)}
                    label="Vlastník"
                    options={[["", "Nepridelený"], ...users.map(user => [user.email, user.email])]}
                    selected={user}
                />

                <SwithInput
                    onSubmit={setMqtt}
                    label="Ukladanie&nbsp;záznamov"
                    value={mqtt}
                />

                <SwithInput
                    onSubmit={setNotification}
                    label="Notifikacie"
                    value={notification}
                />
            </>
        </TheForm>
    )
}

export default MachineAdminSettings