import React, {useState } from "react"

// styles
import styles from "@styles/components/admin/machine/machineAdminView.module.scss"
import classNames from "classnames"

// types && hooks
import { MachineAdminType, UserType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import SwithInput from "@components/form/SwitchInput"
import SelectInput from "@components/form/SeletectInput"
import TheInput from "@components/form/TheInput"

interface Props {
    machine: MachineAdminType;
    users: UserType[];
    setMachine(newMachine: MachineAdminType): void
}


const MachineAdminSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>()

    const axios = useAxios()

    const confMachine = (data: {code?: string; user?: string|null; mqtt?: boolean, notification?: boolean, autocorrect?: boolean}) => {
        setError("")
        
        axios.put("/admin/machine/" + props.machine.code + "/", data)
             .then(res => props.setMachine(res.data))
             .catch(error => setError("Neplatný typ udaja"))
    }

    return (
        <div className={classNames(styles.machineView, styles.settings)}>
            <div>
                {error !== "" && <span className={styles.error}>{error}</span>}

                <TheInput 
                    onChange={(value) => confMachine({code: value})}
                    label="Code"
                    value={props.machine.code !== null ? props.machine.code : undefined}
                />

                <SelectInput 
                    onSubmit={(value) => confMachine({user: value === "" ? null : value})}
                    label="User"
                    options={[["", "Nepridelený"], ...props.users.map(user => [user.email, user.email])]}
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
            </div>
        </div>
    )
}

export default MachineAdminSettings