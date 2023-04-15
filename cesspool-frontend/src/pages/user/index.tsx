import AccountSettings from "@components/AccountSettings";
import generateCesspoolTable, { toCesspoolItem, _CesspoolItem } from "@components/CesspoolTable";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import PopupWin from "@components/PopupWin";
import AuthContext from "@context/AuthContext";
import { faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import translate from "@permissions/translate";
import { Cesspool, User } from "@types";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { red } from "../../settings";
import styles from "./styles.module.scss";


const UserPage: React.FC = () => {
    const [account, setAccount] = useState<User|null>(null);
    const [cesspools, setCesspools] = useState<_CesspoolItem[]>([]);
    const [settingsPop, setSettingsPop] = useState<boolean>(false);
    const [deletePop, setDeletePop] = useState<boolean>(false);

    const { pk } = useParams();
    const { user } = React.useContext(AuthContext);

    const AccountDelete = generateDeleteItem<User>();
    const AccountRestore = generateRestoreItem<User>();
    const CesspoolTable = generateCesspoolTable({owner: false, compareWithUser: user?.email, location: true});

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/account/a/" + pk)
             .then(res => setAccount(res.data))
             .catch(err => {});

        axios.get("admin/cesspool/?user=" + pk)
            .then(res => setCesspools(res.data.map(toCesspoolItem)))
            .catch(err => {});
    }

    React.useEffect(fetchData, []);

    return (
        <Page>
             {/* check for permission */}
             {  user && !user.permissions.includes("account.manage_account") && <Navigate to="/" /> }

            <Navigation />

            <div className={styles.header}>
                <h1>
                    { account ? account.email.split("@").at(0) : "..." }
                </h1>

                <div className={styles.tools}>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setSettingsPop(true)} color={ settingsPop ? "white" : undefined } />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                    <FontAwesomeIcon icon={faTrash} color={account && account.delete_at ? red : undefined} onClick={() => setDeletePop(true)} />
                </div>
            </div>

            <div className={styles.about}>
                <span>{ account ? account.groups.map(g => <>{translate(g)} / </>) : "..." }</span>
                <span>{ account && !account.is_active && "Nekativovaný" }</span>
            </div> 

            {
                account && account.groups.includes("client") &&
                <CesspoolTable cesspools={cesspools} />
            }

            {/* {Popup windows} */}
            { account && settingsPop &&
                <PopupWin label="Nastavenia" close={() => setSettingsPop(false)}>
                    <AccountSettings
                        pk={account.pk}
                        email={account.email}
                        groups={account.groups}
                        onUpdate={a => {
                            setAccount(a);
                            setSettingsPop(false);
                        }}
                    />
                </PopupWin>
            }

            {
                deletePop && account &&
                <PopupWin label={ account.delete_at ? "Obnoviť" : "Odstrániť" } close={() => setDeletePop(false)}>
                    {
                        account.delete_at
                        ? <AccountRestore
                            title={"Učet"}
                            url={"admin/account/a/" + account.pk + "/restore"}
                            deleteAt={account.delete_at}
                            onRestore={ctu => {
                                setAccount(ctu);
                                setDeletePop(false);
                            }}
                        />

                        : <AccountDelete 
                            title="Učet"
                            url={"admin/account/a/" + account.pk + "/"}
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

export default UserPage;