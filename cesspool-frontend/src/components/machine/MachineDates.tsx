import React, { useEffect, useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineDates.module.scss"

// types && hooks
import { MachineAdminType, MachineType } from "@types"
import useAxios from "@hooks/useAxios"

interface Props {
    machine: MachineType|MachineAdminType
}

const MachineDates: React.FC<Props> = (props) => {
    const [releaseDate, setReleaseDate] = useState<string|null>(null)
    
    const axios = useAxios()

    useEffect(() => {
        axios.get("machine/" + props.machine.code + "/release-date")
             .then(res => setReleaseDate(res.data.release_date))
             .catch(error => console.log(error))
    }, [])

    const formatDate = (date: string) => {
        const datetime = date.split("T").at(0)
        if (datetime === undefined) return

        const year = datetime.split("-").at(0)
        const month = datetime.split("-").at(1)
        const day = datetime.split("-").at(2)

        return year + " " + day + "." + month + "."
    }

    const date = props.machine.last_update !== null ? formatDate(props.machine.last_update) : null

    return (
        <div className={styles.machineDates}>
            <p>
                {releaseDate !== null ?
                    <>Hladina by mala dosiahnť 85% dňa <u>{releaseDate}</u>, p</> : <>P</>}
                    osledný záznam zo dňa: {date !== null ? <u>{date}</u> : <span>...</span>}
            </p>
        </div>
    )
}

export default MachineDates