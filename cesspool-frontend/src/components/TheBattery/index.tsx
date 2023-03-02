import React from "react";
import styles from "@components/TheBattery/styles.module.scss";
import { 
    faBatteryQuarter, 
    faBatteryHalf, 
    faBatteryThreeQuarters, 
    faBatteryFull, 
    faBatteryEmpty
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface _TheBattery {
    value: number;
}

const TheBattery: React.FC<_TheBattery> = (props) => {
    const icon = props.value === undefined || props.value <= 10 ? faBatteryEmpty : 
                        props.value <= 40 ? faBatteryQuarter :
                        props.value <= 60 ? faBatteryHalf :
                        props.value <= 90 ? faBatteryThreeQuarters :
                        faBatteryFull;
    
    return (
        <div className={styles.wrapper}>
            <span className={styles.value}>{props.value}%</span>
            <FontAwesomeIcon icon={icon} size="1x" />
        </div>
    )
}

export default TheBattery;