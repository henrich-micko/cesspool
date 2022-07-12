import React from "react";

import styles from "./Login.module.scss"

import SignInBox from "../components/SignInBox";

const Login: React.FC = () => {
    return(
        <div className={styles.login}>
            <SignInBox />
        </div>

    )
}

export default Login