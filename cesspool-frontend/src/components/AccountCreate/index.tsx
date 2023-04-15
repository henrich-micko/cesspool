import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { User } from "@types";
import SwithInput from "@components/SwitchInput";
import translate from "@permissions/translate";


interface _AccountCreate {
    onCreate(account: User): void;
}

const AccountCreate: React.FC<_AccountCreate> = (props) => {
    const [email, setEmail] = React.useState<string>("");

    const [client, setClient] = React.useState<boolean>(false);
    const [admin, setAdmin] = React.useState<boolean>(false);
    const [cityAdmin, setCityAdmin] = React.useState<boolean>(false);

    const [error, setError] = React.useState<string|null>(null);

    const getGroups = () => {
        let output: string[] = [];
        if (client)     output = ["client"];
        if (admin)      output = [...output, "admin"];
        if (cityAdmin)  output = [...output, "city_admin"];
        return output;
    };

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.post("admin/account/create/", {email: email, groups: getGroups()})
             .then(res => props.onCreate(res.data))
             .catch(err => setError("Nepodarilo sa nastaviť."));
    };

    return (
        <TheForm onSubmit={handleSubmit}>
            <>
                <TheInput
                    autoFocus
                    type="email"
                    spellCheck={false}
                    placeholder="Email"
                    value={email}
                    onChange={onChangeSetState(setEmail, setError)} 
                    required={true}
                />

            <SwithInput label={ translate("client") } value={client} onClick={setClient} />
            <SwithInput label={ translate("admin") } value={admin} onClick={setAdmin} />
            <SwithInput label={ translate("city_admin") } value={cityAdmin} onClick={setCityAdmin} />

                { error && <TheError>{error}</TheError> }

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
            </>
        </TheForm>
    )
}

export default AccountCreate;