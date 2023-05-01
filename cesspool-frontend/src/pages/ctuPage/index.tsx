import React, { useState } from "react";
import { CesspoolToUser } from "@types";
import { useParams } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import { IsAuthenticatedView } from "@permissions/Authenticated";
import Navigation from "@components/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSliders, faUsers } from "@fortawesome/free-solid-svg-icons";
import PopupWin from "@components/PopupWin";
import CtuSettings from "@components/CtuSettings";
import CesspoolChart from "@components/CesspoolChart";
import TheCesspoolStatus from "@components/TheCesspoolStatus";
import { TheCesspoolProblemsBox } from "@components/TheCesspoolProblems";
import TheCesspoolUsers from "@components/TheCesspoolUsers";
import { HelpText, IconWrapper, PageHeader, Title } from "@components/Page";
import styled from "styled-components";


const InfoPanel = styled.div`
    display: grid;
    grid-gap: 1rem;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    grid-template-columns: repeat(2, minmax(200px, 1fr));

    @media (max-width: 700px) {
        grid-template-columns: repeat(1, minmax(200px, 1fr));
    }
}
`;


const CtuPage: React.FC = () => {
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

            <PageHeader>
                <Title>
                    { ctu !== null ? ctu.title !== null ? ctu.title : ctu.cesspool.code : ":.." }
                </Title>

                <IconWrapper>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setCtuSettingsPop(true)} />
                    { ctu && ctu.is_super_owner && <FontAwesomeIcon icon={faUsers} onClick={() => setCtuUsersPop(true)} /> }
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                </IconWrapper>
            </PageHeader>

            { 
                ctu && ctu.is_super_owner && 
                <HelpText>
                    Ako správca žumpy možte pridať použivateľov, kliknite na ikonu uživatelia.
                </HelpText>
            }

            <InfoPanel>
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
            </InfoPanel>

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

            { 
                ctu && ctu.cesspool.record
                ? <CesspoolChart code={ctu.cesspool.code} /> 
                : <span>Zaťial bez záznamov</span>
            }

        </IsAuthenticatedView>
    )
}

export default CtuPage;