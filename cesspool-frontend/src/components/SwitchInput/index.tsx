import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import React from "react";
import { blue } from "../../settings";


interface _SwitchInput {
    label: string;
    value: boolean;
    onClick(value: boolean): void;
}

const SwithInput: React.FC<_SwitchInput> = (props) => {    
    return (
        <div className={styles.wrapper}>
            <span >{props.label}</span>
            <FontAwesomeIcon 
                icon={props.value ? faToggleOn : faToggleOff}
                size="lg"
                color={props.value ? blue : undefined}
                onClick={() => props.onClick(props.value ? false : true)}
            />
        </div>
    )
}

export default SwithInput;