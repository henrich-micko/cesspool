import React, { useEffect } from "react"

// types
import { MachineType } from "@types"

// 
import TheBoard from "@components/TheBoard"
import ChartsView from "./machineViews/ChartsView"
import styles from "@styles/components/machine/machineDesktopBoard.module.scss"
import useAxios from "@hooks/useAxios"

interface Props {
    machine: MachineType
    setMachine(newMachine: MachineType): void
}

const MachineDesktopBoard: React.FC<Props> = (props) => {
    const [releaseDate, setReleaseDate] = React.useState<string|null>(null)
    const axios = useAxios()

    useEffect(() => {
        axios.get("/machine/" + props.machine.code + "/release-date/")
             .then(res => setReleaseDate(res.data.release_date))
             .catch(error => console.log(error))
    }, [props.machine])

    return (
        <TheBoard className={styles.machineBoard} label={props.machine.title !== null ? props.machine.title : props.machine.code }>
            <div className={styles.machineBoardBody}>
                <ChartsView machine={props.machine} />
                {releaseDate !== null
                ? 
                <p>
                    Hladina by mala dosiahnť 85% dňa {releaseDate}, posledný záznam: {props.machine.last_update?.split("T").at(0)}
                </p>

              : <span>Bohužial sa s danými zaznamamy sa nepodaril vypočet</span>
            }
            </div>
        </TheBoard>
    )
}

export default MachineDesktopBoard