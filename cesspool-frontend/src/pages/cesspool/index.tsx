import React, { useState } from "react";
import { Cesspool } from "@types";
import { Navigate, useParams } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import Navigation from "@components/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faFlag, faMoneyCheck, faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import PopupWin from "@components/PopupWin";
import CesspoolChart from "@components/CesspoolChart";
import TheCesspoolStatus from "@components/TheCesspoolStatus";
import { TheCesspoolProblemsBox } from "@components/TheCesspoolProblems";
import AuthContext from "@context/AuthContext";
import Page, { HelpText, IconWrapper, LinkWrapper, PageHeader, SpaceBetweenWrapper, Title } from "@components/Page";
import CesspoolSettings from "@components/CesspoolSettings";
import SubCalendar from "@components/SubCalendar";
import { red } from "../../settings";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import { getCity } from "../../formats";
import { Link } from "react-router-dom";
import { CesspoolDebugModeTurnOff, CesspoolDebugModeTurnOn, GenerateCesspoolRecords } from "@components/CesspoolDebugMode";
import AccountLink from "@components/AccountLink";


const CesspoolDelete = generateDeleteItem<Cesspool>();
const CesspoolRestore = generateRestoreItem<Cesspool>();


const InfoPanelStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: "1.5em",
    paddingTop: "1.5em",
    paddingBottom: "1.5em",
}


const CesspoolAdminPage: React.FC = () => {
    const [cesspool, setCesspool] = useState<Cesspool|null>(null);

    const [cesspoolSettingsPop, setCesspoolSettingsPop] = useState<boolean>(false);
    const [cesspoolSubPop, setCesspoolSubPop] = useState<boolean>(false);
    const [cesspoolDeletePop, setCesspoolDeletePop] = useState<boolean>(false);
    const [cesspoolDebugPop, setCesspoolDebugPop] = useState<boolean>(false);
    const [cesspoolGenerateRecordsPop, setCesspoolGenerateRecordsPop] = useState<boolean>(false);

    const { code } = useParams();
    const { user } = React.useContext(AuthContext);

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/cesspool/c/" + code)
             .then(res => setCesspool(res.data))
             .catch(err => {})
    }

    React.useEffect(fetchData, []);

    return (
        <Page>
             {/* check for permission */}
             {  user && !user.permissions.includes("cesspool.manage_cesspool") && <Navigate to="/" /> }


            <Navigation />

            <PageHeader>
                <Title>{ cesspool ? cesspool.code : "..." }</Title>

                <IconWrapper>
                    <FontAwesomeIcon icon={faMoneyCheck} onClick={() => setCesspoolSubPop(true)} />
                    <FontAwesomeIcon icon={faSliders} onClick={() => setCesspoolSettingsPop(true)} />
                    <FontAwesomeIcon icon={faBug} color={cesspool?.debug_mode ? red : undefined} onClick={() => setCesspoolDebugPop(true)} />
                    { 
                        cesspool?.debug_mode && 
                        <FontAwesomeIcon icon={faFlag} onClick={() => setCesspoolGenerateRecordsPop(true)} />
                    }
                    <FontAwesomeIcon icon={faTrash} onClick={() => setCesspoolDeletePop(true)} />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                </IconWrapper>
            </PageHeader>

            <SpaceBetweenWrapper>
                <HelpText>
                    { cesspool ? <span>{cesspool.about}</span> : "..." }
                </HelpText>

                <LinkWrapper>
                    { cesspool?.city && <Link to={"/admin/city/" + cesspool?.city}>{ cesspool ? getCity(cesspool.city) : "..." }</Link>}
                    { cesspool && cesspool.created_by && <span>Vytvoril <AccountLink {...cesspool.created_by} /></span> }
                    { cesspool && cesspool.owner && <span>Vlastní <AccountLink {...cesspool.owner} /></span> }
                </LinkWrapper>
            </SpaceBetweenWrapper>

            <div style={InfoPanelStyle}>
                { 
                    cesspool && cesspool.record &&
                    <>
                        <TheCesspoolStatus
                            levelPercent={cesspool.record.level_percent}
                            levelMeter={cesspool.record.level_m}
                            batteryVolt={cesspool.record.battery_voltage}
                            battery={cesspool.record.battery} />
                        <TheCesspoolProblemsBox
                            problems={cesspool.problems} />
                    </>
                }
            </div>

            { 
                cesspool && cesspool.record
                ? <CesspoolChart code={cesspool.code} mqttMessages={cesspool.debug_mode} />
                : <div>Zatial žiadne záznamy...</div>
            }

            {/* popups */}
            {
                cesspoolSettingsPop && cesspool &&
                <PopupWin label="Nastavenia" close={() => setCesspoolSettingsPop(false)}>
                    <CesspoolSettings
                        pk={cesspool.pk}
                        code={cesspool.code}
                        city={cesspool.city}
                        owner={cesspool.owner ? cesspool.owner.email : null}
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

            {
                cesspool && cesspoolGenerateRecordsPop &&
                <PopupWin label="Generovať záznamy" close={() => setCesspoolGenerateRecordsPop(false)}>
                    <GenerateCesspoolRecords code={cesspool.code} onSubmit={() => setCesspoolGenerateRecordsPop(false)} />
                </PopupWin>
            }

            {
                cesspool && cesspoolDebugPop &&
                <PopupWin label={cesspool.debug_mode ? "Vypnuť debug mode" : "Zanpuť debug mode"} close={() => setCesspoolDebugPop(false)}>
                    {
                        cesspool.debug_mode === false
                        ? <CesspoolDebugModeTurnOn code={cesspool.code} onUpdate={c => { setCesspool(c); setCesspoolDebugPop(false) }} />
                        : <CesspoolDebugModeTurnOff code={cesspool.code} onUpdate={c => { setCesspool(c); setCesspoolDebugPop(false) }} />
                    }
                </PopupWin>
            }

            <br />
        </Page>
    )
}

export default CesspoolAdminPage;
