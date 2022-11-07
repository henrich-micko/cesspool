import React from "react"

// Styles && assets
import styles from "@styles/views/homeView.module.scss"
import AboutBoard from "@components/home/AboutBoard"
import LoginForm from "@components/account/AccountLogin"
import { IsNotAuthenticatedView } from "@permissions/Authenticated"
import { useMaxWidth } from "@hooks/useIsMobile"


const Home: React.FC = () => {
    const viewAboutBoard = !useMaxWidth("1230px")

    return (
        <IsNotAuthenticatedView>
            <div className={styles.view}>
                Whats up
                <div className={styles.wrapper}>
                    <div className={styles.loginWrapper}>
                        {viewAboutBoard && <AboutBoard />}
                    </div>
                    <div className={styles.loginWrapper}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </IsNotAuthenticatedView>
    )
}

export default Home