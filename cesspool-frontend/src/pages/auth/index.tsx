import React, { useState } from "react";
import styles from "@pages/auth/styles.module.scss";
import AuthContext from "@context/AuthContext";
import { IsNotAuthenticatedView } from "@permissions/Authenticated";
import { TheButtonWrapper, TheButtonInput } from "@components/TheButton";
import Navigation from "@components/Navigation";
import TheError from "@components/TheError";
import PopupWin from "@components/PopupWin";
import TheInput from "@components/TheInput";
import useAxios from "@hooks/useAxios"
import TheBox from "@components/TheBox";


interface _AuthResetPass {
    onSubmit(): void;
}

export const AuthResetPass: React.FC<_AuthResetPass> = (props) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string|null>(null);
    const axios = useAxios();

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.trim());
        setError(null);
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        axios.post("/account/reset-password/", {user: email})
            .then(() => {
                setError(null);
                props.onSubmit();
            }).catch(() => setError("Nepodarilo sa poslať email."));
    }

    return (
        <form onSubmit={handleSubmit}>
            <TheInput 
                autoFocus
                type="email"
                spellCheck={false}
                placeholder="Email"
                value={email}
                onChange={handleEmail}
                required={true}
            />

            { error !== null && <TheError>{error}</TheError> }

            <TheButtonWrapper>
                <TheButtonInput 
                    style={{
                        fontSize: "1em",
                        marginTop: "1em",
                    }}
                    type="submit" 
                    value="Potvrdiť"
                />
            </TheButtonWrapper>
        </form>
    )
}


export const AuthFormBox: React.FC = () => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<string|null>(null);
    const [popUp, setPopUp] = React.useState<boolean>(false);

    const { loginUser } = React.useContext(AuthContext);

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.trim());
        setError(null);
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim());
        setError(null);
    }

    const handleError = (error: any) => {
        setError("Nepodarilo sa prihlasiť.");
    }

    const handleSubmit = (event: React.SyntheticEvent) => {    
        event.preventDefault();
        loginUser(email, password, handleError);
    }

    return (
        <TheBox>
            <h2 className={styles.head}>Prihlasenie</h2>
            
            <form className={styles.authForm} onSubmit={handleSubmit}>
                <TheInput
                    autoFocus
                    type="email"
                    spellCheck={false}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmail}
                    required={true}
                />


                <TheInput
                    type="password"
                    spellCheck={false}
                    placeholder="Heslo"
                    value={password}
                    onChange={handlePassword}
                    required={true}
                />

                <span className={styles.forgotPassword} onClick={() => setPopUp(true)}>Zabudli ste si heslo?</span>
                {
                    error !== null && <TheError>{error}</TheError>
                }

                <TheButtonWrapper>
                    <TheButtonInput 
                        style={{
                            fontSize: "1em"
                        }}
                        type="submit" 
                        value="Potvrdiť"
                     />
                </TheButtonWrapper>
            </form>
            

            {
                popUp && 
                <PopupWin label="Resetovanie hesla" close={() => setPopUp(false)}>
                    <AuthResetPass onSubmit={() => setPopUp(false)}/>
                </PopupWin>
            }
        
        </TheBox>
    )
}

const AuthPage: React.FC = () => {
    return (    
        <IsNotAuthenticatedView>
            <Navigation />
            
            <div className={styles.authPage}>
                <AuthFormBox />
            </div>
        </IsNotAuthenticatedView>
    )
}

export default AuthPage;