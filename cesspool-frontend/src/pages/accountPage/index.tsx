import { AccountContactLink } from "@components/AccountLink";
import AccountSettings from "@components/AccountSettings";
import { _CesspoolItem } from "@components/CesspoolTable";
import generateDeleteItem, { generateRestoreItem } from "@components/DeleteItem";
import ItemWrapper from "@components/ItemWrapper";
import Navigation from "@components/Navigation";
import Page, { HelpText, IconWrapper, PageHeader, SpaceBetweenWrapper, Title, LinkWrapper } from "@components/Page";
import PopupWin from "@components/PopupWin";
import { TheBoxMin } from "@components/TheBox";
import TheTable from "@components/TheTable";
import AuthContext from "@context/AuthContext";
import { faRefresh, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { useMaxWidth } from "@hooks/useIsMobile";
import translate from "@permissions/translate";
import { Cesspool, City, CreatedByItem, User } from "@types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigate, useParams } from "react-router-dom";
import { red } from "../../settings";


const AccountDelete = generateDeleteItem<User>();
const AccountRestore = generateRestoreItem<User>();


interface _AccountRelatedItems {
    pk: number;
}


export const AccountRelatedCesspools: React.FC<_AccountRelatedItems> = (props) => {
    const [items, setItems] = useState<Cesspool[]>([]);
    const isSmall = useMaxWidth("1000px");

    const axios = useAxios()

    React.useEffect(() => {
        axios.get("admin/cesspool?user=" + props.pk)
             .then(res => setItems(res.data))
             .catch(err => {});
    }, [props.pk]);

    return (
        <TheBoxMin style={{ width: "100%", padding: 0, marginTop: "2em" }}>
            <TheTable>
                <tr>
                    <th>Pridelený ku žumpe</th>
                    {!isSmall && <th>Lokacia</th> }
                    <th>Je vlastnikom</th>
                </tr>
                
                <> {
                    items.map(item => 
                        <tr>
                            <th><Link to={"/admin/cesspool/"+item.code} style={{ color: "inherit" }}>{item.code}</Link></th>
                            {!isSmall && <th>{item.city}</th>}
                            <th>{item.owner?.pk === props.pk ? "Ano" : "Nie"}</th>
                        </tr>
                    )
                } </>
            </TheTable>
        </TheBoxMin>
    );
};


export const AccountRelatedCitys: React.FC<_AccountRelatedItems> = (props) => {
    const [items, setItems] = useState<City[]>([]);

    const axios = useAxios()

    React.useEffect(() => {
        axios.get("admin/location/city?manager=" + props.pk)
             .then(res => setItems(res.data))
             .catch(err => {});
    }, [props.pk]);

    return (
        <TheBoxMin style={{ width: "100%", padding: 0, marginTop: "2em" }}>
            <TheTable>
                <tr>
                    <th>Manažér mesta</th>
                    <th>Okres</th>
                </tr>
                
                <> {
                    items.map(item => 
                        <tr>
                            <th><Link to={"/admin/city/"+item.district+"/"+item.title} style={{ color: "inherit" }}>{item.title}</Link></th>
                            <th>{item.district}</th>
                        </tr>
                    )
                } </>
            </TheTable>
        </TheBoxMin>
    );
};


const AccountCreatedItems: React.FC<_AccountRelatedItems> = (props) => {
    const [items, setItems] = React.useState<CreatedByItem[]>([]);
    
    const axios = useAxios();

    React.useEffect(() => {
        axios.get("admin/account/a/"+props.pk+"/created/")
             .then(res => setItems(res.data))
             .catch(err => {});
    }, []);

    const getModelName = (model: string): string => {
        switch (model) {
            case "cesspool.Cesspool": return "Žumpa";
            case "location.City": return "Mesto";
            case "account.UserAccount": return "Použivateľ";
        };
        return model;
    }

    const getLinkForItem = (item: CreatedByItem): string => {
        switch (item.model) {
            case "cesspool.Cesspool": return "/admin/cesspool/"+item.title;
            case "location.City": return "/admin/city/"+item.title;
            case "account.UserAccount": return "/admin/account/"+item.pk;
        };
        return "/xxx";
    };

    return (
        <TheBoxMin style={{ width: "100%", padding: 0, marginTop: "2em", overflowY: "scroll", overflowX: "hidden", maxHeight: "20em" }}>
            <TheTable>
                <tr>
                    <th>Vytvoril</th>
                    <th>Typ</th>
                </tr>
                
                <> {
                    items.map(item => 
                        <tr>
                            <th><Link style={{ color: "inherit" }} to={getLinkForItem(item)}>{item.title}</Link></th>
                            <th>{getModelName(item.model)}</th>
                        </tr>
                    )
                } </>
            </TheTable>
        </TheBoxMin>
    );
}


const AccountPage: React.FC = () => {
    const [account, setAccount] = useState<User|null>(null);
    const [settingsPop, setSettingsPop] = useState<boolean>(false);
    const [deletePop, setDeletePop] = useState<boolean>(false);

    const { pk } = useParams();
    const { user } = React.useContext(AuthContext);

    const axios = useAxios();

    const fetchData = () => {
        axios.get("admin/account/a/" + pk)
             .then(res => setAccount(res.data))
             .catch(err => {});
    };

    React.useEffect(fetchData, [pk]);

    return (
        <Page>
            {/* check for permission */}
            {  user && !user.permissions.includes("account.manage_account") && <Navigate to="/" /> }

            <Navigation />

            <PageHeader>
                <Title>
                    { account ? account.email.split("@").at(0) : "..." }
                </Title>

                <IconWrapper>
                    <FontAwesomeIcon icon={faSliders} onClick={() => setSettingsPop(true)} />
                    <FontAwesomeIcon icon={faTrash} color={account && account.delete_at ? red : undefined} onClick={() => setDeletePop(true)} />
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchData} />
                </IconWrapper>
            </PageHeader>

            {
                account &&
                <SpaceBetweenWrapper>
                    <HelpText>{account.groups.map(g => <>{translate(g)} / </>)}</HelpText>
                    <LinkWrapper>
                        <AccountContactLink pk={account.pk} email={account.email} />
                        <HelpText>{!account.is_active && "Neaktivovaný" }</HelpText>
                    </LinkWrapper>
                </SpaceBetweenWrapper>
            }

            { account && 
                <>
                    { account.groups.includes("client") && <AccountRelatedCesspools pk={account.pk} /> }
                    <ItemWrapper>
                        { account.groups.includes("city_admin") && <AccountRelatedCitys pk={account.pk} /> } 
                        { account.groups.includes("admin") && <AccountCreatedItems pk={account.pk} /> } 
                    </ItemWrapper>
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

export default AccountPage;