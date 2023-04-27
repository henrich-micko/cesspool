import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { City, UserAsField } from "@types";
import CityInput from "@components/CityInput";


interface _CitySettings {
    manager: UserAsField|null;
    district: string;
    city: string;
    onUpdate(city: City): void;
}

const CitySettings: React.FC<_CitySettings> = (props) => {
    const [manager, setManager] = React.useState<UserAsField|null>(props.manager);
    const [error, setError] = React.useState<string|null>(null);

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.patch("admin/location/city/c/" + props.district + "/" + props.city, { manager: manager })
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
                    placeholder="Manadžer"
                    value={ manager ? manager.email : "" }
                    onChange={onChangeSetState(setManager, setError)} 
                    required={true}
                />

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

export default CitySettings;