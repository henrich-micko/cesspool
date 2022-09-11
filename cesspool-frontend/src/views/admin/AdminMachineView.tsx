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
import TextInput from "@components/form/TextInput"

import styles from "@styles/views/admin/styles.module.scss"

const AdminMachineView: React.FC = () => {
	const [filter, setFilter] = useState<"code"|"filter"|null>(null)

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

	const handleIcon = (icon: string) => {
		if (icon === "refresh") refreshMachines()
		else if (icon === "search") setFilter("code")
	}
    return (
        <IsAdminView>
			<AdminNavigation handleIcon={handleIcon} />

			{filter === "code" ?
				<div className={styles.search}>
					<div className={styles.inputWrapper}>
						<TextInput label="Code" onSubmit={() => {}} />
					</div>
				</div>
			: undefined }

            {machines !== null && machines.length === 0 ?
                <NoContent missing="zariadnia" /> :
				machines !== null && <ListOfAdminMachines machines={machines} setMachine={setMachine} users={users}/>
			}
        </IsAdminView>
    )
}

export default AdminMachineView