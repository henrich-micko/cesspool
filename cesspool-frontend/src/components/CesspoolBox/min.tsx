import { TheBoxMin } from "@components/TheBox";
import { faBug, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getName } from "../../formats";
import React from "react";
import { red } from "../../settings";
import styles from "./styles.module.scss";


interface _TheCesspoolBoxMin {
    pk: number;
    code: string;
    isOwner?: boolean;
    owner?: string;
    city?: string|null;
    delete: boolean;
    debugMode: boolean;
    onClick(code: string): void;
}

const TheCesspoolMin: React.FC<_TheCesspoolBoxMin> = (props) => {
    return (
        <TheBoxMin
            style={{
                "padding": 0,
                "marginTop": "2em",
                "cursor": "pointer",
                "height": "fit-content",
                "width": "auto"
            }}
            onClick={() => props.onClick(props.code)}
        >

            <div className={styles.header}>
                <h2>{ props.code }</h2>

                <div className={styles.iconWrapper}>
                    { props.delete && <FontAwesomeIcon icon={faTrash} color={red} /> }
                    { props.debugMode && <FontAwesomeIcon icon={faBug} color={red} /> }
                </div>

            </div>

            <div className={styles.spec}>
                { props.city !== undefined && <span>{props.city}</span> }
                <span>{ props.isOwner !== undefined ? 
                    props.isOwner ?"Je vlastník" : "Není vlastník"
                    : props.owner ? "Vlastní " + getName(props.owner) : "Bez vlasníka" }</span>
            </div>

        </TheBoxMin>
    );
};

export default TheCesspoolMin;