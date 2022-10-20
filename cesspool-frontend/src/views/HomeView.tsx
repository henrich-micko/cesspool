import React, { createRef } from "react"

// Styles && assets
import styles from "@styles/views/homeView.module.scss"
import AboutBoard from "@components/home/AboutBoard"
import LoginForm from "@components/account/AccountLogin"
import { IsNotAuthenticatedView } from "@permissions/Authenticated"


const Home: React.FC = () => {    
    const loginFormRef = createRef<HTMLDivElement>()
    
    const handleSignInClick = () => {
        if (loginFormRef !== null && loginFormRef.current !== null) {
            loginFormRef.current.scrollIntoView({behavior: "smooth"})
        }
    }

    return (
        <IsNotAuthenticatedView>
            <div className={styles.view}>
                <div className={styles.wrapper}>
                    <div ref={loginFormRef} className={styles.loginWrapper}>
                        <AboutBoard signInClick={handleSignInClick} />
                    </div>
                    <div ref={loginFormRef} className={styles.loginWrapper}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </IsNotAuthenticatedView>
    )
}

export default Home