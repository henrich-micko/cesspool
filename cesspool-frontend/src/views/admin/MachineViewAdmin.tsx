import React, { useEffect, useState } from "react"

// types
import { MachineAdminType } from "@types"

// components
import NoContent from "@components/NoContent"

// hooks
import useAxios from "@hooks/useAxios"
import { IsAdminView } from "@permissions/Admin"

import styles from "@styles/views/admin/machineViewAdmin.module.scss"
import MenuOfAdminMachines from "@components/machine/MenuOfMachineAdmin"
import TheNaviagtion from "@components/TheNaviagtion"
import MachineProblems from "@components/machine/MachineProblems"
import MachineBoardAdmin from "@components/machine/MachineBoardAdmin"
import MachineDeleteBoard from "@components/machine/MachineDeleteBoard"
import MachineCreate from "@components/machine/MachineCreate"
import PopUp from "@components/PopUp"

const AdminMachineView: React.FC = () => {
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)
	const [machineId, setMachineId] = useState<number>(0) // -1 is reserved for new machine

	const [viewCreate, setViewCreate] = useState<boolean>(false)

    const axios = useAxios()

	const refreshData = () => {
		axios.get("/admin/machine/")
			.then(res => setMachines(res.data))
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

	const onCreate = (newMachine: MachineAdminType) => {
		if (machines !== null) setMachines([...machines, newMachine])
		else setMachines([newMachine])

		if (machines !== null) setMachineId(machines.length)
		
		setViewCreate(false)
	}

	const machine = (machines !== undefined) ? machines?.at(machineId) : undefined
	if (machine === undefined && machines !== null && machines.length !== 0) setMachineId(0)

    return (
        <IsAdminView>
			<TheNaviagtion>
				<MenuOfAdminMachines 
					activate={machineId}
					machines={machines}
					onClick={setMachineId}
					onRefresh={refreshData}
					onAdd={() => setViewCreate(true)}
				/>
			</TheNaviagtion>

            <div className={styles.view}>
				{
					machine !== undefined &&
					<>
						<div className={styles.machineWrapper}>
							<MachineBoardAdmin machine={machine} setMachine={(newMachine) => setMachine(machineId, newMachine)}/>
							<MachineProblems machine={machine} />
						</div>

						<MachineDeleteBoard machine={machine} setMachine={(newMachine) => setMachine(machineId, newMachine)}/>
					</>
				}

				{
					viewCreate && 
					<PopUp label="Nové zariadenie" onClickClose={() => setViewCreate(false)}>
						<MachineCreate onCreate={onCreate} />
					</PopUp>
				}
				
				{
					(machines !== null && machines.length === 0)  &&
					<NoContent missing="zariadenia"/>
				}
			</div>
        </IsAdminView>
    )
}

export default AdminMachineView