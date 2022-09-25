import React from "react"

// styles && icons
import styles from "@styles/components/machine/machineProblems.module.scss"
import classNames from "classnames"

// types
import { MachineAdminType, MachineType, ProblemType } from "@types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faWarning } from "@fortawesome/free-solid-svg-icons"
import ThemedBox from "@components/ThemedBox"


interface ProblemProps {
    problem: ProblemType
}

const Problem: React.FC<ProblemProps> = (props) => {
    const iconClass = props.problem.importance === 0 ? styles.yellow : styles.red

    return (
        <div className={styles.problem}>
            <div className={classNames(styles.iconWrapper, iconClass)}>
                <FontAwesomeIcon icon={faWarning} />
            </div>

            <span>{props.problem.detail}</span>
        </div>
    )
}

interface ProblemViewProps {
    machine: MachineType|MachineAdminType
}

const ProblemsView: React.FC<ProblemViewProps> = (props) => {
    
    return (
        <ThemedBox label="Problemy" style={{"width": "auto"}}>
            <div className={styles.machineProblems}>
                {props.machine.problems.length !== 0 ?
                    <ul>
                        {props.machine.problems.map((item, index) => 
                            <li key={index}>
                                <Problem problem={item} />
                            </li>
                        )}
                    </ul>
                    : 
                    <div className={styles.noProblemWrapper}>
                        <FontAwesomeIcon 
                            className={styles.icon} 
                            icon={faThumbsUp}
                        />
                        <span>Tak sa zdá že tu není žiaden problem</span>
                    </div> }
            </div>
        </ThemedBox>
    )
}

export default ProblemsView