import React from "react"
import { MachineAdminType } from "@types"

import styles from "@styles/components/admin/machine/machineAdminView.module.scss"
import classNames from "classnames"
import TheButton from "@components/form/TheButton"
import useIsMobile from "@hooks/useIsMobile"
import useAxios from "@hooks/useAxios"

interface Props {
    machine: MachineAdminType,
    setMachine(newMachine: MachineAdminType): void
}

const MachineAdminDelete: React.FC<Props> = (props) => {
    const isMobile = useIsMobile()
    const axios = useAxios()

    const handleDelete = () => {
        axios.delete("/admin/machine/" + props.machine.code)
             .then(res => props.setMachine(res.data))
             .catch(error => console.log(error))
    }

    const handleRestore = () => {
        axios.get("/admin/machine/" + props.machine.code + "/restore")
             .then(res => props.setMachine(res.data))
             .catch(error => console.log(error))
    }

    const formatTime = (time: string): string => {
        return "" + time.split("T").at(0) + " " + time.split("T").at(1)?.split(".").at(0)
    }

    return (
        <div className={classNames(styles.machineView, styles.delete, isMobile && styles.mobile)}>
                {props.machine.delete_date === null ?
                <>
                    <span>Zariadenie sa odstrani&nbsp;po&nbsp;24&nbsp;hodinách</span>
                    <TheButton label={"Odstraniť zariadenie"} onClick={handleDelete} type="red"/>
                </> :
                <>
                    <span>Chcete obnoviť zariadenie ({formatTime(props.machine.delete_date)})&nbsp;?</span>
                    <TheButton label={"Obnoviť zariadenie"} onClick={handleRestore} type="blue"/>
                </>
            }
        </div>
    )
}

export default MachineAdminDelete