import React, { ChangeEvent, useEffect, useState } from "react"

// styles && icons
import styles from "../styles.module.scss"
import classNames from "classnames"

// types
import { MachineType } from "../../../types"

import { debounce } from "lodash-es"
import useAxios from "../../../hooks/useAxios"
import TextInput from "../../form/TextInput"

interface Props {
    machine: MachineType;
    refresh: () => void
}

const SettingsView: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")
    
    const axios = useAxios()
    
    // input elements
	const handleTitle = (value: string) => {
        const title = value.trim()

        axios.post("machine/" + props.machine.code + "/conf/", {title: title !== "" ? title : null})
            .then(() => props.refresh())
            .catch(error => console.log(error))

	}

    return (
        <div className={classNames(styles.machineView, styles.settings)}>
            <form>
                <TextInput 
                    onSubmit={handleTitle}
                    label="Názov"
                    value={props.machine.title !== null ? props.machine.title : undefined}
                />
                {error !== "" && <span>Neplatné udaje</span>}
            </form>
        </div>
    )
}

export default SettingsView