import React from "react"
import { Link } from "react-router-dom";

import styles from "./LoginBox.module.scss"

const LoginBox: React.FC = () => {
    return(
        <div className={styles.loginBox}>
            <div className={styles.header}>
                <h1>Log in</h1>
            </div>

            <form>
                <input
                    autoFocus
                    type="text"
                    spellCheck={false}
                    placeholder="Email"
                />

                <input
                    type="password"
                    spellCheck={false}
                    placeholder="Password"
                />

                <Link to="https://google.com">
                    Zabudli ste heslo ?
                </Link>

                <div className={styles.buttonWrapper}>
                    <input 
                        type="button"
                        value="Potvrdiť"
                    />
                </div>
            </form>
        </div>
    )
}

export default LoginBox