import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { SingleBoxPage } from "@components/Page";
import Navigation from "@components/Navigation";
import UserTokenPass from "@components/UserTokenPass";


const ActivateUserPage: React.FC = () => {
    const { token } = useParams(); 
    
    return (
        <>
            <Navigation />

            <SingleBoxPage>
                { token !== undefined ? 
                    <UserTokenPass 
                        label="Aktivovať učet"
                        token={token}
                        submitAPI="/account/activate/submit/"/> :
                    <Navigate to="/" />
                }
            </SingleBoxPage>
        </>
    )
}

export default ActivateUserPage;