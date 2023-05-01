import TheBox from "@components/TheBox";
import React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from "@components/TheCesspoolStatus/styles.module.scss";
import { cpStyles, TheCpWrapper } from "@components/TheCircularProgressbar";


interface _TheCesspoolStatus {
    levelPercent: number;
    levelMeter: number;
    battery: number
    batteryVolt: number;
}

const TheCesspoolStatus: React.FC<_TheCesspoolStatus> = (props) => {
    return (
        <TheBox style={{ "width": "auto" }}>
            <div className={styles.wrapper}>
                <div>
                    <TheCpWrapper label="Hladina">
                        <CircularProgressbar
                            styles={cpStyles}
                            value={props.levelPercent}
                            text={`${props.levelPercent}%`}
                        />
                    </TheCpWrapper>
                    <span className={styles.spec}>{props.levelMeter} m</span>
                </div>
                
                <div>
                    <TheCpWrapper label="Bateria">
                        <CircularProgressbar
                            styles={cpStyles}
                            value={props.battery}
                            text={`${props.battery}%`}
                        />
                    </TheCpWrapper>
                    <span className={styles.spec}>{props.batteryVolt} Volt</span>
                </div>
            </div>
        </TheBox>
    )

}

export default TheCesspoolStatus;