import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React from "react";
import { Cesspool } from "@types";
import CityInput from "@components/CityInput";
import TheSubInput from "@components/TheSubInput";


interface _CesspoolCreate {
    defaultDistrict?: string,
    defaultCity?: string,
    onCreate(cesspool: Cesspool): void;
}


const CesspoolCreate: React.FC<_CesspoolCreate> = (props) => {
    const [code, setCode] = React.useState<string|null>(null);
    const [district, setDistrict] = React.useState<string|null>(props.defaultDistrict !== undefined ? props.defaultDistrict : null);
    const [city, setCity] = React.useState<string|null>(props.defaultCity !== undefined ? props.defaultCity : null);
    const [owner, setOwner] = React.useState<string|null>(null);
    const [sub, setSub] = React.useState<number>(1);
    const [about, setAbout] = React.useState<string|null>(null);
    const [error, setError] = React.useState<string|null>(null);
    
    const axios = useAxios();

    const fetchCesspoolCode = () => {
        axios.get("admin/cesspool/code")
             .then(res => setCode(res.data.value))
             .catch(err => {});
    }
    
    React.useEffect(fetchCesspoolCode, []);

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log(district + "/" + city);
        axios.post("admin/cesspool/create", {code: code, city: district + "/" + city, owner: owner, subscription: sub, about: about})
             .then(res => props.onCreate(res.data))
             .catch(err => setError("Nepodarilo sa vytvoriť."));
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            <TheInput
                autoFocus
                type="text"
                spellCheck={false}
                placeholder="Kod"
                value={code ? code : ""}
                onChange={onChangeSetState(setCode, setError)} 
                required={true}
            />

            <TheInput
                autoFocus
                type="email"
                spellCheck={false}
                placeholder="Vlastnik"
                value={owner ? owner : ""}
                onChange={onChangeSetState(setOwner, setError)} 
                required={false}
            />

            <TheInput
                autoFocus
                type="text"
                spellCheck={false}
                placeholder="Poznamka"
                value={about ? about : ""}
                onChange={onChangeSetState(setAbout, setError, false)} 
                required={false}
                maxLength={25}
            />

            <CityInput
                district={district ? district : ""}
                city={city ? city : ""}
                setError={setError}
                onCityChange={value => { setCity(value); setError(null) }}
                onDistrictChange={value => { setDistrict(value); setError(null) }}
            />

            <TheSubInput defaultSub={sub ? sub : 1} onChange={setSub}/>

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

export default CesspoolCreate;