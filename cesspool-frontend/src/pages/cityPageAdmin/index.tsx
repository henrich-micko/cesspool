import { _CesspoolItem } from "@components/CesspoolTable";
import CitySettings from "@components/CitySettings";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import Navigation from "@components/Navigation";
import Page, { HelpText, IconWrapper, LinkWrapper, PageHeader, SpaceBetweenWrapper, Title } from "@components/Page";
import PopupWin from "@components/PopupWin";
import AuthContext from "@context/AuthContext";
import { faPlus, faPrint, faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { Cesspool, City } from "@types";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { glass, red } from "../../settings";
import ItemWrapper from "@components/ItemWrapper";
import AccountLink from "@components/AccountLink";
import CesspoolExportCSV from "@components/CesspoolExportToCSV";
import CesspoolBox from "@components/CesspoolBox";
import TheBox, { TheBoxMin } from "@components/TheBox";
import CesspoolCreate from "@components/CesspoolCreate";


const CityPageAdmin: React.FC = () => {
    const [item, setItem] = useState<City|null>(null);
    const [cesspools, setCesspools] = useState<Cesspool[]>([]);
    
    const [settingsPop, setSettingsPop] = useState<boolean>(false);
    const [deletePop, setDeletePop] = useState<boolean>(false);
    const [redirectTo, setRedirectTo] = useState<string|null>(null);
    const [exportPop, setExportPop] = React.useState<boolean>(false);
    const [createCesspoolPop, setCreateCesspoolPop] = React.useState<boolean>(false);

    const { district, title } = useParams();
    const { user } = React.useContext(AuthContext);

    const CityDelete = generateDeleteItem<City>();
    const CityRestore = generateRestoreItem<City>();

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/location/city/c/" + district + "/" + title)
             .then(res => setItem(res.data))
             .catch(err => {});

        axios.get("admin/cesspool?city=" + district + "/" + title)
             .then(res => setCesspools(res.data))
             .catch(err => {});
    };
    
    React.useEffect(fetchData, []);

    return (
        <Page>
            {/* check for permission */}
            {  user && !user.permissions.includes("account.manage_account") && <Navigate to="/" /> }

            { redirectTo !== null && <Navigate to={redirectTo} /> }

            <Navigation />

            <PageHeader>
                <Title>
                    { item ? item.title : "..." }
                </Title>

                <IconWrapper>
                    <FontAwesomeIcon icon={faPrint} onClick={() => setExportPop(true)} />
                    <FontAwesomeIcon icon={faSliders} onClick={() => setSettingsPop(true)} color={ settingsPop ? "white" : undefined } />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                    <FontAwesomeIcon icon={faTrash} color={item && item.delete_at ? red : undefined} onClick={() => setDeletePop(true)} />
                </IconWrapper>
            </PageHeader>

            <SpaceBetweenWrapper>
                <HelpText>V okrese { item?.district }</HelpText>
                <LinkWrapper>
                    <HelpText>{ item && item.manager ? <>Manžér <AccountLink {...item.manager} /></> : "Bez manažéra" }</HelpText>
                    <HelpText>{ item && item.created_by && <>Vytvoril <AccountLink {...item.created_by} /></> }</HelpText>
                </LinkWrapper>
            </SpaceBetweenWrapper> 

            {
                <ItemWrapper>
                    { cesspools.map((item, index) => 
                        <CesspoolBox
                            pk={item.pk}
                            code={item.code}
                            record={item.record}
                            problems={item.problems}
                            city={item.city}
                            about={item.about}
                            deleteAt={item.delete_at}
                            debugMode={item.debug_mode}
                            onClick={() => setRedirectTo("/admin/cesspool/" + item.code)}
                        />
                    )}

                    <TheBoxMin style={{ width: "auto", height: "1.5em", cursor: "pointer", marginTop: "2em", }} onClick={() => setCreateCesspoolPop(true)}>
                        <SpaceBetweenWrapper style={{ alignItems: "center" }}>
                            <HelpText>Vytvoriť novú žumpu</HelpText>
                            <FontAwesomeIcon icon={faPlus} color={glass} />
                        </SpaceBetweenWrapper>
                    </TheBoxMin>

                </ItemWrapper>
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

            {
                exportPop && item &&
                <PopupWin label="Exporotovať dáta" close={() => setExportPop(false)}>
                    <CesspoolExportCSV district={item.district} city={item.title} />
                </ PopupWin>
            }

            {
                createCesspoolPop && item &&
                <PopupWin label="Vytvoriť žumpu" close={() => setCreateCesspoolPop(false)}>
                    <CesspoolCreate
                        defaultCity={title}
                        defaultDistrict={district}
                        onCreate={c => { setCesspools(o => [...o, c]); setCreateCesspoolPop(false) }} />
                </ PopupWin>
            }
        </Page>
    )
}

export default CityPageAdmin;