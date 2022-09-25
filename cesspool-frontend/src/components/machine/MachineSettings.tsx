import React, { useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineSettings.module.scss"

// types && hooks
import { MachineType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import TheInput from "@components/form/TheInput"

interface Props {
    machine: MachineType;
    setMachine(newMachine: MachineType): void
}

const MachineSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")

    const axios = useAxios()
    
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
        <div className={styles.machineSettings} id={styles.machineSettings}>
            <TheInput
                type="text"
                onChange={handleTitle}
                label="Názov"
                value={props.machine.title !== null ? props.machine.title : ""}
                maxLenght={14}
            />

            <TheInput
                type="number"
                onChange={handleHightLevel}
                label="Upozorniť&nbsp;pri&nbsp;%"
                value={props.machine.hight_level}
            />

            {error !== "" && <span className={styles.error}>{error}</span>}
        </div>
    )
}

export default MachineSettings