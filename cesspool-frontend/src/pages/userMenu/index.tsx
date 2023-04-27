import AccountCreate from "@components/AccountCreate";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import PopupWin from "@components/PopupWin";
import SearchBar from "@components/SearchBar";
import TheBox, { TheBoxMin } from "@components/TheBox";
import UserBox from "@components/UserBox";
import AuthContext from "@context/AuthContext";
import { faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import translate from "@permissions/translate";
import { User } from "@types";
import React from "react";
import { Navigate } from "react-router-dom";
import styles from "./styles.module.scss";


const UserMenuPage: React.FC = () => {
    const [items, setItems] = React.useState<User[]>([]);
    const [filteredItem, setFilteredItem] = React.useState<User[]|null>(null);
    const [redirectTo, setRedirectTo] = React.useState<number|null>(null);
    const [createPop, setCreatePop] = React.useState<boolean>(false);

    const { user } = React.useContext(AuthContext);
    const axios = useAxios();
    
    const fetchItems = () => {
        axios.get("admin/account/")
                .then(res => setItems(res.data))
                .catch(err => {});
    };

    React.useEffect(fetchItems, []);

    const handleFilter = (filter: string|null) => {
        if (filter === null) {
            setFilteredItem(null);
            return;
        }

        // little search engine which i named kettu search 3000
        const lowerCasedFilter = filter.toLocaleLowerCase();
        setFilteredItem(items.filter(
            item => 
            item.email.toLowerCase().includes(lowerCasedFilter) || 
            (item.groups.map(translate).filter(g => g.toLocaleLowerCase().includes(lowerCasedFilter)).length > 0
        )));
    };

    const getCurrentItems = (): User[] => {
        return filteredItem === null ? items : filteredItem;
    };
    
    return (
        <Page>
            {/* check for permission */}
            {  user && !user.permissions.includes("cesspool.manage_cesspool") && <Navigate to="/" /> }

            {/* check redirection */}
            { redirectTo !== null && <Navigate to={redirectTo.toString()} /> }

            <Navigation />

            <div className={styles.header}>
                <SearchBar onChange={handleFilter}/>
                <div className={styles.iconWrapper}>
                    <FontAwesomeIcon className={styles.icon} icon={faPlusCircle} onClick={() => setCreatePop(true)}/>
                    <FontAwesomeIcon className={styles.icon} icon={faRefresh} onClick={fetchItems}/>
                </div>
            </div>

            <div className={styles.wrapper}>
                { items.length > 0 && getCurrentItems().map((item, index) => 
                    <UserBox
                        pk={item.pk}
                        email={item.email}
                        deleteAt={item.delete_at}
                        createdBy={item.created_by}
                        groups={item.groups}
                        isActive={item.is_active}
                        isMe={item.pk === user?.pk}
                        onClick={setRedirectTo}
                    />
                )}
            </div>

            {
                createPop &&
                <PopupWin label="Vytvoriť učet" close={() => setCreatePop(false)}>
                    <AccountCreate onCreate={(a) => {
                        setCreatePop(false); 
                        setItems(olds => [...olds, a]); 
                    }} />
                </PopupWin>
            }
        </Page>
    )
}

export default UserMenuPage;