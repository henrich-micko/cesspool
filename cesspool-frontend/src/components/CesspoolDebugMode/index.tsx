import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheForm from "@components/TheForm";
import TheInput, { onChangeSetState, TheInputWrapper, TheRangeInput } from "@components/TheInput";
import useAxios from "@hooks/useAxios";
import { Cesspool } from "@types";
import React from "react";
import { glass } from "../../settings";
import styles from "./styles.module.scss";


interface _CesspoolDebugMode {
    code: string;
    onUpdate(c: Cesspool): void;
}


export const CesspoolDebugModeTurnOn: React.FC<_CesspoolDebugMode> = (props) => {
    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        axios.patch("admin/cesspool/c/" + props.code, { debug_mode: true })
             .then(res => props.onUpdate(res.data))
             .catch(err => {});
    };
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
            <span style={{ textAlign: "left", color: glass }}>Tento profil slúži pre developeŕov, budú sa ukladať všetky záznamy aj s mqtt správami.
            Po vypnutí, sa všetky záznamy vytvorené v debug profile odstránia.</span>

            <TheButtonWrapper>
                <TheButtonInput 
                    style={{
                    fontSize: "1em",
                    marginTop: "1em",
                    border: "2px solid #4FACF7"
                }}
                type="submit" 
                value="Zapnuť"
            />
            </TheButtonWrapper>
    </TheForm>
    )
};


export const CesspoolDebugModeTurnOff: React.FC<_CesspoolDebugMode> = (props) => {
    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        axios.patch("admin/cesspool/c/" + props.code, { debug_mode: false })
             .then(res => props.onUpdate(res.data))
             .catch(err => {});
    };
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
            <span style={{ textAlign: "left", color: glass }}>Po vypnuťi sa všetky záznamy vytvorene v debug mode odstránia.</span>

            <TheButtonWrapper>
                <TheButtonInput 
                    style={{
                    fontSize: "1em",
                    marginTop: "1em",
                    border: "2px solid #ff5454"
                }}
                type="submit" 
                value="Vypnúť"
            />
            </TheButtonWrapper>
        </TheForm>
    )
};


interface _GenerateCesspoolRecords {
    code: string;
    onSubmit(): void;
}

export const GenerateCesspoolRecords: React.FC<_GenerateCesspoolRecords> = (props) => {
    const [days, setDays] = React.useState<number>(1);
    const [perDay, setPerDay] = React.useState<number>(8);
    
    const axios = useAxios();
    
    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        axios.get("admin/cesspool/c/" + props.code + "/records/generate?days=" + days + "&freq=" + perDay)
             .then(res => props.onSubmit())
             .catch(err => {});
    };
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
            <span style={{ textAlign: "left", color: glass }}>Vygenerovať falošne záznamy ktore budú po vypnuti debug mode vymazane.</span>

            <TheInputWrapper>
                <span>Počet dní: {days}</span>
                <TheRangeInput 
                    type="range"
                    value={days} 
                    onChange={onChangeSetState(setDays)}
                    min={1}
                    max={100}
                />
            </TheInputWrapper>

            <TheInputWrapper>
                <span>Každých: {perDay} hodin</span>
                <TheRangeInput 
                    type="range"
                    value={perDay} 
                    onChange={onChangeSetState(setPerDay)}
                    min={1}
                    max={8}
                />
            </TheInputWrapper>

            <TheButtonWrapper>
                <TheButtonInput 
                        style={{
                        fontSize: "1em",
                        marginTop: "1em",
                        border: "2px solid #4FACF7"
                    }}
                    type="submit" 
                    value="Generovať"
                />
            </TheButtonWrapper>
        </TheForm>
    );
};