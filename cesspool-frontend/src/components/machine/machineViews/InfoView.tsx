import React from "react"

// styles && icons
import styles from "../styles.module.scss"
import classNames from "classnames"

// types
import { MachineType } from "../../../types"

// conponets
import { StatusLevel, StatusBattery } from "../StatusIcon"

interface Props {
    machine: MachineType
}

const InfoView: React.FC<Props> = (props) => {
    const { machine } = props;

    return (
        <div className={classNames(styles.machineView, styles.info)}>
            <StatusLevel 
                level={machine.level_percent !== null ? machine.level_percent : machine.level !== null ? machine.level : undefined}
                label={machine.level_percent !== null ? "%" : machine.level !== null ? "l" : undefined}
            />
            <StatusBattery battery={machine.battery !== null ? machine.battery : undefined}/>
        </div>
    )
}

export default InfoView