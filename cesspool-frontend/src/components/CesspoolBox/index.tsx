import React from "react";
import styles from "@components/CesspoolBox/styles.module.scss";
import { TheBoxMin } from "@components/TheBox";
import { Record } from "@types";
import TheBattery from "@components/TheBattery";
import TheLevel from "@components/TheLevel";
import TheCesspoolProblems from "@components/TheCesspoolProblems";
import { getCity } from "../../formats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faTrash } from "@fortawesome/free-solid-svg-icons";
import { red } from "../../settings";


interface _CesspoolBox {
    pk: number;
    code: string;
    record: Record|null;
    problems: string[];
    city: string|null;
    about: string|null;
    deleteAt: string|null;
    debugMode: boolean;
    onClick(code: string): void;
}

const CesspoolBox: React.FC<_CesspoolBox> = (props) => {
    
    const getProblems = () => {
        if (props.record)
            return props.problems
        return [...props.problems, "Zatiaľ žiadne záznamy."]
    }
    
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
                    { props.deleteAt && <FontAwesomeIcon icon={faTrash} color={red} /> }
                    { props.debugMode && <FontAwesomeIcon icon={faBug} color={red} /> }
                    <TheBattery value={ props.record ? props.record.battery : null } />
                    <TheLevel value={ props.record ? props.record.battery : null } /> 
                </div>
            </div>
            
            <div className={styles.aboutAndCity}>
                <span>{ props.about }</span>
                <span>{ getCity(props.city) }</span>
            </div>

            { (props.problems.length > 0 || props.record === null) &&
                <div className={styles.problems}>
                    <TheCesspoolProblems 
                        problems={getProblems()} />
                </div>
            }
        </TheBoxMin>
    )
}

export default CesspoolBox;