import React, { useState, ChangeEvent, FormEvent, useContext } from "react"
import { Link } from "react-router-dom";

// Styles
import styles from "@styles/components/account/accountLogin.module.scss"

// Context
import AuthContext from "@context/AuthContext"
import ThemedBox from "@components/ThemedBox"
import PopUp from "@components/PopUp";
import AccountChangePassword from "./AccountChangePassword";
import TheForm from "@components/form/TheForm";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [viewResetPassword, setViewResetPassword] = useState<boolean>(false)

    const {loginUser} = useContext(AuthContext)

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.trim())
        setErrorMessage("")
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim())
        setErrorMessage("")
    }

    const handleError = (error: any) => {
        setErrorMessage("Neplatná kombinácia")
    }

    const handleSubmit = () => {    
        loginUser(email, password, handleError)
    }

    return (
        <ThemedBox 
            label={<h2 style={{"width": "100%", "textAlign": "center"}}>Prihlasiť sa</h2>}
            className={styles.formWrapper}
            style={{
                "width": "20em", 
                "marginTop": "5em",
            }}
        >

            <TheForm onClick={handleSubmit} error={errorMessage}>
                <>
                    <input
                        className={styles.input}
                        autoFocus
                        type="email"
                        spellCheck={false}
                        placeholder="Email"
                        value={email}
                        onChange={handleEmail}
                        required={true}
                    />

                    <input
                        className={styles.input}
                        type="password"
                        spellCheck={false}
                        placeholder="Heslo"
                        value={password}
                        onChange={handlePassword}
                        required={true}
                    />

                    <span onClick={() => setViewResetPassword(true)} className={styles.resetPassword}>
                        Zabudli ste heslo ?
                    </span>
                </>
            </TheForm>

            {
                viewResetPassword &&
                <PopUp label="Zabudol som heslo" onClickClose={() => setViewResetPassword(false)}>
                    <AccountChangePassword onSubmit={console.log} />
                </PopUp>
            }

        </ThemedBox>
    )
}

export default LoginForm