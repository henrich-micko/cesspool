import React from "react"

// Styles && Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBatteryFull, faWater, faBatteryEmpty, faBatteryHalf, faBatteryQuarter, faBatteryThreeQuarters} from "@fortawesome/free-solid-svg-icons"

interface LevelProps {
    level?: number;
    label?: string;
}

export const StatusLevel: React.FC<LevelProps> = ({level = undefined, label = undefined}: LevelProps) => {
    const label_string = level === undefined ? "..." : label !== undefined ? label : "%"
    
    return (
        <div>
            <span style={{marginRight: "0.25em"}}>{level}{label_string}</span>
            <FontAwesomeIcon icon={faWater} />
        </div> 
    )
}


interface BatteryProps {
    battery?: number
}

export const StatusBattery: React.FC<BatteryProps> = ({battery = undefined}: BatteryProps) => {
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
