import React, { useState } from "react";
import { IsAuthenticatedView } from "@permissions/Authenticated";
import Navigation from "@components/Navigation";
import { CesspoolToUser } from "@types";
import useAxios from "@hooks/useAxios";
import CesspoolBox from "@components/CesspoolBox";
import styles from "@pages/cesspoolsMenu/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";


const CesspoolMenuPage: React.FC = () => {
    const [ctus, setCtus] = useState<CesspoolToUser[]>([]);
    const [redirectCode, setRedirectCode] = useState<string|null>(null);

    const axios = useAxios();
    
    const fetchData = () => {
        axios.get("cesspool/")
             .then(res => setCtus(res.data))
             .catch(err => {});
    }

    React.useEffect(fetchData, [])

    return (
        <IsAuthenticatedView>
            { redirectCode !== null && <Navigate to={"/cesspool/" + redirectCode} /> }
            
            <Navigation />

            <div className={styles.header}>
                <p className={styles.help}>
                    Zariadenia ktoré Vám su pridelene, <Link to="/contact/"> chybaju vam dáke?</Link>
                </p>
                <FontAwesomeIcon className={styles.refresh} icon={faRefresh} onClick={fetchData}/>
            </div>

            <div className={styles.cesspoolsWrapper}>
                {ctus.map((ctu) => 
                    <CesspoolBox 
                        pk={ctu.pk} 
                        code={ctu.cesspool.code} 
                        record={ctu.cesspool.record}
                        title={ctu.title}
                        onClick={(code) => setRedirectCode(code)}
                    />
                )}
            </div>
        </IsAuthenticatedView>
    )
}

export default CesspoolMenuPage;