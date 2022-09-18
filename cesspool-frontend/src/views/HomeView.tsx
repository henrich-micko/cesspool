import React, { createRef } from "react"

// Styles && assets
import styles from "@styles/views/homeView.module.scss"
import AboutBoard from "@components/home/AboutBoard"
import LoginForm from "@components/auth/LoginForm"
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
                <div className={styles.machineWrapper}>
                    <AboutBoard signInClick={handleSignInClick} />
                    <div ref={loginFormRef}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </IsNotAuthenticatedView>
    )
}

export default Home