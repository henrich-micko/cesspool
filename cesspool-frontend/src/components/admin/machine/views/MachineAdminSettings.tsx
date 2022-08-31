import React, { useState } from "react"

// styles
import styles from "@styles/components/admin/machine/machineAdminView.module.scss"
import classNames from "classnames"

// types && hooks
import { MachineAdminType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import TextInput from "@components/form/TextInput"
import NumberInput from "@components/form/NumberInput"
import SwithInput from "@components/form/SwitchInput"

interface Props {
    machine: MachineAdminType;
    refresh: () => void
}


const MachineAdminSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")
    
    return (
        <div className={classNames(styles.machineView, styles.settings)}>
            <form>
                <NumberInput 
                    onSubmit={() => {}}
                    label="Code"
                    value={props.machine.code !== null ? props.machine.code : undefined}
                />

                <TextInput 
                    onSubmit={() => {}}
                    label="User"
                    value={props.machine.user !== null ? props.machine.user : undefined}
                />

                <SwithInput
                    onSubmit={() => {}}
                    label="Mqtt"
                    value={false}
                />

                <SwithInput
                    onSubmit={() => {}}
                    label="Notifikacie"
                    value={false}
                />

                <SwithInput
                    onSubmit={() => {}}
                    label="Autocorect"
                    value={false}
                />

                {error !== "" && <span>Neplatné udaje</span>}
            </form>
        </div>
    )
}

export default MachineAdminSettings