import React, { useState } from "react"

// types && hooks
import { MachineType } from "@types"
import useAxios from "@hooks/useAxios"

// components
import TheInput from "@components/form/TheInput"
import TheForm from "@components/form/TheForm"

interface Props {
    title: string|null
    code: string
    hight_level: number
    setMachine(newMachine: MachineType): void
}

const MachineSettings: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")

    const [title, setTitle] = useState<string>(props.title !== null ? props.title : "")
    const [hightLevel, setHightLevel] = useState<String>(String(props.hight_level))

    const axios = useAxios()

    const saveMachine = () => {
        const hightLevelNumber = Number(hightLevel.trim())

        if (hightLevelNumber === 0) {
            setError("Nepodarilo sa nastaviť")
            return
        }
        
        axios.put("machine/" + props.code + "/conf/", {hight_level: hightLevel, title: title !== "" ? title : null})
            .then((res) => { props.setMachine(res.data); setError("") })
            .catch(error => setError("Nepodarilo sa nastaviť"))
        console.log("n")
	}


    return (
        <TheForm error={error} onClick={saveMachine} childrenWidth={"17em"}>
            <>
                <TheInput
                    type="text"
                    onChange={setTitle}
                    label="Názov"
                    value={props.title !== null ? props.title : ""}
                    maxLenght={14}
                    behavior="static"
                />

                <TheInput
                    type="number"
                    onChange={setHightLevel}
                    label="Upozorniť&nbsp;pri&nbsp;%"
                    value={props.hight_level}
                    behavior="static"
                />
            </>
        </TheForm>
    )
}

export default MachineSettings