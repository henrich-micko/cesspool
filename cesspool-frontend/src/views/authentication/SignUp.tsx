import React from "react";

import styles from "./styles.module.scss"

import SignUpBox from "../../components/authentication/SignUpBox";

const Login: React.FC = () => {
    return(
        <div className={styles.view}>
            <SignUpBox />
        </div>

    )
}

export default Login