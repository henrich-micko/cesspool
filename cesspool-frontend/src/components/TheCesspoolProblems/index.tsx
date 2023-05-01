import React from "react";
import TheBox, { TheBoxHeader } from "@components/TheBox";
import { faFlag, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@components/TheCesspoolProblems/styles.module.scss";
import { red } from "../../settings";


interface _TheCesspoolProblem {
    problem: string;
}

export const TheCesspoolProblem: React.FC<_TheCesspoolProblem> = (props) => {
    return (
        <li className={styles.problem}>
            <FontAwesomeIcon icon={faWarning} color={red}/>
            <span>{props.problem}</span>
        </li>
    )
}


interface _TheCesspoolProblems {
    problems: string[];
    showNotProblems?: boolean;

}

const TheCesspoolProblems: React.FC<_TheCesspoolProblems> = (props) => {
    return (
        <ul className={styles.problems}>
            { props.problems.map(p => <TheCesspoolProblem problem={p} />) }
            { props.showNotProblems && props.problems.length === 0 && 
                <li className={styles.problem}>
                    <FontAwesomeIcon icon={faFlag} />
                    <span>Bez problemov</span>
                </li>
            }
        </ul>
    )
}

export default TheCesspoolProblems;


export const TheCesspoolProblemsBox: React.FC<_TheCesspoolProblems> = (props) => {
    return (
        <TheBox style={{ "width": "auto" }}>
            <TheBoxHeader style={{ "textAlign": "left", "margin": 0 }}>Problémy</TheBoxHeader>
            <TheCesspoolProblems problems={props.problems} showNotProblems={true} />
        </TheBox>
    )
}
