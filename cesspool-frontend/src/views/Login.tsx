import React from "react";

import styles from "./Login.module.scss"

import LoginBox from "../components/LoginBox";

const Login: React.FC = () => {
    return(
        <div className={styles.login}>
            <LoginBox />
        </div>

    )
}

export default Login