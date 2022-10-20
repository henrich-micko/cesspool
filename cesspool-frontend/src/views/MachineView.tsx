import React, { useState } from "react"
import { IsAuthenticatedView } from "../permissions/Authenticated"
import styles from "@styles/views/global/viewWithNavigation.module.scss"
import useAxios from "../hooks/useAxios"
import { MachineForMenu, MachineType } from "../types"
import NoContent from "../components/NoContent"
import MenuOfMachines from "@components/machine/MenuOfMachine"
import MachineBoard from "@components/machine/MachineBoard"
import MachineProblems from "@components/machine/MachineProblems"
import TheNaviagtion from "@components/TheNaviagtion"
import TheLoading from "@components/TheLoading"

const MachineView: React.FC = () => {
	const [machines, setMachines] = useState<MachineType[]|null>(null) // null means is before records
	const [machineIndex, setMachineIndex] = useState<number>(0)

	const axios = useAxios()

	const refreshMachines = () => {
		axios.get("/machine/")
			.then(res => { setMachines(res.data) })
			.catch(error => console.log(error))
	}

	const setMachine = (index: number, newMachine: MachineType) => {
		if (machines === null) { return }
		const machineCode = machines.at(index)?.code
		if (machineCode === undefined) return

		setMachines(machines.map((machine, i) => {
			if (i === index) return newMachine
			return machine
		}))
	}

	const machineToMachineForMenu = (machine: MachineType): MachineForMenu => {
		return {
			title: machine.title !== null ? machine.title : machine.code,
			level: machine.level_percent,
			battery: machine.battery,
			topProblem: machine.problems.length === 0 ? null : machine.problems.at(0)?.importance === 0 ? "warning" : "error"
		}
	}

	const machine = machines !== undefined ? machines?.at(machineIndex) : undefined

	return (
		<IsAuthenticatedView onEffect={refreshMachines}>
			<TheNaviagtion>
				<MenuOfMachines
					machines={machines !== null ? machines.map(machineToMachineForMenu) : null}
					onRefreshClick={refreshMachines} 
					onMachineClick={setMachineIndex}
					activate={machineIndex !== null ? machineIndex : undefined} 
				/>
			</TheNaviagtion>

			<div className={styles.view}>
				{
					(machine !== undefined || machines === null) && 
					<div className={styles.verticalWrapper}>
						{
							(machine !== undefined)  ?
							<>
								<MachineBoard
									title={machine.title} 
									code={machine.code} 
									last_udpate={machine.last_update}
									hight_level={machine.hight_level} 
									setMachine={(newMachine) => setMachine(machineIndex, newMachine)}/>
								<MachineProblems problems={machine.problems} />
							</> : 
							<TheLoading />
						}
					</div>
				}
				
				{
					(machines !== null && machines.length === 0)  &&
					<NoContent missing="zariadenia"/>
				}
			</div>
		</IsAuthenticatedView>
	)
}

export default MachineView