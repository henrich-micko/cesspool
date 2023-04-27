import AccountSettings from "@components/AccountSettings";
import CesspoolBox from "@components/CesspoolBox";
import TheCesspoolMin from "@components/CesspoolBox/min";
import generateCesspoolTable, { toCesspoolItem, _CesspoolItem } from "@components/CesspoolTable";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import ItemWrapper from "@components/ItemWrapper";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import PopupWin from "@components/PopupWin";
import AuthContext from "@context/AuthContext";
import { faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import translate from "@permissions/translate";
import { Cesspool, City, User } from "@types";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { red } from "../../settings";
import styles from "./styles.module.scss";


const AccountDelete = generateDeleteItem<User>();
const AccountRestore = generateRestoreItem<User>();


interface _UserItems {
    pk: number;
    onClick(id: string): void;
}


export const UserCesspools: React.FC<_UserItems> = (props) => {
    const [cesspools, setCesspools] = useState<Cesspool[]>([]);
    const [redirectTo, setRedirectTo] = useState<string|null>(null);

    const axios = useAxios()

    React.useEffect(() => {
        axios.get("admin/cesspool?user=" + props.pk)
             .then(res => setCesspools(res.data))
             .catch(err => {});
    }, [props.pk]);

    return (
        <ItemWrapper>
            { redirectTo !== null && <Navigate to={redirectTo} /> }
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
        </ItemWrapper>
    );
};


const UserPage: React.FC = () => {
    const [account, setAccount] = useState<User|null>(null);
    const [settingsPop, setSettingsPop] = useState<boolean>(false);
    const [deletePop, setDeletePop] = useState<boolean>(false);
    const [redirectTo, setRedirectTo] = useState<string|null>(null);

    const { pk } = useParams();
    const { user } = React.useContext(AuthContext);

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/account/a/" + pk)
             .then(res => setAccount(res.data))
             .catch(err => {});
    };

    React.useEffect(fetchData, []);

    return (
        <Page>
            {/* check redirection */}
            { redirectTo !== null && <Navigate to={redirectTo} /> }

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

            { account && 
                <>
                    { account.groups.includes("client") && <UserCesspools pk={account.pk} onClick={code => setRedirectTo("/admin/cesspool/" + code)} /> } 
                </>
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