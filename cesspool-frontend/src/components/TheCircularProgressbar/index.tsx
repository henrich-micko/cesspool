import { buildStyles } from "react-circular-progressbar";
import { blue, glass, background } from "../../settings";
import styles from "@components/TheCircularProgressbar/styles.module.scss";


export const cpStyles = buildStyles({
    rotation: 0.25,
    strokeLinecap: 'butt',
    textSize: '16px',
    pathTransitionDuration: 0.5,
    pathColor: blue,
    textColor: "white",
    trailColor: glass,
    backgroundColor: background,
})


interface _TheCpWrapper {
    label: string;
    children: React.ReactNode;
}

export const TheCpWrapper: React.FC<_TheCpWrapper> = (props) => {
    return (
        <div className={styles.cpWrapper}>
            {props.children} {/* CP */}
            <span>{props.label}</span>
        </div>
    )    
}

