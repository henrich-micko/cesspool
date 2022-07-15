import React, { useState, ChangeEvent, FormEvent } from "react"

import styles from "./styles.module.scss"

const SignUpBox: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const onSubmit = (email: string, password: string, password2: string) => {
        alert(email + "\n" + password + "\n" + password2)
    }

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handlePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        onSubmit(email, password, password2)
    }

    const handleInvalidForm = (event: FormEvent<HTMLFormElement>) => {
        console.log(event)
    }

    return (
        <div className={styles.formWrapper}>
            <div className={styles.header}>
                <h1>Sign up</h1>
            </div>

            <form onSubmit={handleSubmit} onInvalid={handleInvalidForm}>
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

export default SignUpBox