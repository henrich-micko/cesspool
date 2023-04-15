import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { Cesspool } from "@types";
import CityInput from "@components/CityInput";
import { getCity, getDistrict } from "../../formats";
import TheSubInput from "@components/TheSubInput";


interface _CesspoolSettings {
    pk: number;
    code: string;
    city: string;
    owner: string|null;
    subPk: number;
    about: string|null;
    onUpdate(cesspool: Cesspool): void;
}

const CesspoolSettings: React.FC<_CesspoolSettings> = (props) => {
    const [code, setCode] = React.useState<string>(props.code);
    const [district, setDistrict] = React.useState<string>(getDistrict(props.city));
    const [city, setCity] = React.useState<string>(getCity(props.city));
    const [owner, setOwner] = React.useState<string>(props.owner !== null ? props.owner : "");
    const [sub, setSub] = React.useState<number>(props.subPk);
    const [about, setAbout] = React.useState<string|null>(props.about);

    const [error, setError] = React.useState<string|null>(null);
    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.patch("admin/cesspool/c/" + props.code, {code: code, owner: owner, city: district + "/" + city, subscription: sub, about: about})
             .then(res => props.onUpdate(res.data))
             .catch(err => setError("Nepodarilo sa nastaviť."))
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            <TheInput
                autoFocus
                type="text"
                spellCheck={false}
                placeholder="Kod"
                value={code}
                onChange={onChangeSetState(setCode, setError)} 
                required={true}
            />

            <TheInput
                autoFocus
                type="email"
                spellCheck={false}
                placeholder="Vlastnik"
                value={owner}
                onChange={onChangeSetState(setOwner, setError)} 
                required={true}
            />

            <TheInput
                autoFocus
                type="text"
                spellCheck={false}
                placeholder="Poznamka"
                value={about ? about : ""}
                onChange={onChangeSetState(setAbout, setError, false)} 
                required={true}
                maxLength={25}
            />

            <CityInput
                district={district}
                city={city}
                setError={setError}
                onCityChange={value => { setCity(value); setError(null) }}
                onDistrictChange={value => { setDistrict(value); setError(null) }}
            />

            <TheSubInput defaultSub={sub} onChange={setSub}/>

            {
                error && <TheError>{error}</TheError>
            }

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

            
        </TheForm>
    )
}

export default CesspoolSettings;