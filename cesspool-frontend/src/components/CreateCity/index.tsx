import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { City } from "@types";
import CityInput from "@components/CityInput";


interface _CityCreate {
    onCreate(account: City): void;
}

const CityCreate: React.FC<_CityCreate> = (props) => {
    const [manager, setManager] = React.useState<string>("");
    const [district, setDistrict] = React.useState<string|null>(null);
    const [city, setCity] = React.useState<string|null>(null);
    const [error, setError] = React.useState<string|null>(null);

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.post("admin/location/city/create", {manager: manager !== "" ? manager : null, title: city, district: district})
             .then(res => props.onCreate(res.data))
             .catch(err => setError("Nepodarilo sa vytvoriť."));
    };

    return (
        <TheForm onSubmit={handleSubmit}>
            <>
                <TheInput
                    autoFocus
                    type="email"
                    spellCheck={false}
                    placeholder="Manadžer"
                    value={manager}
                    onChange={onChangeSetState(setManager, setError)} 
                    required={false}
                />

                <CityInput
                    district={district ? district : ""}
                    city={city ? city : ""}
                    setError={setError}
                    onCityChange={value => { setCity(value); setError(null) }}
                    onDistrictChange={value => { setDistrict(value); setError(null) }}
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

export default CityCreate;