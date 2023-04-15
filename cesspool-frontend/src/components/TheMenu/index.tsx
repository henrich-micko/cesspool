import React, { useContext, useState } from "react";
import Navigation from "@components/Navigation";
import useAxios from "@hooks/useAxios";
import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Page from "@components/Page";
import AuthContext from "@context/AuthContext";


function includesAll<T>(array: Array<T>, includes: Array<T>): boolean {
    return includes.every(value => {
        return array.includes(value);
    });
}


export function generateMenuPage<T>(apiRequestUrl: string, component: React.FC<T&{onClick: () => void}>, lookUpField: (item: T) => string, itemsName: string, reqPermissions: string[] = []): React.FC {
    const _MenuPage: React.FC = () => {
        const [items, setItems] = useState<T[]>([]);
        const [redirectTo, setRedirectTo] = useState<string|null>(null);

        const { user } = useContext(AuthContext);
        const axios = useAxios();
        
        const fetchItems = () => {
            axios.get(apiRequestUrl)
                 .then(res => setItems(res.data))
                 .catch(err => {});
        }

        const handleItemClick = (index: number) => {
            const item = items[index];
            if (item === undefined || item === null)
                return;
        
            const field = lookUpField(item);
            setRedirectTo(field);
        }


        React.useEffect(fetchItems, []);
        
        return (
            <Page>
                {/* check for permission */}
                { reqPermissions.length > 0 && (user === null || includesAll(user.permissions, reqPermissions)) && 
                    <Navigate to="/" /> }

                {/* check redirection */}
                { redirectTo !== null && <Navigate to={redirectTo} /> }

                <Navigation />

                <div className={styles.header}>
                    <p className={styles.help}>
                        {itemsName} ktoré Vám su pridelene, <Link to="/contact/"> chybaju dáke?</Link>
                    </p>
                    <FontAwesomeIcon className={styles.refresh} icon={faRefresh} onClick={fetchItems}/>
                </div>

                <div className={styles.cesspoolsWrapper}>
                    { items.map((item, index) => 
                        component({...item, onClick: () => handleItemClick(index)}) )}
                </div>
            </Page>
        )
    }

    return _MenuPage;
}