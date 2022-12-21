import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBatteryFull, faWater, faBatteryEmpty, faBatteryHalf, faBatteryQuarter, faBatteryThreeQuarters, faWarning, faCircleCheck} from "@fortawesome/free-solid-svg-icons"

const statusStyle = {
    "display": "flex",
    "width": "5em",
    "justify-content": "right",
    "align-items": "center"
}

interface StatusLevelProps {
    level: number
    levelType?: "%"|"m"
}

export const StatusLevel: React.FC<StatusLevelProps> = (props) => {    
    return (
        <div style={statusStyle}>
            <span style={{marginRight: "0.25em"}}>{props.level?.toFixed(0)}{props.levelType === undefined ? "%" : props.levelType}</span>
            <FontAwesomeIcon icon={faWater} />
        </div> 
    )
}

interface StatusBatteryProps {
    battery: number
}

export const StatusBattery: React.FC<StatusBatteryProps> = (props) => {
    const batteryIcon = props.battery === undefined || props.battery <= 10 ? faBatteryEmpty : 
                        props.battery <= 40 ? faBatteryQuarter :
                        props.battery <= 60 ? faBatteryHalf :
                        props.battery <= 90 ? faBatteryThreeQuarters :
                        faBatteryFull
                        
    return (
        <div style={statusStyle}>            
            <span style={{marginRight: "0.25em"}}>{props.battery?.toFixed(0)}{props.battery !== undefined ? "V" : "..."}</span>
            <FontAwesomeIcon icon={batteryIcon} />
        </div> 
    )
}

interface StatusProblemProps {
    topProblem: null | "error"|"warning"
}

export const StatusProblem: React.FC<StatusProblemProps> = (props) => {
    const yellow = "rgb(255, 255, 78)"
    const red = "#e45447"
    
    return (
        <div>
            <FontAwesomeIcon 
                icon={props.topProblem !== null ? faWarning : faCircleCheck}
                style={{
                    "color": props.topProblem === null ? undefined : props.topProblem === "warning" ? yellow : props.topProblem === "error" ? red : undefined
                }}
            />
        </div>
    )
}
