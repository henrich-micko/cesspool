import React from "react"

import styles from "@styles/components/home/aboutBoard.module.scss"
import { ChartsFunctionBox, EmailFunctionBox, TimerFunctionBox } from "./FuntionBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faLink, faUser } from "@fortawesome/free-solid-svg-icons"
import ChartLine from "@assets/chartline.svg"

const AboutBoard: React.FC = () => {
    return (
        <div className={styles.aboutBoard}>
            <h1>Žumpomer</h1>

            <div className={styles.functionWrapper}>
                <ChartsFunctionBox />
                <EmailFunctionBox />
                <TimerFunctionBox />
            </div>

            <div className={styles.getBox}>
                <span>Mali by ste zaujem o naše zariadenie ?</span>

                <ul>
                    <li>
                        <FontAwesomeIcon icon={faLink} className={styles.icon}/>
                        <span>Vyplnte formulár na našej stránke</span>
                    </li>

                    <li>
                        <FontAwesomeIcon icon={faComment} className={styles.icon}/>
                        <span>Čo najrychlejsie sa vám ozveme</span>
                    </li>

                    <li>
                        <FontAwesomeIcon icon={faUser} className={styles.icon}/>
                        <span>Po inštalaci vám bude pridelený učet</span>
                    </li>
                </ul>
            </div>

            <img className={styles.chartSvg} src={ChartLine} alt="" />
        </div>
    )
}

export default AboutBoard