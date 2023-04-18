import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheError from "@components/TheError";
import TheForm from "@components/TheForm";
import TheInput, { onChangeSetState } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import { Cesspool } from "@types";
import { formatDate } from "../../formats";
import React from "react";
import 'react-calendar/dist/Calendar.css';
import "./styles.scss";
import { glass } from "../../settings";


interface _SubCalendar {
    value: string|null;
    code: string;
    setCesspool(cesspool: Cesspool): void;
}

const SubCalendar: React.FC<_SubCalendar> = (props) => {
    const [date, setDate] = React.useState<string|null>(props.value !== null ? formatDate(props.value) : null);
    const [error, setError] = React.useState<string|null>(null);

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!date) return;
        axios.patch("admin/cesspool/c/" + props.code, {subscription_expiration_date: formatDate(date)})
             .then(res => props.setCesspool(res.data))
             .catch(err => setError("Nepodarilo sa nastaviť."));
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            
            <TheInput 
                type="text"
                value={date ? date : ""}
                placeholder={"Dátum vo formáte yyyy-dd-mm..."}
                onChange={onChangeSetState(setDate, setError)}
            />

            <span style={{color: glass}}>Po uplinutí tohoto dňa nebude žumpomer ukladať záznamy.</span>

            <TheError>{error}</TheError>

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

export default SubCalendar;