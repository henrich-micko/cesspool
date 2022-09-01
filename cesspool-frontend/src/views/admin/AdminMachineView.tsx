import React, { useEffect, useState } from "react"

// types
import { MachineAdminType, MachineType, UserType } from "@types"

// components
import NoContent from "@components/NoContent"

// hooks
import useAxios from "@hooks/useAxios"
import ListOfAdminMachines from "@components/admin/machine/ListOfAdminMachine"
import AdminNavigation from "@components/admin/AdminNavigation"
import { IsAdminView } from "@permissions/Admin"

const AdminMachineView: React.FC = () => {
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)
    const [users, setUsers] = useState<UserType[]>([])

    const axios = useAxios()

	const refreshMachines = () => {
		axios.get("/admin/machine/")
			.then(res => setMachines(res.data))
			.catch(error => console.log(error))
    }

    useEffect(() => {
		refreshMachines()
		axios.get("/admin/account/")
			 .then(res => setUsers(res.data))
			 .catch(error => console.log(error))
	}, [])

	const setMachine = (id: number, newMachine: MachineAdminType) => {
		if (machines === null) { return }
		const machineCode = machines.at(id)?.code
		if (machineCode === undefined) return

		setMachines(machines.map((machine, index) => {
			if (index === id) return newMachine
			return machine
		}))
	}

    return (
        <IsAdminView>
            {machines !== null && machines.length === 0 ?
                <NoContent missing="zariadnia" /> :
				<>
					<AdminNavigation onPlus={() => {}} onRefresh={refreshMachines}/>
                	{machines !== null && <ListOfAdminMachines machines={machines} setMachine={setMachine} users={users}/>}
				</>
			}
        </IsAdminView>
    )
}

export default AdminMachineView