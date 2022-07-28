import React, { useContext, useState } from 'react'

// Styles
import styles from "./AccountView.module.scss"

// Permissions
import { IsAuthenticatedView } from '../../permissions/Authenticated'

// Contexts
import AuthContext from '../../context/AuthContext'

// Axios
import useAxios from '../../useAxios'

const UserView: React.FC = () => {
    const [email, setEmail] = useState("")

    const {logoutUser, logoutUserAll} = useContext(AuthContext)
    const axios = useAxios()

    const handleError = (error: any) => {
        alert("Došlo ku nečakanej chybe a snažime sa ju vyriešiť.")
    }

    const onEffect = () => {
        axios.get("/account/whoami/")
            .then(res => setEmail(res.data.email))
            .catch(error => console.log(error))
    }

    return(
        <IsAuthenticatedView onEffect={onEffect}>
            <div className={styles.view}>
                <div className={styles.boxWrapper}>
                    <div className={styles.header}>
                        <h1>Môj Učet</h1>
                    </div>

                    <div className={styles.body}>
                        {email}

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