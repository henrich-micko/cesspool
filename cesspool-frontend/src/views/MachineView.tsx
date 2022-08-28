import React, { useState } from "react"

// permissions
import { IsAuthenticatedView } from "../permissions/Authenticated"

// components
import ListOfMachines from "../components/machine/ListOfMachines"

// styles && icons
import EmojyLogo from "../assets/emojy.svg"
import styles from "./MachineView.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons"

// api
import useAxios from "../hooks/useAxios"
import { MachineType, RecordType } from "../types"

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
				<div className={styles.headder}>
					<FontAwesomeIcon
						className={styles.icon}
						size="sm"
						icon={faRefresh}
						onClick={refreshMachines}
					/>
				</div>
				{machines !== null && machines.length !== 0 
					? <ListOfMachines machines={machines} refresh={refreshMachine}/>
					: machines !== null &&<div className={styles.noRecords}>
						<img src={EmojyLogo} alt="Thinking emojy" />
						<h2>Hmm zdá sa že nemate žiadne zariadenia</h2>
					  </div>
				}
			</div>
		</IsAuthenticatedView>
	)
}

export default MachineView