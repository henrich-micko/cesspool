import React, { useEffect, useState } from "react"

// types
import { MachineAdminType, MachineForAdminMenu } from "@types"

// components
import NoContent from "@components/NoContent"

// hooks
import useAxios from "@hooks/useAxios"
import { IsAdminView } from "@permissions/Admin"

import styles from "@styles/views/global/viewWithNavigation.module.scss"
import MenuOfAdminMachines from "@components/machine/MenuOfMachineAdmin"
import TheNaviagtion from "@components/TheNaviagtion"
import MachineProblems from "@components/machine/MachineProblems"
import MachineBoardAdmin from "@components/machine/MachineBoardAdmin"
import MachineDeleteBoard from "@components/machine/MachineDeleteBoard"
import MachineCreate from "@components/machine/MachineCreate"
import PopUp from "@components/PopUp"
import TheLoading from "@components/TheLoading"


const MachineViewAmdin: React.FC = () => {
    const [machines, setMachines] = useState<MachineAdminType[]|null>(null)
	const [machineIndex, setMachineIndex] = useState<number>(0) // -1 is reserved for new machine

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

		if (machines !== null) setMachineIndex(machines.length)
		
		setViewCreate(false)
	}

	const machineToMachineForAminMenu = (machine: MachineAdminType): MachineForAdminMenu => {
		return {
			title: machine.title !== null ? machine.title : null,
			code: machine.code,
			user: machine.user,
			delete: machine.delete_date !== null || machine.delete_records_date !== null
		}
	}

	const machine = (machines !== undefined) ? machines?.at(machineIndex) : undefined
	if (machine === undefined && machines !== null && machines.length !== 0) setMachineIndex(0)

    return (
        <IsAdminView>
			<TheNaviagtion>
				<MenuOfAdminMachines 
					activate={machineIndex}
					machines={machines !== null ? machines.map(m => machineToMachineForAminMenu(m)) : null}
					onMachineClick={setMachineIndex}
					onRefreshClick={refreshData}
					onAddClick={() => setViewCreate(true)}
				/>
			</TheNaviagtion>

            <div className={styles.view}>
				{
					machine !== undefined &&
					<>
						<div className={styles.verticalWrapper}>
							<MachineBoardAdmin 
								user={machine.user}
								code={machine.code}
								mqtt={machine.mqtt}
								notification={machine.notification}
								last_update={machine.last_update}
								setMachine={(newMachine) => setMachine(machineIndex, newMachine)}
							/>
							<MachineProblems problems={machine.problems} />
						</div>

						<MachineDeleteBoard machine={machine} setMachine={(newMachine) => setMachine(machineIndex, newMachine)}/>
					</>
				}

				{
					machines === null &&
					<div className={styles.verticalWrapper}>
						<TheLoading />
					</div>
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

export default MachineViewAmdin