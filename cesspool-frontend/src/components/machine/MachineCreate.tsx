import SelectInput from "@components/form/SeletectInput"
import SwitchInput from "@components/form/SwitchInput"
import TheButton from "@components/form/TheButton"
import TheError from "@components/form/TheError"
import TheInput from "@components/form/TheInput"
import ThemedBox from "@components/ThemedBox"
import useAxios from "@hooks/useAxios"
import { MachineAdminType, UserType } from "@types"
import React, { useEffect, useState } from "react"
import styles from "@styles/components/machine/machineCreate.module.scss"

interface Props {
    onCreate(newMachine: MachineAdminType): void
}

const MachineCreate: React.FC<Props> = (props) => {
    const [error, setError] = useState<string|null>(null)
    const [users, setUsers] = useState<UserType[]>([])

    const [code, setCode] = useState<string>("")
    const [user, setUser] = useState<string>("")
    const [mqtt, setMqtt] = useState<boolean>(true)
    const [notification, setNotification] = useState<boolean>(true)
    
    const axios = useAxios()

    useEffect(() => {
        axios.get("/admin/machine/get-code/")
             .then(res => setCode(res.data.code))
             .catch(error => console.log(error))

        axios.get("/admin/account/")
             .then(res => setUsers(res.data))
             .catch(error => console.log(error))
    }, [])

    const handleSubmit = () => {
        const data = {
            code: code,
            user: user !== "" ? user : null,
            mqtt: mqtt,
            notification: notification,
        }

        axios.post("/admin/machine/create/", data)
             .then(res => props.onCreate(res.data))
             .catch(error => setError("Nepodarilo sa vytvoriť"))
    }

    return (
        <div className={styles.machineCreate}>
            <div className={styles.formWrapper}>
                <TheInput
                    label="Code"
                    behavior="static"
                    value={code}
                    onChange={setCode}
                />

                <SelectInput 
                    onSubmit={setUser}
                    label="User"
                    options={[["", "Nepridelený"], ...users.map(user => [user.email, user.email])]}
                    selected={user}
                />

                <SwitchInput
                    label="Mqtt"
                    value={mqtt}
                    onSubmit={setMqtt}
                />

                <SwitchInput
                    label="Notifikacie"
                    value={notification}
                    onSubmit={setNotification}
                />
            </div>

            <div className={styles.buttonWrapper}>
                <span className={styles.error}>{error}</span>

                <TheButton
                    label="Potvrdiť"
                    onClick={handleSubmit}
                    type="blue"
                />
            </div>
        </div>
    ) 
}

export default MachineCreate