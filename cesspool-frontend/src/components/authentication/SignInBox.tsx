import React, { useState, ChangeEvent, FormEvent } from "react"
import { Link } from "react-router-dom";

import styles from "./styles.module.scss"

const SignInBox: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = (email: string, password: string) => {
        alert(email + "\n" + password)
    }

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        onSubmit(email, password)
    }

    return (
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
    )
}

export default SignInBox