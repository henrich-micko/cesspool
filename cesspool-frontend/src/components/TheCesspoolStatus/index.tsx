import TheBox from "@components/TheBox";
import React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from "@components/TheCesspoolStatus/styles.module.scss";
import { cpStyles, TheCpWrapper } from "@components/TheCircularProgressbar";


interface _TheCesspoolStatus {
    levelPercent: number;
    battery: number;
}

const TheCesspoolStatus: React.FC<_TheCesspoolStatus> = (props) => {
    return (
        <TheBox style={{ "width": "100%" }}>
            <div className={styles.wrapper}>
                <TheCpWrapper label="Hladina">
                    <CircularProgressbar 
                        styles={cpStyles} 
                        value={props.levelPercent} 
                        text={`${props.levelPercent}%`} 
                    />
                </TheCpWrapper>

                <TheCpWrapper label="Bateria">
                    <CircularProgressbar 
                        styles={cpStyles} 
                        value={props.battery} 
                        text={`${props.battery}%`} 
                    />
                </TheCpWrapper>
            </div>
        </TheBox>
    )

}

export default TheCesspoolStatus;