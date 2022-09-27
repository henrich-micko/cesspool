import React, { useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineSettings.module.scss"

// types && hooks
import { MachineType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import TheInput from "@components/form/TheInput"
import TheButton from "@components/form/TheButton"

interface Props {
    machine: MachineType;
    setMachine(newMachine: MachineType): void
}

const MachineSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")

    const [title, setTitle] = useState<string>(props.machine.title !== null ? props.machine.title : "")
    const [hightLevel, setHightLevel] = useState<String>(String(props.machine.hight_level))

    const axios = useAxios()

    const saveMachine = () => {
        const hightLevelNumber = Number(hightLevel.trim())

        if (hightLevelNumber === 0) {
            setError("Nepodarilo sa nastaviť")
            return
        }
        
        axios.put("machine/" + props.machine.code + "/conf/", {hight_level: hightLevel, title: title !== "" ? title : null})
            .then((res) => { props.setMachine(res.data); setError("") })
            .catch(error => setError("Nepodarilo sa nastaviť"))
	}


    return (
        <div className={styles.machineSettings}>
            <div className={styles.formWrapper} style={{"width": "17em"}}>
                <TheInput
                    type="text"
                    onChange={setTitle}
                    label="Názov"
                    value={props.machine.title !== null ? props.machine.title : ""}
                    maxLenght={14}
                    behavior="static"
                />

                <TheInput
                    type="number"
                    onChange={setHightLevel}
                    label="Upozorniť&nbsp;pri&nbsp;%"
                    value={props.machine.hight_level}
                    behavior="static"
                />
            </div>

            <div className={styles.buttonWrapper}>
                <span className={styles.error}>{error}</span>

                <TheButton
                    label="Potvrdiť"
                    onClick={saveMachine}
                    type="blue"
                />
            </div>
        </div>
    )
}

export default MachineSettings