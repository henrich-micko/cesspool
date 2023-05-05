import Page from "@components/Page";
import AuthContext from "@context/AuthContext";
import { faPrint, faRefresh, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { Cesspool, City } from "@types";
import React from "react";
import Navigation from "@components/Navigation";
import styles from "./styles.module.scss";
import { Navigate, useParams } from "react-router-dom";
import PopupWin from "@components/PopupWin";
import CesspoolExportCSV from "@components/CesspoolExportToCSV";
import ItemWrapper from "@components/ItemWrapper";
import TheCesspoolMin from "@components/CesspoolBox/min";


const CityPage: React.FC = () => {
    const [city, setCity] = React.useState<City|null>(null);
    const [exportPop, setExportPop] = React.useState<boolean>(false);
    const [cesspools, setCesspools] = React.useState<Cesspool[]>([]);


    const { user } = React.useContext(AuthContext);
    const { district, title } = useParams();
    const axios = useAxios();
    
    const fetchItems = () => {
        axios.get("/location/city/" + district + "/" + title)
             .then(res => setCity(res.data))
             .catch(err => {});

        axios.get("admin/cesspool?city=" + district + "/" + title)
            .then(res => setCesspools(res.data))
            .catch(err => {});
    };

    React.useEffect(fetchItems, []);

    return (
        <Page>
            {/* check for permission */}
            { user === null || !user.groups.includes("city_admin") && <Navigate to="/" /> }        
        
            <Navigation />

            <div className={styles.header}>
                <h1>{city?.title}</h1>
            
                <div className={styles.tools}>
                    <FontAwesomeIcon icon={faPrint} onClick={() => setExportPop(true)} />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchItems} />
                </div>
            </div>

            <div className={styles.about}>
                <span>V okrese {city?.district}</span>
            </div>

            {cesspools &&
                <ItemWrapper>
                    { cesspools.map((item, index) => 
                        <TheCesspoolMin
                            pk={item.pk}
                            code={item.code}
                            delete={item.delete_at !== null}
                            debugMode={item.debug_mode}
                            owner={item.owner?.email}
                            onClick={() => ("/admin/cesspool/" + item.code)}
                        />
                    )}
                </ItemWrapper>
            }

            {
                exportPop && city &&
                <PopupWin label="Exporotovať dáta" close={() => setExportPop(false)}>
                    <CesspoolExportCSV district={city.district} city={city.title} />
                </ PopupWin>
            }
        </Page>
    );
}

export default CityPage;