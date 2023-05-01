import React, { useContext, useState } from "react";
import Navigation from "@components/Navigation";
import useAxios from "@hooks/useAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import Page, { IconWrapper, PageHeader } from "@components/Page";
import AuthContext from "@context/AuthContext";
import { Cesspool } from "@types";
import CesspoolBox from "@components/CesspoolBox";
import SearchBar from "@components/SearchBar";
import PopupWin from "@components/PopupWin";
import CesspoolCreate from "@components/CesspoolCreate";
import ItemWrapper from "@components/ItemWrapper";


const CesspoolMenuPage: React.FC = () => {
    const [items, setItems] = useState<Cesspool[]>([]);
    const [filteredItem, setFilteredItem] = useState<Cesspool[]|null>(null);
    const [redirectTo, setRedirectTo] = useState<string|null>(null);
    const [cesspoolCreatePop, setCesspoolCreatePop] = useState<boolean>(false);

    const { user } = useContext(AuthContext);
    const axios = useAxios();
    
    const fetchItems = () => {
        axios.get("admin/cesspool")
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
            item.code.toLowerCase().includes(lowerCasedFilter) || 
            item.city?.toLowerCase().includes(lowerCasedFilter) || 
            (item.about && item.about.toLowerCase().includes(lowerCasedFilter))
        ));
    }

    const getCurrentItems = (): Cesspool[] => {
        return filteredItem === null ? items : filteredItem;
    }
    
    return (
        <Page>
            {/* check for permission */}
            {  user && !user.permissions.includes("cesspool.manage_cesspool") && <Navigate to="/" /> }

            {/* check redirection */}
            { redirectTo !== null && <Navigate to={redirectTo} /> }

            <Navigation />

            <PageHeader>
                <SearchBar onChange={handleFilter}/>
                <IconWrapper>
                    <FontAwesomeIcon icon={faPlusCircle} onClick={() => setCesspoolCreatePop(true)}/>
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchItems}/>
                </IconWrapper>
            </PageHeader>

            <ItemWrapper>
                { items.length > 0 && getCurrentItems().map((item, index) => 
                    <CesspoolBox
                        pk={item.pk}
                        code={item.code}
                        record={item.record}
                        problems={item.problems}
                        city={item.city}
                        about={item.about}
                        deleteAt={item.delete_at}
                        debugMode={item.debug_mode}
                        onClick={() => setRedirectTo(item.code)}
                    />
                )}
            </ItemWrapper>

            {
                cesspoolCreatePop &&
                <PopupWin label="Vytvoriť žumpu" close={() => setCesspoolCreatePop(false)}>
                    <CesspoolCreate onCreate={c => { setItems(olds => [...olds, c]); setCesspoolCreatePop(false) }}/>                    
                </PopupWin>
            }
        </Page>
    )
}

export default CesspoolMenuPage;