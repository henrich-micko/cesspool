import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { User } from "@types";
import SwithInput from "@components/SwitchInput";
import translate from "@permissions/translate";


interface _AccountSettings {
    pk: number;
    email: string;
    groups: string[];
    onUpdate(account: User): void;
}

const AccountSettings: React.FC<_AccountSettings> = (props) => {
    const [email, setEmail] = React.useState<string>(props.email);
    const [error, setError] = React.useState<string|null>(null);

    const [client, setClient] = React.useState<boolean>(props.groups.includes("client"));
    const [admin, setAdmin] = React.useState<boolean>(props.groups.includes("admin"));
    const [cityAdmin, setCityAdmin] = React.useState<boolean>(props.groups.includes("city_admin"));

    const getGroups = () => {
        let output: string[] = [];
        if (client)     output = ["client"];
        if (admin)      output = [...output, "admin"];
        if (cityAdmin)  output = [...output, "city_admin"];
        console.log(output);
        return output;
    };

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.patch("admin/account/a/" + props.pk + "/", {email: email, groups: getGroups()})
             .then(res => props.onUpdate(res.data))
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

export default AccountSettings;