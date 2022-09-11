import React, { useEffect, useState } from "react"

// styles && icons
import styles from "@styles/components/machine/machineView.module.scss"
import classNames from "classnames"

// types
import { MachineType, ProblemType } from "../../../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWarning } from "@fortawesome/free-solid-svg-icons"


interface ProblemProps {
    problem: ProblemType
}

const Problem: React.FC<ProblemProps> = (props) => {
    const iconClass = props.problem.importance === 0 ? styles.yellow : styles.red

    return (
        <article>
            <FontAwesomeIcon icon={faWarning} className={classNames(styles.icon, iconClass)}/> <span>{props.problem.detail}</span>
        </article>
    )
}

interface ProblemViewProps {
    machine: MachineType
}

const ProblemsView: React.FC<ProblemViewProps> = (props) => {
    
    return (
        <div className={classNames(styles.machineView, styles.problems)}>
            {props.machine.problems.length !== 0 ?
                <ul>
                    {props.machine.problems.map((item, index) => 
                        <li key={index}>
                            <Problem problem={item} />
                        </li>
                    )}
                </ul>
                : <div>Nenšiel sa žiaden problem</div> }
        </div>
    )
}

export default ProblemsView