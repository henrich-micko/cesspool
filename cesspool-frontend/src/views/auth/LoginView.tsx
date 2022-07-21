import React, { useState, ChangeEvent, FormEvent, useContext } from "react"
import { Link } from "react-router-dom";

// Styles
import styles from "./styles.module.scss"

// Auth
import AuthContext from "../../context/AuthContext";

const Login: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const {loginUser} = useContext(AuthContext)

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.trim())
        setErrorMessage("")
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim())
        setErrorMessage("")
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    
        loginUser(email, password)
            .then((value) => {
                if (!value.isSuccessful) setErrorMessage("Nesprávne heslo alebo email")
            })
    }

    return (
        <div className={styles.view}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1>Sign in</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        type="email"
                        spellCheck={false}
                        placeholder="Email"
                        value={email}
                        onChange={handleEmail}
                        required={true}
                    />

                    <input
                        type="password"
                        spellCheck={false}
                        placeholder="Heslo"
                        value={password}
                        onChange={handlePassword}
                        required={true}
                    />

                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>

                    <Link to="/forgot-password">
                        Zabudli ste heslo ?
                    </Link>
                    
                    <div className={styles.buttonWrapper}>
                        <input
                            type="submit"
                            value="Potvrdiť"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login