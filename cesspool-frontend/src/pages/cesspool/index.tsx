import React, { useState } from "react";
import { Cesspool, CesspoolToUser, SimpleCesspoolToUser } from "@types";
import { useParams } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import { IsAuthenticatedView } from "@permissions/Authenticated";
import Navigation from "@components/Navigation";
import styles from "@pages/cesspool/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSliders, faUsers } from "@fortawesome/free-solid-svg-icons";
import PopupWin from "@components/PopupWin";
import CtuSettings from "@components/CtuSettings";
import CesspoolChart from "@components/CesspoolChart";
import TheCesspoolStatus from "@components/TheCesspoolStatus";
import { TheCesspoolProblemsBox } from "@components/TheCesspoolProblems";
import TheCesspoolUsers from "@components/TheCesspoolUsers";


const CesspoolPage: React.FC = () => {
    const [ctu, setCtu] = useState<CesspoolToUser|null>(null);
    const [ctuSettingsPop, setCtuSettingsPop] = useState<boolean>(false);
    const [ctuUsersPop, setCtuUsersPop] = useState<boolean>(false);

    const { code } = useParams();
    const axios = useAxios();

    const fetchData = () => {
        axios.get("cesspool/c/" + code)
             .then(res => setCtu(res.data))
             .catch(err => {})
    };

    const getProblems = (): string[] => {
        if (ctu && ctu.cesspool.record && ctu.contact_at_level <= ctu.cesspool.record.level_percent)
            return [...ctu.cesspool.problems, "Vysoka hladina odpadu."];
        return ctu ? ctu.cesspool.problems : [];
    };

    React.useEffect(fetchData, []);

    return (
        <IsAuthenticatedView>
            <Navigation />

            <div className={styles.header}>
                <h1>
                    { ctu !== null 
                        ? ctu.title !== null ? ctu.title : ctu.cesspool.code
                        : ":.." }
                </h1>

                <div className={styles.tools}>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setCtuSettingsPop(true)} color={ ctuSettingsPop ? "white" : undefined } />
                    { ctu && ctu.is_super_owner && <FontAwesomeIcon icon={faUsers} onClick={() => setCtuUsersPop(true)} color={ ctuUsersPop ? "white" : undefined } /> }
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                </div>
            </div>

            { ctu && ctu.is_super_owner && 
                <p className={styles.help}>
                    Ako správca žumpy možte pridať použivateľov, kliknite na ikonu uživatelia.
                </p> 
            }

            <div className={styles.infoPanel}>
                { ctu && ctu.cesspool.record &&
                    <>
                        <TheCesspoolStatus
                            levelPercent={ctu.cesspool.record.level_percent}
                            levelMeter={ctu.cesspool.record.level_m}
                            batteryVolt={ctu.cesspool.record.battery_voltage}
                            battery={ctu.cesspool.record.battery}
                        />
                        
                        <TheCesspoolProblemsBox problems={ getProblems() } />
                    </>
                }
            </div>

            {/* popups */}
            {
                ctuSettingsPop && ctu &&
                <PopupWin label="Nastavenia" close={() => setCtuSettingsPop(false)}>
                    <CtuSettings 
                        pk={ctu.pk} 
                        code={ctu.cesspool.code}
                        title={ctu.title}
                        contact_at_level={ctu.contact_at_level}
                        onUpdate={(ctu) => {
                            setCtu(ctu);
                            setCtuSettingsPop(false);
                        }}
                    />
                </PopupWin>
            }

            { 
                ctuUsersPop && ctu && ctu.cesspool_users &&
                <PopupWin label="Použivatelia" close={() => setCtuUsersPop(false)}>
                    <TheCesspoolUsers max={ctu.cesspool.subscription.max_owners} code={ctu.cesspool.code} users={ctu.cesspool_users} onUpdate={(ctu) => {
                        setCtu(ctu);
                        setCtuUsersPop(false);
                    }} />
                </PopupWin>
            }

            { ctu && ctu.cesspool.record
                ? <CesspoolChart code={ctu.cesspool.code} /> 
                : <div className={styles.noRecords}>Zatial žiadne záznamy...</div>
            }

        </IsAuthenticatedView>
    )
}

export default CesspoolPage;