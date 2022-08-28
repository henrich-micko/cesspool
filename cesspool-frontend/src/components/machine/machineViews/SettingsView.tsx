import React, { ChangeEvent, useEffect, useState } from "react"

// styles && icons
import styles from "../styles.module.scss"
import classNames from "classnames"

// types
import { MachineType } from "../../../types"

import { debounce } from "lodash-es"
import useAxios from "../../../hooks/useAxios"

interface Props {
    machine: MachineType;
    refresh: () => void
}

const SettingsView: React.FC<Props> = (props) => {
    const [error, setError] = useState<string>("")
    
    const axios = useAxios()
    
    // input elements
	const handleTitle = debounce((event: ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value.trim()

        axios.post("machine/" + props.machine.code + "/conf/", {title: title !== "" ? title : null})
            .then(() => props.refresh())
            .catch(error => console.log(error))

	}, 600)

    const handleMaxLevel = debounce((event: ChangeEvent<HTMLInputElement>) => {
        const maxLevel = Number(event.target.value)

        axios.post("machine/" + props.machine.code + "/conf/", {max_level: maxLevel !== 0 ? maxLevel : null})
            .then(() => props.refresh())
            .catch(error => console.log(error))

	}, 600)

    return (
        <div className={classNames(styles.machineView, styles.settings)}>
            <form>
                <label htmlFor="title">Nazov</label>   
                <input
                    id="title"
                    type="text"
                    onChange={handleTitle}
                    defaultValue={props.machine.title !== null ? props.machine.title : undefined}
                />

                <label htmlFor="maxLevel">Objem</label>
                <input
                    id="maxLevel"
                    type="number"
                    onChange={handleMaxLevel}
                    defaultValue={props.machine.max_level !== null ? props.machine.max_level : undefined}
                    spellCheck={false}
                />

                {error !== "" && <span>Neplatné udaje</span>}
            </form>
        </div>
    )
}

export default SettingsView