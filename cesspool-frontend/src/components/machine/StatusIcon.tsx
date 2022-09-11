import React from "react"

// Styles && Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBatteryFull, faWater, faBatteryEmpty, faBatteryHalf, faBatteryQuarter, faBatteryThreeQuarters} from "@fortawesome/free-solid-svg-icons"
import { MachineType } from "@types"

interface LevelProps {
    machine: MachineType
}

export const StatusLevel: React.FC<LevelProps> = (props) => {
    const { machine } = props
    const level = machine.level_percent !== null ? machine.level_percent : machine.level !== null ? machine.level : undefined
    const label_string = level === undefined ? "..." : "%"
    
    return (
        <div>
            <span style={{marginRight: "0.25em"}}>{level}{label_string}</span>
            <FontAwesomeIcon icon={faWater} />
        </div> 
    )
}


interface BatteryProps {
    machine: MachineType
}

export const StatusBattery: React.FC<BatteryProps> = (props) => {
    const battery = props.machine.battery !== null ? props.machine.battery : undefined

    const batteryIcon = battery === undefined || battery <= 10 ? faBatteryEmpty : 
                        battery <= 40 ? faBatteryQuarter :
                        battery <= 60 ? faBatteryHalf :
                        battery <= 90 ? faBatteryThreeQuarters :
                        faBatteryFull
                        
    return (
        <div>
            <span style={{marginRight: "0.25em"}}>{battery}{battery !== undefined ? "%" : "..."}</span>
            <FontAwesomeIcon icon={batteryIcon} />
        </div> 
    )
}
