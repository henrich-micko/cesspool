import React from "react";
import styles from "./styles.module.scss";
import { TheBoxMin } from "@components/TheBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { red } from "../../settings";


interface _CityBox {
    pk: number;
    title: string;
    district: string;
    isSetToDelete: boolean;
    manager: string|null;
    onClick(district: string, title: string): void;
}

const CityBox: React.FC<_CityBox> = (props) => {
    return (
        <TheBoxMin
            style={{
                "padding": 0,
                "marginTop": "2em",
                "cursor": "pointer",
                "height": "fit-content",
                "width": "auto"
            }}
            onClick={() => props.onClick(props.district, props.title)} >

            <div className={styles.header}>
                <h2>{ props.title }</h2>

                <div className={styles.iconWrapper}>
                   { props.isSetToDelete && <FontAwesomeIcon icon={faTrash} color={red} /> }
                </div>
            </div>
            
            <div className={styles.group}>
                <span>V okrese { props.district }</span>
                <span>{ props.manager ? "Manažer je " + props.manager.split("@").at(0) : "Bez manadžera" }</span>
            </div>
        </TheBoxMin>
    )
};

export default CityBox;