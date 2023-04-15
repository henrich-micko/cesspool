import React from "react";
import styles from "@components/CtuBox/styles.module.scss";
import { TheBoxMin } from "@components/TheBox";
import { Record } from "@types";
import TheBattery from "@components/TheBattery";
import Wave from "@assets/wave.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { red } from "../../settings";
import TheCesspoolProblems from "@components/TheCesspoolProblems";
import TheLevel from "@components/TheLevel";


interface _CtuBox {
    pk: number;
    code: string;
    title: string;
    record: Record|null;
    problems: string[];
    onClick(code: string): void;
}

const CtuBox: React.FC<_CtuBox> = (props) => {
    
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
                <h2>{ props.title !== null ? props.title : props.code }</h2>

                <div className={styles.iconWrapper}>
                    { props.problems.length > 0 && <FontAwesomeIcon icon={faWarning} color={red} /> }
                    { props.record && <TheBattery value={props.record.battery} /> }
                </div>
            </div>

            <div className={styles.wave}>
                <img src={Wave} />
                <div className={styles.bottom} style={{ borderRadius: "0 0 7px 7px"  }}>
                    <span className={styles.levelPercent}>
                        {
                            props.record !== null 
                                ? "Hladina " + props.record.level_percent + "%"
                                : "Bez záznamov"
                        }
                    </span>
                </div>
            </div>
        </TheBoxMin>
    )
}

export default CtuBox;