import React from "react"

import styles from "@styles/components/home/functionBox.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faChartSimple, faEnvelope, faMailBulk, faMailForward, faMailReply, faStopwatch, faTimesCircle, faVoicemail } from "@fortawesome/free-solid-svg-icons"

interface Props {
    children: React.ReactNode
}


const FunctionBox: React.FC<Props> = (props) => {
    return (
        <div className={styles.functionBox}>
            {props.children}
        </div>
    )
}

export default FunctionBox

export const ChartsFunctionBox: React.FC = () => {
    return (
        <FunctionBox>
            <div>
                <FontAwesomeIcon icon={faChartLine} size="lg"/>
                <span>Grafy</span>
            </div>
        </FunctionBox>
    )
}

export const EmailFunctionBox: React.FC = () => {
    return (
        <FunctionBox>
            <div>
                <FontAwesomeIcon icon={faEnvelope} size="lg"/>
                <span>Hlásenia</span>
            </div>
        </FunctionBox>
    )
}

export const TimerFunctionBox: React.FC = () => {
    return (
        <FunctionBox>
            <div>
                <FontAwesomeIcon icon={faStopwatch} size="lg"/>
                <span>Časovač</span>
            </div>
        </FunctionBox>
    )
}