import React, { useState } from "react"
import { IsAuthenticatedView } from "../permissions/Authenticated"
import ListOfMachines from "../components/machine/ListOfMachines"
import styles from "./MachineView.module.scss"
import useAxios from "../hooks/useAxios"
import { MachineType } from "../types"
import NoContent from "../components/NoContent"
import MenuOfMachines from "@components/machine/MenuOfMachine"
import MachineBoard from "@components/machine/MachineBoard"
import { useIsDesktop } from "@hooks/useIsMobile"
import classNames from "classnames"
import MachineDesktopBoard from "@components/machine/MachineDesktopBoard"
import MachineDesktopProblems from "@components/machine/MachineDesktopProblems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList } from "@fortawesome/free-solid-svg-icons"

const MachineView: React.FC = () => {
	const [machines, setMachines] = useState<MachineType[]|null>(null) // null means is before records
	const [machineId, setMachineId] = useState<number>(0)

	const [menuOfMachineBehavior, setMenuOfMachineBehavior] = useState<"static"|"hide"|"side">("hide")
	
	const axios = useAxios()

	const refreshMachines = () => {
		axios.get("/machine/")
			.then(res => { setMachines(res.data) })
			.catch(error => console.log(error))
	}

	const setMachine = (id: number, newMachine: MachineType) => {
		if (machines === null) { return }
		const machineCode = machines.at(id)?.code
		if (machineCode === undefined) return

		setMachines(machines.map((machine, index) => {
			if (index === id) return newMachine
			return machine
		}))
	}

	const machine = machines !== undefined ? machines?.at(machineId) : undefined

	return (
		<IsAuthenticatedView onEffect={refreshMachines}>
			<div className={classNames(styles.view)}>
				{machines !== null && machines.length !== 0  ? 
					<>
						<div>
							<MenuOfMachines
								behavior={menuOfMachineBehavior}
								machines={machines}
								onRefresh={refreshMachines} 
								onClick={setMachineId} 
								activate={machineId !== null ? machineId : undefined} 
							/>
						</div>

						<FontAwesomeIcon
							icon={faList}
							onClick={() => {
								if (menuOfMachineBehavior === "hide") setMenuOfMachineBehavior("side")
								if (menuOfMachineBehavior === "side") setMenuOfMachineBehavior("hide")
							}}
						/>

						{machine !== undefined && 
						<div className={styles.machineWrapper}>
							<MachineDesktopBoard machine={machine} setMachine={refreshMachines}/>
							<MachineDesktopProblems machine={machine} />
						</div>
						}
					</> :
					machines !== null && 
					  <NoContent missing="zariadenia"/>
				}
			</div>
		</IsAuthenticatedView>
	)
}

export default MachineView