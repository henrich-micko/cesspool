import generateCesspoolTable, { toCesspoolItem, _CesspoolItem } from "@components/CesspoolTable";
import CitySettings from "@components/CitySettings";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import PopupWin from "@components/PopupWin";
import AuthContext from "@context/AuthContext";
import { faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { Cesspool, City, User } from "@types";
import { getName } from "../../formats";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { red } from "../../settings";
import styles from "./styles.module.scss";


const CityPage: React.FC = () => {
    const [item, setItem] = useState<City|null>(null);
    const [cesspools, setCesspools] = useState<_CesspoolItem[]>([]);
    const [settingsPop, setSettingsPop] = useState<boolean>(false);
    const [deletePop, setDeletePop] = useState<boolean>(false);

    const { district, city } = useParams();
    const { user } = React.useContext(AuthContext);

    const CityDelete = generateDeleteItem<City>();
    const CityRestore = generateRestoreItem<City>();
    const CesspoolTable = generateCesspoolTable({isOwner: false, location: false});

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/location/city/c/" + district + "/" + city)
             .then(res => setItem(res.data))
             .catch(err => {});

        axios.get("admin/cesspool?city=" + district + "/" + city)
             .then(res => setCesspools(res.data.map(toCesspoolItem)))
             .catch(err => {});
    };
    
    React.useEffect(fetchData, []);

    return (
        <Page>
             {/* check for permission */}
             {  user && !user.permissions.includes("account.manage_account") && <Navigate to="/" /> }

            <Navigation />

            <div className={styles.header}>
                <h1>
                    { item ? item.title : "..." }
                </h1>

                <div className={styles.tools}>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setSettingsPop(true)} color={ settingsPop ? "white" : undefined } />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                    <FontAwesomeIcon icon={faTrash} color={item && item.delete_at ? red : undefined} onClick={() => setDeletePop(true)} />
                </div>
            </div>

            <div className={styles.about}>
                <span>V okrese { item?.district }</span>
                <span>{ item && item.manager ? getName(item.manager) : "Bez manažéra" }</span>
            </div> 

            {
                <CesspoolTable cesspools={cesspools} />
            }

            {/* {Popup windows} */}
            { item && settingsPop &&
                <PopupWin label="Nastavenia" close={() => setSettingsPop(false)}>
                    <CitySettings
                        manager={item.manager}
                        district={item.district}
                        city={item.title}
                        onUpdate={(city: City) => {
                            setItem(city);
                            setSettingsPop(false);
                        }}
                    />
                </PopupWin>
            }

            {
                deletePop && item &&
                <PopupWin label={ item.delete_at ? "Obnoviť" : "Odstrániť" } close={() => setDeletePop(false)}>
                    {
                        item.delete_at
                        ? <CityRestore
                            title={"Učet"}
                            url={"admin/location/city/c/" + item.district + "/" + item.title + "/restore"}
                            deleteAt={item.delete_at}
                            onRestore={i => {
                                setItem(i);
                                setDeletePop(false);
                            }}
                        />

                        : <CityDelete 
                            title="Učet"
                            url={"admin/location/city/c/" + item.district + "/" + item.title}
                            onDelete={account => {
                                fetchData();
                                setDeletePop(false);
                            }} 
                        />
                    }
                </PopupWin>
            }
        </Page>
    )
}

export default CityPage;