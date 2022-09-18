import React, { useEffect, useState } from "react"

// types
import { MachineAdminType, UserType } from "@types"

// components
import NoContent from "@components/NoContent"

// hooks
import useAxios from "@hooks/useAxios"
import { IsAdminView } from "@permissions/Admin"

import styles from "@styles/views/admin/adminMachineView.module.scss"
import MenuOfAdminMachines from "@components/admin/machine/MenuOfAdminMachine"
import MachineDesktopAdminBoard from "@components/admin/machine/MachineDesktopAdminBoard"
import MachineAdminDangerzone from "@components/admin/machine/MachineAdminDangerzone"
import MachineCreate from "@components/admin/machine/MachineCreate"

const AdminMachineView: React.FC = () => {
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)
	const [machineId, setMachineId] = useState<number>(0) // -1 is reserved for new machine
	const [users, setUsers] = useState<UserType[]>([])

    const axios = useAxios()

	const refreshData = () => {
		axios.get("/admin/machine/")
			.then(res => setMachines(res.data))
			.catch(error => console.log(error))
		axios.get("/admin/account/")
			.then(res => setUsers(res.data))
			.catch(error => console.log(error))
    }

    useEffect(() => {
		refreshData()
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

	useEffect(() => {
		console.log(machineId)
	}, [machineId])

	const machine = machines !== undefined ? machines?.at(machineId) : undefined

    return (
        <IsAdminView>
            {machines !== null && machines.length === 0 ? <NoContent missing="zariadnia" /> :
				<div className={styles.view}>
					{machines !== null &&
						<>
							<MenuOfAdminMachines activate={machineId} machines={machines} onClick={setMachineId} onRefresh={refreshData} />
							
							{(machine !== undefined && machineId !== -1) &&
							<div className={styles.machineWrapper}>
								<MachineDesktopAdminBoard machine={machine} users={users} setMachine={(newMachine: MachineAdminType) => setMachine(machineId, newMachine)} />
								<MachineAdminDangerzone machine={machine} setMachine={(newMachine) => setMachine(machineId, newMachine)} />
							</div>
							}

							{machineId === -1 &&
								<div className={styles.machineWrapper}>
									<MachineCreate users={users} onSubmit={() => {}} />
								</div>
							}
						</>
					}
				</div>
			}
        </IsAdminView>
    )
}

export default AdminMachineView