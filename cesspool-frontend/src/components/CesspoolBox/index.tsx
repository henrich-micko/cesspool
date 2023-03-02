import React from "react";
import styles from "@components/CesspoolBox/styles.module.scss";
import TheBox from "@components/TheBox";
import { Record } from "@types";
import TheBattery from "@components/TheBattery";
import Wave from "@assets/wave.svg";


interface _CesspoolBox {
    pk: number;
    code: string;
    title: string;
    record: Record|null;
    onClick(code: string): void;
}

const CesspoolBox: React.FC<_CesspoolBox> = (props) => {
    return (
        <TheBox
            style={{
                "padding": 0,
                "marginTop": "2em",
                "cursor": "pointer"
            }}
            onClick={() => props.onClick(props.code)}    
        >
            <div className={styles.header}>
                <h2>{ props.title !== null ? props.title : props.code }</h2>
                { props.record && <TheBattery value={props.record.battery} /> }
            </div>

            <div className={styles.wave}>
                <img src={Wave} />
                <div className={styles.bottom}>
                    <span className={styles.levelPercent}>
                        {
                            props.record !== null 
                                ? "Hladina " + props.record.level_percent + "%"
                                : "Bez záznamov"
                        }
                    </span>
                </div>
            </div>

            <div className={styles.problems}>
                <ul>
                    <li>Vysoka hladina</li>
                </ul>
            </div>
        </TheBox>
    )
}

export default CesspoolBox;