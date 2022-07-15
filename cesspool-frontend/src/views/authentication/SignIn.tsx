import React from "react";

import styles from "./styles.module.scss"

import SignInBox from "../../components/authentication/SignInBox";

const Login: React.FC = () => {
    return(
        <div className={styles.view}>
            <SignInBox />
        </div>

    )
}

export default Login