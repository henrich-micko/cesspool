import React, { useState } from "react"

// permissions
import { IsAuthenticatedView } from "../permissions/Authenticated"

// components
import ListOfMachines from "../components/machine/ListOfMachines"

// styles && icons
import styles from "./MachineView.module.scss"

// api
import useAxios from "../hooks/useAxios"
import { MachineType } from "../types"
import NoContent from "../components/NoContent"
import MachineNavigation from "../components/machine/MachineNavigation"

const MachineView: React.FC = () => {
	const [machines, setMachines] = useState<MachineType[]|null>(null) // null means is before records
	const axios = useAxios()

	const refreshMachines = () => {
		axios.get("/machine/")
			.then(res => setMachines(res.data))
			.catch(error => console.log(error))
	}

	const refreshMachine = (id: number) => {
		if (machines === null) { return }
		const machineCode = machines.at(id)?.code
		if (machineCode === undefined) return

		axios.get("machine/" + machineCode)
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
		<IsAuthenticatedView onEffect={refreshMachines}>
			<div className={styles.view}>
				<MachineNavigation onPlus={() => {window.open('https://www.zumpomer.sk', '_blank')}} onRefresh={refreshMachines}/>

				{machines !== null && machines.length !== 0 
					? <ListOfMachines machines={machines} refresh={refreshMachine}/>
					: machines !== null && 
					  <NoContent missing="zariadenia"/>
				}
			</div>
		</IsAuthenticatedView>
	)
}

export default MachineView