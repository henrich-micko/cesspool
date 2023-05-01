import React from 'react';
import styles from "./styles.module.scss";
import Navigation from '@components/Navigation';
import { IsAuthenticatedView } from '@permissions/Authenticated';
import AuthContext from '@context/AuthContext';
import { Navigate } from 'react-router-dom';
import Page, { HelpText } from '@components/Page';
import TheBox, { TheBoxHeader } from '@components/TheBox';
import TheDate from '@components/TheDate';
import { TheButtonInput, TheButtonWrapper } from '@components/TheButton';

const Account: React.FC = () => {
    const { user, logoutUser } = React.useContext(AuthContext);

    if (!user) return <Navigate to="/" />
    return (
        <Page>
            <Navigation />

            <div className={styles.wrapper}>
                <TheBox style={{ width: "20em" }}>
                    <TheBoxHeader>{user.email}</TheBoxHeader>
                    <br/>
                    <HelpText>Deň pridania: <TheDate date={user.date_joined.split("T").at(0)}/></HelpText>

                    <TheButtonWrapper>
                        <TheButtonInput 
                            style={{
                                fontSize: "1em",
                                marginTop: "3em",
                            }}
                            onClick={logoutUser}
                            type="button" 
                            value="Odlhasiť"
                        />
                    </TheButtonWrapper>
                </TheBox>
            </div>
        </Page>
    )
}

export default Account;