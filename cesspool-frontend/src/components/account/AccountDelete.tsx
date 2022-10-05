import React from "react"
import { MachineAdminType, UserType } from "@types"

import styles from "@styles/components/machine/machineDeleteBoard.module.scss"
import TheButton from "@components/form/TheButton"
import useAxios from "@hooks/useAxios"

interface Props {
    account: UserType,
    setAccount(newAccount: UserType): void
}

const AccountAdminDelete: React.FC<Props> = (props) => {
    const axios = useAxios()

    const handleDelete = () => {
        axios.delete("/admin/account/" + props.account.pk)
             .then(res => props.setAccount(res.data))
             .catch(error => console.log(error))
    }

    const handleRestore = () => {
        axios.get("/admin/account/" + props.account.pk + "/restore")
             .then(res => props.setAccount(res.data))
             .catch(error => console.log(error))
    }

    const formatTime = (time: string): string => {
        return "" + time.split("T").at(0) + " " + time.split("T").at(1)?.split(".").at(0)
    }

    return (
        <div className={styles.delete}>
                {props.account.delete_date === null ?
                <>
                    <span>Učet sa odstrani&nbsp;po&nbsp;24&nbsp;hodinách</span>
                    <TheButton label={"Odstraniť učet"} onClick={handleDelete} type="red"/>
                </> :
                <>
                    <span>Chcete obnoviť učet ({formatTime(props.account.delete_date)})&nbsp;?</span>
                    <TheButton label={"Obnoviť učet"} onClick={handleRestore} type="blue"/>
                </>
            }
        </div>
    )
}

export default AccountAdminDelete