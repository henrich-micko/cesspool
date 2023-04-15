import React from "react";
import styles from "@components/TheBattery/styles.module.scss";
import { faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface _TheLevel {
    value: number|null;
}

const TheLevel: React.FC<_TheLevel> = (props) => {
    return (
        <div className={styles.wrapper}>
            { props.value === null ? "?" : `${props.value}%` }
            <FontAwesomeIcon icon={faWater} size="1x" />
        </div>
    )
}

export default TheLevel;