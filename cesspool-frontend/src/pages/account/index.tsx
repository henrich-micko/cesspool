import React from 'react';
import styles from "./styles.module.scss";
import Navigation from '@components/Navigation';
import { IsAuthenticatedView } from '@permissions/Authenticated';
import AuthContext from '@context/AuthContext';
import { Navigate } from 'react-router-dom';
import Page from '@components/Page';


const Account: React.FC = () => {
    const { user, logoutUser } = React.useContext(AuthContext);

    if (!user) return <Navigate to="/" />
    return (
        <Page>
            <Navigation />

            <div className={styles.header}>
                <h2>{user.email}</h2>
                
                <div className={styles.logoutButton} onClick={logoutUser}>
                    <span>Odhlasiť</span>
                </div>
            </div>
        </Page>
    )
}

export default Account;