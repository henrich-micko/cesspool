import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheForm from "@components/TheForm";
import useAxios from "@hooks/useAxios";
import { Cesspool } from "@types";
import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./styles.scss";


interface _SubCalendar {
    value: string|null;
    code: string;
    setCesspool(cesspool: Cesspool): void;
}

const SubCalendar: React.FC<_SubCalendar> = (props) => {
    const [date, setDate] = React.useState<string|null>(props.value);

    const axios = useAxios();
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        axios.patch("admin/cesspool/c/" + props.code, {subscription_expiration_date: date})
             .then(res => props.setCesspool(res.data))
             .catch(err => {});
    }

    const handleChange = (value: any) => {
        setDate(value.getFullYear() + "-" + Number(value.getMonth()) + 1 + "-" + value.getDate());
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            <Calendar defaultValue={props.value} onChange={handleChange} />
        
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