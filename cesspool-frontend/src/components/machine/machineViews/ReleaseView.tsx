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
            {releaseDate !== null
              ? 
                <>
                    <p>
                        Hladina by mala dosiahnť 85% dňa {releaseDate}, posledný záznam: {props.machine.last_update?.split("T").at(0)}
                    </p>
                </>

              : <span>Bohužial sa s danými zaznamamy sa nepodaril vypočet</span>
            }
        </div>
    )
}

export default ReleaseView