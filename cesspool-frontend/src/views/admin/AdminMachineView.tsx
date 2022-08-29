import React, { useEffect, useState } from "react"

// styles
import styles from ".styles.module.scss"

// types
import { MachineAdminType } from "../../types"

// components
import NoContent from "../../components/NoContent"

// hooks
import useAxios from "../../hooks/useAxios"
import ListOfAdminMachines from "../../components/admin/machine/ListOfAdminMachine"

const AdminMachineView: React.FC = () => {
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)

    const axios = useAxios()

	const refreshMachines = () => {
		axios.get("/admin/machine/")
			.then(res => setMachines(res.data))
			.catch(error => console.log(error))
    }

    useEffect(refreshMachines, [])

	const refreshMachine = (id: number) => {
		if (machines === null) { return }
		const machineCode = machines.at(id)?.code
		if (machineCode === undefined) return

		axios.get("/admin/machine/" + machineCode)
			.then(res => {
				setMachines(machines.map((machine, index) => {
					if (index === id) {
						return res.data
					}
					return machine
				}))
			})
			.catch(error => console.log(error))
	}

    return (
        <>
            {machines !== null && machines.length === 0 ? 
                <NoContent missing="zariadnia" /> :
                machines !== null && <ListOfAdminMachines machines={machines} refresh={refreshMachines}/>
            }
        </>
    )
}

export default AdminMachineView