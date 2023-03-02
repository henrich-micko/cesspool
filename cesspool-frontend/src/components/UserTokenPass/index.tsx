import React from "react";
import TheBox, { TheBoxHeader } from "@components/TheBox";
import { Navigate } from "react-router-dom";
import useAxios from "@hooks/useAxios";
import TheError from "@components/TheError";
import TheInput from "@components/TheInput";
import { TheButtonWrapper, TheButtonInput } from "@components/TheButton";
import TheForm from "@components/TheForm";


interface _UserTokenPass {
    label: string;
    token: string;
    submitAPI: string;
}

const UserTokenPass: React.FC<_UserTokenPass> = (props) => {
    const [password, setPassword] = React.useState<string>("");
    const [password2, setPassword2] = React.useState<string>("");
    const [error, setError] = React.useState<string|null>(null);
    const [redirect, setRedirect] = React.useState<boolean>(false);

    const axios = useAxios();

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.trim());
        setError(null);
    }

    const handlePassword2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value.trim());
        setError(null);
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (password !== password2) {
            setError("Hesla sa nezhoduju.")
        } else {
            axios.post(props.submitAPI, {
                token: props.token, 
                password: password,
            }).then(res => setRedirect(true))
              .catch(err => setError("Neplatný token."))
        }
    }

    return (
        <> { redirect ? <Navigate to="/" /> : 
            <TheBox>
                <TheBoxHeader>
                    { props.label }
                </TheBoxHeader>

                <TheForm onSubmit={handleSubmit}>
                    <TheInput
                        type="password"
                        spellCheck={false}
                        placeholder="Nove heslo"
                        value={password}
                        onChange={handlePassword}
                        required={true}
                    />

                    <TheInput
                        type="password"
                        spellCheck={false}
                        placeholder="Zopakuj heslo"
                        value={password2}
                        onChange={handlePassword2}
                        required={true}
                    />

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
                </TheForm>
            </TheBox>
        } </>
    )
}

export default UserTokenPass;