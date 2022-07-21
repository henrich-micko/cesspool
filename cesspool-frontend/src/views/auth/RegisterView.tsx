import axios from "axios"
import React, { useState, ChangeEvent, FormEvent } from "react"
import { useNavigate } from 'react-router-dom'


// Styles
import styles from "./styles.module.scss"

const Register: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const navigate = useNavigate();

    // Handle change on inputs
    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handlePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value)
    }


    // Handle form events
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        axios
            .post("http://localhost:8000/api/account/create/", {
                email: email,
                password: password
            })
            .then(() => {
                navigate("/account/login")
            })
    }

    const handleInvalidForm = (event: FormEvent<HTMLFormElement>) => {
        console.log(event)
    }

    return (
        <div className={styles.view}>
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
        </div>
    )
}

export default Register