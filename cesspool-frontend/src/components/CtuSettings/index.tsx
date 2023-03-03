import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import React, { useState } from "react";
import { CesspoolToUser } from "@types";


interface _CtuSettings {
    pk: number;
    code: string;
    title: string|null;
    contact_at_level: number;
    onUpdate(ctu: CesspoolToUser): void;
}

const CtuSettings: React.FC<_CtuSettings> = (props) => {
    const [title,  setTitle] = useState<string>(props.title ? props.title : "");
    const [contactAtLevel, setContactAtLevel] = useState<number>(props.contact_at_level);
    const [error, setError] = useState<string|null>(null);

    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
 
        axios.put("cesspool/" + props.code + "/", {title: title, contact_at_level: contactAtLevel})
             .then(res => props.onUpdate(res.data))
             .catch(err => setError("Nepodarilo sa nastaviť."))
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            <TheInput
                autoFocus
                type="text"
                spellCheck={false}
                placeholder="Názov"
                value={title}
                onChange={onChangeSetState(setTitle, setError)} 
                required={true}
            />

            <TheInput
                autoFocus
                type="number"
                spellCheck={false}
                placeholder="Kontaktovať pri hladine"
                value={contactAtLevel}
                onChange={onChangeSetState(setContactAtLevel, setError)} 
                required={true}
            />

            {
                error && <TheError>Nepodarilo sa nastaviť.</TheError>
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

export default CtuSettings;