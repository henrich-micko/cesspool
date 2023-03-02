import React, { useState } from "react";
import { Cesspool, CesspoolToUser } from "@types";
import { useParams } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import { IsAuthenticatedView } from "@permissions/Authenticated";
import Navigation from "@components/Navigation";
import styles from "@pages/cesspool/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSliders } from "@fortawesome/free-solid-svg-icons";
import PopupWin from "@components/PopupWin";
import CtuSettings from "@components/CtuSettings";


const CesspoolPage: React.FC = () => {
    const [ctu, setCtu] = useState<CesspoolToUser|null>(null);
    const [ctuSettings, setCtuSettings] = useState<boolean>(false);

    const { code } = useParams();
    const axios = useAxios();

    const fetchData = () => {
        axios.get("cesspool/" + code)
             .then(res => setCtu(res.data))
             .catch(err => {})
    }

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
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData}/>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setCtuSettings(true)} />
                </div>
            </div>

            {/* popups */}
            {
                ctuSettings && ctu &&
                <PopupWin label="Nastavenia" close={() => setCtuSettings(false)}>
                    <CtuSettings 
                        pk={ctu.pk} 
                        code={ctu.cesspool.code}
                        title={ctu.title}
                        contact_at_level={ctu.contact_at_level}
                        onUpdate={setCtu}
                    />
                </PopupWin>
            }

        </IsAuthenticatedView>
    )
}

export default CesspoolPage;