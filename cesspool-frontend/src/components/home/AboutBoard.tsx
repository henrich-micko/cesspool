import React from "react"

import styles from "@styles/components/home/aboutBoard.module.scss"
import { ChartsFunctionBox, EmailFunctionBox, TimerFunctionBox } from "./FuntionBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faColonSign, faComment, faLink, faSign, faSignIn, faUser } from "@fortawesome/free-solid-svg-icons"
import ChartLine from "@assets/chartline.svg"
import useIsMobile, { useMaxWidth } from "@hooks/useIsMobile"

interface Props {
    signInClick(): void
}

const AboutBoard: React.FC<Props> = (props) => {
    const viewChart = !useMaxWidth("1230px")
    const isMobile = useIsMobile()

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

            {viewChart && <img className={styles.chartSvg} src={ChartLine} alt="" />}

            {isMobile && 
                <div className={styles.footer}>
                    <div onClick={props.signInClick}>
                        <FontAwesomeIcon
                            className={styles.icon}
                            icon={faUser}
                            size={"2x"}
                        />
                        <span>Prihlasiť sa ?</span>
                    </div>
                </div>
            }

        </div>
    )
}

export default AboutBoard