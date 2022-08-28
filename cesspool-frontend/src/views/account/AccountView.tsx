import React, { useContext } from 'react'

// Styles
import styles from "./AccountView.module.scss"

// Permissions
import { IsAuthenticatedView } from '../../permissions/Authenticated'

// Contexts
import AuthContext from '../../context/AuthContext'


const UserView: React.FC = () => {
    const {user, logoutUser, logoutUserAll} = useContext(AuthContext)

    const handleError = (error: any) => {
        alert("Došlo ku nečakanej chybe a snažime sa ju vyriešiť.")
    }

    return(
        <IsAuthenticatedView>
            <div className={styles.view}>
                <div className={styles.boxWrapper}>
                    <div className={styles.header}>
                        <h1>Môj Učet</h1>
                    </div>

                    <div className={styles.body}>
                        {user.email}

                        <div className={styles.buttonsWrapper}>
                            <input
                                type="button"
                                value="Nastavenia"

                            />
                            
                            <input
                                type="button"
                                value="Odhlásiť zo všetkých"
                                onClick={() => logoutUserAll(handleError)}
                            />
                            
                            <input
                                type="button"
                                value="Odhlasiť"
                                onClick={logoutUser}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </IsAuthenticatedView>
    )
}

export default UserView