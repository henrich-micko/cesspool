import React, {useContext } from "react"
import AuthContext from "@context/AuthContext"
import {IsAuthenticatedView} from "@permissions/Authenticated"
import TheNaviagtion from "@components/TheNaviagtion"
import styles from "@styles/views/global/viewWithNavigation.module.scss"
import ThemedBox from "@components/ThemedBox"
import AccountInfo from "@components/account/AccountInfo"
import TheButton from "@components/form/TheButton"
import accountBoardStyles from "@styles/components/account/accountBoardAdmin.module.scss"
import { useMaxWidth } from "@hooks/useIsMobile"

const AccountView: React.FC = () => {
    const { logoutUser, user, logoutUserAll } = useContext(AuthContext)
    const viewFullEmail = useMaxWidth("500px")

    return (
        <IsAuthenticatedView>
            <TheNaviagtion />
            
            <div className={styles.view}>
                <div className={styles.verticalWrapper}>
                    <ThemedBox label={viewFullEmail ? user.email?.split("@").at(0): user.email} className={accountBoardStyles.machineBoard}>
                        <div style={{"padding": "1em"}}>
                            <AccountInfo account={user} />
                            
                            <div style={{"width": "auto", "display": "flex", "justifyContent": "right", "gap": "1em"}}>
                                <TheButton onClick={ () => logoutUserAll(null)} label="Odhlasiť zo všetkých" type="red" />
                                <TheButton onClick={logoutUser} label="Odhlasiť" type="blue" />
                            </div>
                        </div>
                    </ThemedBox>
                </div>
            </div>
        </IsAuthenticatedView>
    )
}

export default AccountView
