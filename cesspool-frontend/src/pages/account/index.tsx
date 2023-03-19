import React from 'react';
import styles from "./styles.module.scss";
import Navigation from '@components/Navigation';
import { IsAuthenticatedView } from '@permissions/Authenticated';
import AuthContext from '@context/AuthContext';


const Account: React.FC = () => {
    const { user, logoutUser } = React.useContext(AuthContext);

    return (
        <IsAuthenticatedView>
            <Navigation />

            <div className={styles.header}>
                <h2>{user.email}</h2>
                
                <div className={styles.logoutButton} onClick={logoutUser}>
                    <span>Odhlasiť</span>
                </div>
            </div>

        </IsAuthenticatedView>
    )
}

export default Account;