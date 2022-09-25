import React, { useEffect, useState } from "react"
import { IsAuthenticatedView } from "../permissions/Authenticated"
import styles from "./MachineView.module.scss"
import useAxios from "../hooks/useAxios"
import { MachineType } from "../types"
import NoContent from "../components/NoContent"
import MenuOfMachines from "@components/machine/MenuOfMachine"
import { useMaxWidth } from "@hooks/useIsMobile"
import classNames from "classnames"
import MachineBoard from "@components/machine/MachineBoard"
import MachineProblems from "@components/machine/MachineProblems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList } from "@fortawesome/free-solid-svg-icons"
import TheNaviagtion from "@components/TheNaviagtion"

const MachineView: React.FC = () => {
	const [machines, setMachines] = useState<MachineType[]|null>(null) // null means is before records
	const [machineId, setMachineId] = useState<number>(0)
	
	const [menuOfMachineBehavior, setMenuOfMachineBehavior] = useState<"static"|"side">("side")
	const isDesktop = !useMaxWidth("1375px")
	
	useEffect(() => {
		if (isDesktop) setMenuOfMachineBehavior("static")
		else (setMenuOfMachineBehavior("side"))

	}, [isDesktop])

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
			<TheNaviagtion>
				<MenuOfMachines
					machines={machines}
					onRefresh={refreshMachines} 
					onClick={setMachineId}
					onClose={() => setMenuOfMachineBehavior("static")}
					activate={machineId !== null ? machineId : undefined} 
				/>
			</TheNaviagtion>

			<div className={classNames(styles.view)}>
				{
					machine !== undefined && 
					<div className={styles.machineWrapper}>
						<MachineBoard machine={machine} setMachine={(newMachine) => setMachine(machineId, newMachine)}/>
						<MachineProblems machine={machine} />
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