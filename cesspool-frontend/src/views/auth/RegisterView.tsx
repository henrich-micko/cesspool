import React, { useState, ChangeEvent, FormEvent, useContext } from "react"
import AuthContext from "../../context/AuthContext"
 
// Permissions
import { IsNotAuthenticatedView } from "../../permissions/Authenticated"

// Styles
import styles from "./styles.module.scss"

const Register: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const {createUser} = useContext(AuthContext)

    // Handle change on inputs
    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.trim())
        setEmailError("")
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim())
        setPasswordError("")
    }

    const handlePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value.trim())
        setPasswordError("")
    }

    const handleError = (error: any) => {
        const data = error.response.data

        if (data.email !== undefined) setEmailError("Učet s týmto emailom existuje.")
        if (data.password !== undefined) setPasswordError("Priliš slabé heslo. (8 znakov)")
    }

    // Handle form events
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (password === password2 && emailError === "" && passwordError === "") {
            createUser(email, password, handleError)
        }
    }

    return (
        <IsNotAuthenticatedView>
            <div className={styles.view}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h1>Sign up</h1>
                    </div>

                    <form onSubmit={handleSubmit} >
                        <input
                            autoFocus
                            type="email"
                            spellCheck={false}
                            placeholder="Email"
                            value={email}
                            onChange={handleEmail}
                            required={true}
                        />

                        <div className={styles.errorMessage}>
                            {emailError}
                        </div>

                        <input
                            type="password"
                            spellCheck={false}
                            placeholder="Heslo"
                            value={password}
                            onChange={handlePassword}
                            required={true}
                            className={password !== password2 ? styles.invalid : undefined}
                        />

                        <input
                            type="password"
                            spellCheck={false}
                            placeholder="Potvrdiť heslo"
                            value={password2}
                            onChange={handlePassword2}
                            required={true}
                            className={password !== password2 ? styles.invalid : undefined}
                        />

                        <div className={styles.errorMessage}>
                            {passwordError}
                        </div>

                        <div className={styles.buttonWrapper}>
                            <input
                                type="submit"
                                value="Potvrdiť"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </IsNotAuthenticatedView>
    )
}

export default Register