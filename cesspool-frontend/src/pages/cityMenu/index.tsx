import CityBox from "@components/CityBox";
import CityCreate from "@components/CreateCity";
import ItemWrapper from "@components/ItemWrapper";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import PopupWin from "@components/PopupWin";
import SearchBar from "@components/SearchBar";
import UserBox from "@components/UserBox";
import AuthContext from "@context/AuthContext";
import { faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { City } from "@types";
import React from "react";
import { Navigate } from "react-router-dom";
import styles from "./styles.module.scss";


const CityMenuPage: React.FC = () => {
    const [items, setItems] = React.useState<City[]>([]);
    const [filteredItem, setFilteredItem] = React.useState<City[]|null>(null);
    const [redirectTo, setRedirectTo] = React.useState<string|null>(null);
    const [createPop, setCreatePop] = React.useState<boolean>(false);

    const { user } = React.useContext(AuthContext);
    const axios = useAxios();
    
    const fetchItems = () => {
        axios.get("admin/location/city/")
                .then(res => setItems(res.data))
                .catch(err => {});
    }

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
            item.district.toLowerCase().includes(lowerCasedFilter) || 
            (item.manager && item.manager.email.toLowerCase().includes(lowerCasedFilter)) || 
            item.title.toLowerCase().includes(lowerCasedFilter) 
        ));
    };

    const getCurrentItems = (): City[] => {
        return filteredItem === null ? items : filteredItem;
    }
    
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

            <ItemWrapper>
                { items.length > 0 && getCurrentItems().map((item, index) => 
                    <CityBox 
                        pk={item.id}
                        district={item.district} 
                        title={item.title} 
                        isSetToDelete={item.delete_at !== null} 
                        manager={item.manager?.email}
                        onClick={(d, t) => setRedirectTo(d + "/" + t)}
                    />
                )}
            </ItemWrapper>

            {
                createPop &&
                <PopupWin label="Vytvoriť lokáciu" close={() => setCreatePop(false)}>
                    <CityCreate onCreate={(a) => {
                        setCreatePop(false); 
                        setItems(olds => [...olds, a]); 
                    }} />
                </PopupWin>
            }
        </Page>
    )
}

export default CityMenuPage;