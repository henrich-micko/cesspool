import React from "react"

// styles && icons
import styles from "@styles/components/machine/machineProblems.module.scss"
import classNames from "classnames"

// types
import { ProblemType } from "@types"
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
    problems: ProblemType[]
}

const ProblemsView: React.FC<ProblemViewProps> = (props) => {
    
    return (
        <ThemedBox label="Problemy" style={{"width": "100%"}}>
            <div className={styles.machineProblems}>
                {props.problems.length !== 0 ?
                    <ul>
                        {props.problems.map((item, index) => 
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
                        <span>Bez problemov </span>
                    </div> }
            </div>
        </ThemedBox>
    )
}

export default ProblemsView