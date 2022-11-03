import React, { useEffect, useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineDates.module.scss"

// types && hooks
import useAxios from "@hooks/useAxios"

interface Props {
    code: string
    last_update: string
}

const MachineDates: React.FC<Props> = (props) => {
    const formatDate = (date: string) => {
        const datetime = date.split("T").at(0)
        if (datetime === undefined) return

        const year = datetime.split("-").at(0)
        const month = datetime.split("-").at(1)
        const day = datetime.split("-").at(2)

        return year + " " + day + "." + month + "."
    }

    const date = props.last_update !== null ? formatDate(props.last_update) : null

    return (
        <div className={styles.machineDates}>
            <p>
                Posledný záznam zo dňa: {date !== null ? <u>{date}</u> : <span>...</span>}
            </p>
        </div>
    )
}

export default MachineDates