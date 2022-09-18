import React from "react"

// Styles && Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBatteryFull, faWater, faBatteryEmpty, faBatteryHalf, faBatteryQuarter, faBatteryThreeQuarters, faWarning, faCircleCheck} from "@fortawesome/free-solid-svg-icons"
import { MachineType } from "@types"

interface Props {
    machine: MachineType
}

export const StatusLevel: React.FC<Props> = (props) => {
    const { machine } = props
    const level = machine.level_percent !== null ? machine.level_percent : machine.level !== null ? machine.level : undefined
    const label_string = level === undefined ? "..." : "%"
    
    return (
        <div>
            <span style={{marginRight: "0.25em"}}>{level?.toFixed(0)}{label_string}</span>
            <FontAwesomeIcon icon={faWater} />
        </div> 
    )
}


export const StatusBattery: React.FC<Props> = (props) => {
    const battery = props.machine.battery !== null ? props.machine.battery : undefined

    const batteryIcon = battery === undefined || battery <= 10 ? faBatteryEmpty : 
                        battery <= 40 ? faBatteryQuarter :
                        battery <= 60 ? faBatteryHalf :
                        battery <= 90 ? faBatteryThreeQuarters :
                        faBatteryFull
                        
    return (
        <div>
            <span style={{marginRight: "0.25em"}}>{battery?.toFixed(0)}{battery !== undefined ? "%" : "..."}</span>
            <FontAwesomeIcon icon={batteryIcon} />
        </div> 
    )
}

export const StatusProblem: React.FC<Props> = (props) => {
    const problem = props.machine.problems.at(0)
    const yellow = "rgb(255, 255, 78)"
    const red = "rgb(255, 78, 78)"
    
    return (
        <div>
            <FontAwesomeIcon 
                icon={problem !== undefined ? faWarning : faCircleCheck}
                style={{
                    "color": problem === undefined ? undefined : problem.importance === 0 ? yellow : problem.importance === 1 ? red : undefined
                }}
            />
        </div>
    )
}
