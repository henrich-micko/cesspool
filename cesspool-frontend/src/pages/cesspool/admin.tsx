import React, { useState } from "react";
import { Cesspool } from "@types";
import { Navigate, useParams } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import Navigation from "@components/Navigation";
import styles from "@pages/cesspool/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck, faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import PopupWin from "@components/PopupWin";
import CesspoolChart from "@components/CesspoolChart";
import TheCesspoolStatus from "@components/TheCesspoolStatus";
import { TheCesspoolProblemsBox } from "@components/TheCesspoolProblems";
import AuthContext from "@context/AuthContext";
import Page from "@components/Page";
import CesspoolSettings from "@components/CesspoolSettings";
import SubCalendar from "@components/SubCalendar";
import { red } from "../../settings";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import { getCity } from "../../formats";
import { Link } from "react-router-dom";


const CesspoolDelete = generateDeleteItem<Cesspool>();
const CesspoolRestore = generateRestoreItem<Cesspool>();


const CesspoolAdminPage: React.FC = () => {
    const [cesspool, setCesspool] = useState<Cesspool|null>(null);
    
    const [cesspoolSettingsPop, setCesspoolSettingsPop] = useState<boolean>(false);
    const [cesspoolSubPop, setCesspoolSubPop] = useState<boolean>(false);
    const [cesspoolDeletePop, setCesspoolDeletePop] = useState<boolean>(false);

    const { code } = useParams();
    const { user } = React.useContext(AuthContext);

    const axios = useAxios();
    const today = new Date();

    const fetchData = () => {
        axios.get("admin/cesspool/c/" + code)
             .then(res => setCesspool(res.data))
             .catch(err => {})
    }

    const isSubExpired = (): boolean => {
        if (!cesspool || !cesspool.subscription_expiration_date) 
            return false;

        const splitedSubDate = cesspool.subscription_expiration_date.split("-");
        const subYear = splitedSubDate.at(0);
        const subMonth = splitedSubDate.at(1);
        const subDate = splitedSubDate.at(2);

        if (!subYear || !subMonth || !subDate)
            return false;

        return (
            today.getFullYear() > Number(subYear) && 
            today.getMonth() > Number(subMonth) &&
            today.getDate() > Number(subDate)
        )
    }

    React.useEffect(fetchData, []);

    return (
        <Page>
             {/* check for permission */}
             {  user && !user.permissions.includes("cesspool.manage_cesspool") && <Navigate to="/" /> }


            <Navigation />

            <div className={styles.header}>
                <h1>
                    { cesspool ? cesspool.code : "..." }
                </h1>

                <div className={styles.tools}>
                    <FontAwesomeIcon icon={faMoneyCheck} onClick={() => setCesspoolSubPop(true)} 
                        color={ cesspoolSubPop ? "white" : cesspool?.subscription_expiration_date && isSubExpired() ? red : undefined} />
                    <FontAwesomeIcon icon={faSliders} onClick={() => setCesspoolSettingsPop(true)} color={ cesspoolSettingsPop ? "white" : undefined } />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                    <FontAwesomeIcon icon={faTrash} color={cesspool && cesspool.delete_at ? red : undefined} onClick={() => setCesspoolDeletePop(true)} />
                </div>
            </div>

            <div className={styles.help}>
                <span>{ cesspool ? cesspool.about : "..." }</span>
                <Link to={"/admin/city/" + cesspool?.city}>{ cesspool ? getCity(cesspool.city) : "..." }</Link>
            </div> 

            <div className={styles.infoPanel}>
                { cesspool && cesspool.record &&
                    <>
                        <TheCesspoolStatus 
                            levelPercent={cesspool.record.level_percent} 
                            battery={cesspool.record.battery} 
                        /> 
                        
                        <TheCesspoolProblemsBox
                            problems={cesspool.problems}
                        />
                    </>
                }
            </div>

            {/* popups */}
            {
                cesspoolSettingsPop && cesspool &&
                <PopupWin label="Nastavenia" close={() => setCesspoolSettingsPop(false)}>
                    <CesspoolSettings 
                        pk={cesspool.pk} 
                        code={cesspool.code}
                        city={cesspool.city}
                        owner={cesspool.owner}
                        subPk={cesspool.subscription.pk}
                        about={cesspool.about}
                        onUpdate={(ctu) => {
                            setCesspool(ctu);
                            setCesspoolSettingsPop(false);
                        }}
                    />
                </PopupWin>
            }

            {
                cesspoolSubPop && cesspool &&
                <PopupWin label="Koniec predplatneho" close={() => setCesspoolSubPop(false)}>
                    <SubCalendar 
                        value={cesspool.subscription_expiration_date} 
                        code={cesspool.code} 
                        setCesspool={(c) => { setCesspool(c); setCesspoolSubPop(false)}}
                    />
                </PopupWin>
            }

            {
                cesspoolDeletePop && cesspool &&
                <PopupWin label={ cesspool.delete_at ? "Obnoviť" : "Odstrániť" } close={() => setCesspoolDeletePop(false)}>
                    {
                        cesspool.delete_at
                        ?<CesspoolRestore
                            title={"Žumpa"}
                            url={"admin/cesspool/c/" + code + "/restore"}
                            deleteAt={cesspool.delete_at}
                            onRestore={ctu => {
                                setCesspool(ctu);
                                setCesspoolDeletePop(false);
                            }}
                        />

                        :<CesspoolDelete 
                            title="Žumpu"
                            url={"admin/cesspool/c/" + code}
                            onDelete={(ctu) => {
                                fetchData();
                                setCesspoolDeletePop(false);
                            }} />
                        }
                </PopupWin>
            }

            { cesspool && cesspool.record
                ? <CesspoolChart code={cesspool.code} /> 
                : <div className={styles.noRecords}>Zatial žiadne záznamy...</div>
            }

        </Page>
    )
}

export default CesspoolAdminPage;