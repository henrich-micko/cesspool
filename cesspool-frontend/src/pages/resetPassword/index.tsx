import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { SingleBoxPage } from "@components/Page";
import Navigation from "@components/Navigation";
import UserTokenPass from "@components/UserTokenPass";


const ResetPasswordPage: React.FC = () => {
    const { token } = useParams(); 
    
    return (
        <>
            <Navigation />

            <SingleBoxPage>
                { token !== undefined ? 
                    <UserTokenPass 
                        label="Resetovanie hesla"
                        token={token}
                        submitAPI="/account/reset-password/submit/"/> :
                    <Navigate to="/" />
                }
            </SingleBoxPage>
        </>
    )
}

export default ResetPasswordPage;