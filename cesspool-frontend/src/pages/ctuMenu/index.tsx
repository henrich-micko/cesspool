import React, { useContext, useState } from "react";
import Navigation from "@components/Navigation";
import useAxios from "@hooks/useAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Page, { HelpText, IconWrapper, PageHeader } from "@components/Page";
import AuthContext from "@context/AuthContext";
import { CesspoolToUser } from "@types";
import CtuBox from "@components/CtuBox";
import ItemWrapper from "@components/ItemWrapper";


const CtuMenuPage: React.FC = () => {
    const [items, setItems] = useState<CesspoolToUser[]>([]);
    const [redirectTo, setRedirectTo] = useState<string|null>(null);

    const { user } = useContext(AuthContext);
    const axios = useAxios();
    
    const fetchItems = () => {
        axios.get("cesspool/c/")
                .then(res => setItems(res.data))
                .catch(err => {});
    }

    React.useEffect(fetchItems, []);
    
    return (
        <Page>
            {/* check for permission */}
            {  user && !user.permissions.includes("cesspool.related_to_cesspool") && <Navigate to="/" /> }

            {/* check redirection */}
            { redirectTo !== null && <Navigate to={redirectTo} /> }

            <Navigation />

            <PageHeader>
                <HelpText>Žumpy ktoré Vám su pridelene, <Link to="/contact/"> chybaju dáke?</Link></HelpText>
                <IconWrapper>
                    <FontAwesomeIcon icon={faRefresh} onClick={fetchItems} />
                </IconWrapper>
            </PageHeader>

            <ItemWrapper>
                { items.map(item => 
                    <CtuBox
                        pk={item.pk}
                        code={item.cesspool.code}
                        title={item.title}
                        record={item.cesspool.record}
                        problems={item.cesspool.problems}
                        onClick={() => setRedirectTo(item.cesspool.code)}
                    />
                )}
            </ItemWrapper>
        </Page>
    )
}

export default CtuMenuPage;