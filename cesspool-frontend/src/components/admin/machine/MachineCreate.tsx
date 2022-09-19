import SelectInput from "@components/form/SeletectInput"
import SwitchInput from "@components/form/SwitchInput"
import TheButton from "@components/form/TheButton"
import TheError from "@components/form/TheError"
import TheInput from "@components/form/TheInput"
import TheBoard from "@components/TheBoard"
import useAxios from "@hooks/useAxios"
import { MachineAdminType, UserType } from "@types"
import React, { useEffect, useState } from "react"

interface Props {
    onCreate(newMachine: MachineAdminType): void
    users: UserType[]
}

const MachineCreate: React.FC<Props> = (props) => {
    const [error, setError] = useState<string|null>(null)

    const [code, setCode] = useState<string>("")
    const [user, setUser] = useState<string>("")
    const [mqtt, setMqtt] = useState<boolean>(true)
    const [notification, setNotification] = useState<boolean>(true)
    const [autocorrect, setAutoCorrect] = useState<boolean>(true)
    
    const axios = useAxios()

    useEffect(() => {
        axios.get("/admin/machine/get-code/")
             .then(res => setCode(res.data.code))
             .catch(error => console.log(error))
    }, [])

    const handleSubmit = () => {
        const data = {
            code: code,
            user: user !== "" ? user : null,
            mqtt: mqtt,
            notification: notification,
            autocorrect: autocorrect
        }

        axios.post("/admin/machine/create/", data)
             .then(res => props.onCreate(res.data))
             .catch(error => setError("Nepodarilo sa nastaviť"))
    }

    return (
        <TheBoard label="Vytvoriť zariadenie">
            <div style={{"width": "20em", "padding": "1em", "display": "flex", "flexDirection": "column"}}>
                <TheInput
                    label="Code"
                    behavior="static"
                    value={code}
                    onChange={setCode}
                />

                <SelectInput 
                    onSubmit={setUser}
                    label="User"
                    options={[["", "Nepridelený"], ...props.users.map(user => [user.email, user.email])]}
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

                <SwitchInput
                    label="Autocorrect"
                    value={autocorrect}
                    onSubmit={setAutoCorrect}
                />

                {error !== null && <TheError label={error} />}

                <TheButton 
                    type="blue" 
                    onClick={handleSubmit} 
                    label="Vytvoriť" 
                />
            </div>
        </TheBoard>
    ) 
}

export default MachineCreate