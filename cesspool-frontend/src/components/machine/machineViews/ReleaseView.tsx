import React, { useEffect, useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineView.module.scss"
import classNames from "classnames"

// types
import { MachineType } from "../../../types"

import useAxios from "../../../hooks/useAxios"

interface Props {
    machine: MachineType
}

const ReleaseView: React.FC<Props> = (props) => {
    const [releaseDate, setReleaseDate] = useState<string|null>(null)
    
    const axios = useAxios()

    useEffect(() => {
        axios.get("machine/" + props.machine.code + "/release-date")
             .then(res => setReleaseDate(res.data.release_date))
             .catch(error => console.log(error))
    }, [])

    return (
        <div className={classNames(styles.machineView, styles.release)}>
            <p>
                {releaseDate !== null &&
                    <>Hladina by mala dosiahnť 85% dňa <u>{releaseDate}</u>, p</>}
                    Posledný záznam zo dňa: {props.machine.last_update !== null ? <u>{props.machine.last_update?.split("T").at(0)}</u> : <span>...</span>}
            </p>
        </div>
    )
}

export default ReleaseView