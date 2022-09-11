import React, { useEffect, useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineView.module.scss"
import classNames from "classnames"

// types
import { MachineType } from "../../../types"

import useAxios from "../../../hooks/useAxios"
import TextInput from "../../form/TextInput"
import NumberInput from "@components/form/NumberInput"

interface Props {
    machine: MachineType;
    setMachine(newMachine: MachineType): void
}

const SettingsView: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")

    const axios = useAxios()

    useEffect(() => {

    }, [props.machine.title, props.machine.hight_level])
    
    // input elements
	const handleTitle = (value: string) => {
        const title = value.trim()

        axios.put("machine/" + props.machine.code + "/conf/", {title: title !== "" ? title : null})
            .then((res) => { props.setMachine(res.data); setError("") })
            .catch(error => setError("Nepodarilo sa nastaviť"))
	}

    const handleHightLevel = (value: string) => {
        const hightLevel = Number(value.trim())

        if (hightLevel === 0) {
            setError("Nepodarilo sa nastaviť")
            return
        }
        
        axios.put("machine/" + props.machine.code + "/conf/", {hight_level: hightLevel})
            .then((res) => { props.setMachine(res.data); setError("") })
            .catch(error => setError("Nepodarilo sa nastaviť"))
	}


    return (
        <div className={classNames(styles.machineView, styles.settings)}>
            <form onSubmit={event => {event.preventDefault()}}>
                <TextInput
                    onSubmit={handleTitle}
                    label="Názov"
                />

                <NumberInput
                    onSubmit={handleHightLevel}
                    label="Upozorniť&nbsp;pri&nbsp;%"
                />

                {error !== "" && <span className={styles.error}>{error}</span>}
            </form>
        </div>
    )
}

export default SettingsView