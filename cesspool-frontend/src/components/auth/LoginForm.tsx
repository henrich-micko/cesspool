import React, { useState, ChangeEvent, FormEvent, useContext } from "react"
import { Link } from "react-router-dom";

// Styles
import styles from "@styles/components/auth/loginForm.module.scss"

// Context
import AuthContext from "@context/AuthContext"
import TheBoard from "@components/TheBoard";
import { useMaxWidth } from "@hooks/useIsMobile";

const LoginForm: React.FC = () => {
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

    const handleError = (error: any) => {
        setErrorMessage("Nesprávny email alebo heslo.")
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    
        loginUser(email, password, handleError)
    }

    return (
        <TheBoard 
            label="Prihlásiť sa" 
            className={styles.formWrapper}
            align="center"
            style={{
                "width": "20em", 
                "marginTop": "5em", 
            }}
        >

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
        </TheBoard>
    )
}

export default LoginForm