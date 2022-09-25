import React from "react"
import { MachineAdminType } from "@types"

import styles from "@styles/components/machine/machineDeleteBoard.module.scss"
import TheButton from "@components/form/TheButton"
import useAxios from "@hooks/useAxios"

interface Props {
    machine: MachineAdminType,
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminDeleteRecords: React.FC<Props> = (props) => {
    const axios = useAxios()

    const handleDelete = () => {
        axios.delete("/admin/machine/" + props.machine.code + "/record/")
             .then(res => props.setMachine(res.data))
             .catch(error => console.log(error))
    }

    const handleRestore = () => {
        axios.get("/admin/machine/" + props.machine.code + "/record/restore")
             .then(res => props.setMachine(res.data))
             .catch(error => console.log(error))
    }

    const formatTime = (time: string): string => {
        return "" + time.split("T").at(0) + " " + time.split("T").at(1)?.split(".").at(0)
    }

    return (
        <div className={styles.delete}>
                {props.machine.delete_records_date === null ?
                <>
                    {props.machine.records !== 0 ?
                        <>
                            <span>Všetky záznamy sa odstrania&nbsp;po&nbsp;24&nbsp;hodinách</span>
                            <TheButton label={"Odstraniť zaznamy"} onClick={handleDelete} type="red"/>
                        </> :
                        <span>Nenašli sa žiadne záznamy</span>
                    }
                </> :
                <>
                    <span>Chcete obnoviť záznamy ({formatTime(props.machine.delete_records_date)}) ?</span>
                    <TheButton label={"Obnoviť zaznamy"} onClick={handleRestore} type="blue"/>
                </>
            }
        </div>
    )
}

export default MachineAdminDeleteRecords