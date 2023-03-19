import React from "react";
import TheBox, { TheBoxHeader } from "@components/TheBox";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
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

}

const TheCesspoolProblems: React.FC<_TheCesspoolProblems> = (props) => {
    return (
        <ul className={styles.problems}>
            { props.problems.map(p => <TheCesspoolProblem problem={p} />) }
        </ul>
    )
}

export default TheCesspoolProblems;


export const TheCesspoolProblemsBox: React.FC<_TheCesspoolProblems> = (props) => {
    return (
        <TheBox style={{ "width": "100%" }}>
            <TheBoxHeader style={{ "textAlign": "left" }}>Problémy</TheBoxHeader>
            <TheCesspoolProblems problems={props.problems} />
        </TheBox>
    )
}
