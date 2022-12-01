import React, { useEffect, useState, ChangeEvent } from "react"
import ThemedBox from "@components/ThemedBox"
import TheForm from "@components/form/TheForm"
import { Navigate, useParams } from "react-router-dom"
import useAxios from "@hooks/useAxios"
import styles from "@styles/components/account/accountChangePasswordSubmit.module.scss"
import classNames from "classnames"

const AccountChangePassword: React.FC = () => {
    const { token } = useParams()

    const [error, setError] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [password2, setPassword2] = useState<string>("")

    const [redirect, setRedirect] = useState<boolean>(false)

    const axios = useAxios()

    useEffect(() => {
        axios.post("/account/reset-password/check-token/", {token: token})
             .catch(error => setRedirect(true))
    }, [token])

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim())
        setError("")
    }

    const handlePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value.trim())
        setError("")
    }

    const handleSubmit = () => {
        if (password !== password2) return

        axios.post("/account/reset-password/submit/", {token: token, password: password})
             .then(res => setRedirect(true))
             .catch(error => setError("Neplatné údaje"))
    }

    return (
        <>
            {
                !redirect ?
                    <div className={styles.view} >
                        <ThemedBox label="Zmeniť heslo" className={styles.box}>
                            <TheForm onClick={handleSubmit} error={error}>
                                <>
                                    <input
                                        className={classNames(styles.input, password !== password2 && styles.red)}
                                        type="password"
                                        spellCheck={false}
                                        placeholder="Nové heslo"
                                        value={password}
                                        onChange={handlePassword}
                                        required={true}
                                        maxLength={10}
                                    />

                                    <input
                                        className={classNames(styles.input, password !== password2 && styles.red)}
                                        type="password"
                                        spellCheck={false}
                                        placeholder="Potvrdiť nové heslo"
                                        value={password2}
                                        onChange={handlePassword2}
                                        required={true}
                                        maxLength={10}
                                    />
                                </>
                            </TheForm>
                        </ThemedBox>
                    </div>
                : <Navigate to="/" />
            }
        </>
    )
}

export default AccountChangePassword